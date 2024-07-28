const { fetchFlightStatus } = require('./scheduler');

// Manually trigger the fetch function
fetchFlightStatus().catch(error => console.error('Error fetching flight status:', error));
