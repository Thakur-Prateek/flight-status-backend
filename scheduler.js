const cron = require('node-cron');
const { triggerFetch } = require('./triggerFetch');

cron.schedule('*/5 * * * *', () => {
  console.log('Running a task every 5 minutes');
  triggerFetch();
});
