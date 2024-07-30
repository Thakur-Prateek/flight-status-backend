const axios = require('axios');
const db = require('./index');
const { sendNotification } = require('./events/producer');

const triggerFetch = async () => {
  try {
    const flights = await db.flight.findAll();
    for (const flight of flights) {
      const response = await axios.get(`http://api.aviationstack.com/v1/flights?access_key=596718d2b47cac494371ac6883938000&flight_number=${flight.flight_number}`);
      const flightData = response.data.data[0];
      if (flightData) {
        flight.status = flightData.flight_status;
        flight.save();
        if (flightData.flight_status !== flight.status) {
          await sendNotification({
            user: await db.user.findOne({ where: { id: flight.user_id } }),
            flightDetails: flight
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching flight data:', error);
  }
};

module.exports = { triggerFetch };
