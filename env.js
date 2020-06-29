const dev = process.env.NODE_ENV === 'development';

const apiURL = dev
  ? process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api'
  : process.env.REACT_APP_BACKEND_URL || 'https://api.corona-school.de/api';

const js = `window.env=${JSON.stringify({ apiURL })}\n`;

exports.default = js;
