// utils/getBaseUrl.js
const os = require('os');

const getBaseUrl = () => {
  const hostname = os.hostname().toLowerCase();

  // You can fine-tune these conditions to match your local setup
  const isLocal =
    hostname.includes('desktop') ||
    hostname.includes('kuntal') || 
    hostname.includes('local') ||
    hostname === 'localhost';

  return isLocal
    ? process.env.LOCAL_BASE_URL || 'http://localhost:8080'
    : process.env.LIVE_BASE_URL || 'https://your-live-site.com';
};

module.exports = getBaseUrl;
