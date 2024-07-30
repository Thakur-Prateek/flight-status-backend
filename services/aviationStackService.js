// services/aviationStackService.js

const axios = require('axios');

const apiKey = '596718d2b47cac494371ac6883938000';
const baseUrl = 'http://api.aviationstack.com/v1';

async function getFlightStatus(flightNumber) {
    try {
        const response = await axios.get(`${baseUrl}/flights`, {
            params: {
                access_key: apiKey,
                flight_iata: flightNumber
            }
        });
        if (response.data && response.data.data && response.data.data.length > 0) {
            return response.data.data[0];
        } else {
            throw new Error('No flight data found');
        }
    } catch (error) {
        console.error('Error fetching flight status:', error.message);
        throw error;
    }
}

module.exports = {
    getFlightStatus
};
