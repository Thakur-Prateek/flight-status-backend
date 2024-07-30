// jobs/fetchFlightStatus.js

const db = require('../models');
const { getFlightStatus } = require('../services/aviationStackService');
const { sendNotification } = require('../events/producer');

async function fetchFlightStatus() {
    try {
        const flights = await db.Flight.findAll();

        for (const flight of flights) {
            const flightStatus = await getFlightStatus(flight.flight_number);

            if (flightStatus && flightStatus.status !== flight.status) {
                await db.Flight.update(
                    {
                        status: flightStatus.status,
                        departure_time: flightStatus.departure.estimated || flightStatus.departure.scheduled,
                        arrival_time: flightStatus.arrival.estimated || flightStatus.arrival.scheduled,
                        gate: flightStatus.departure.gate,
                        terminal: flightStatus.departure.terminal
                    },
                    { where: { id: flight.id } }
                );

                const user = await db.User.findOne({ where: { id: flight.user_id } });

                if (user) {
                    await sendNotification({
                        user,
                        flightDetails: {
                            flightNumber: flight.flight_number,
                            departureTime: flightStatus.departure.estimated || flightStatus.departure.scheduled,
                            arrivalTime: flightStatus.arrival.estimated || flightStatus.arrival.scheduled,
                            status: flightStatus.status,
                            gate: flightStatus.departure.gate,
                            terminal: flightStatus.departure.terminal
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error in fetchFlightStatus job:', error.message);
    }
}

module.exports = {
    fetchFlightStatus
};
