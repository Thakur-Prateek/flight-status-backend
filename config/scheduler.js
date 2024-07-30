// config/scheduler.js

const cron = require('node-cron');
const { fetchFlightStatus } = require('../jobs/fetchFlightStatus');

cron.schedule('*/5 * * * *', () => {
    console.log('Running fetchFlightStatus job...');
    fetchFlightStatus();
});
