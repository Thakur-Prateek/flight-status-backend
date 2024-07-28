const cron = require('node-cron');
const axios = require('axios');
const amqp = require('amqplib/callback_api');
const db = require('./models'); // Assuming Sequelize models are in 'models' directory
const config = require('./config'); // Load the configuration file

const sendNotificationMessage = (notificationMessage) => {
  amqp.connect(config.rabbitMQ.url, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      const queue = 'flight_notifications';
      const msg = JSON.stringify(notificationMessage);

      channel.assertQueue(queue, {
        durable: false
      });

      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  });
};

const fetchUserFlightDetails = async () => {
  try {
    const users = await db.User.findAll({
      include: [{ model: db.Flight, as: 'flights' }]
    });
    const flightNumbers = [];
    users.forEach(user => {
      user.flights.forEach(flight => {
        flightNumbers.push(flight.flight_number);
      });
    });
    return flightNumbers;
  } catch (error) {
    console.error('Error fetching user flight details:', error);
    return [];
  }
};

const fetchFlightStatus = async () => {
  try {
    const userFlightNumbers = await fetchUserFlightDetails();
    const response = await axios.get(`http://api.aviationstack.com/v1/flights?access_key=${config.aviationStack.apiKey}&limit=100`);
    const flights = response.data.data;

    for (const flight of flights) {
      const { flight } = flight;
      if (!flight || !flight.number) {
        console.error('Invalid flight data:', flight);
        continue;
      }
      const flight_number = flight.number;
      const { departure, arrival, flight_status } = flight;

      if (!userFlightNumbers.includes(flight_number)) {
        continue; // Skip flights not associated with any user
      }

      console.log(`Fetched flight: ${flight_number}, departure: ${departure.scheduled}, arrival: ${arrival.scheduled}, status: ${flight_status}`);

      const existingFlight = await db.Flight.findOne({ where: { flight_number } });

      if (existingFlight) {
        await db.Flight.update({
          departure_time: departure.scheduled,
          arrival_time: arrival.scheduled,
          status: flight_status,
          gate: departure.gate,
          terminal: departure.terminal
        }, {
          where: { flight_number }
        });

        // Create notification message
        const notificationMessage = {
          flight_number,
          departure_time: departure.scheduled,
          arrival_time: arrival.scheduled,
          status: flight_status,
          gate: departure.gate,
          terminal: departure.terminal,
        };

        // Send notification message to RabbitMQ
        sendNotificationMessage(notificationMessage);
      }
    }
  } catch (error) {
    console.error('Error fetching flight status:', error);
  }
};

// Schedule the job to run every 5 minutes
cron.schedule('*/5 * * * *', fetchFlightStatus);

module.exports = { fetchFlightStatus }; // Export fetchFlightStatus function
