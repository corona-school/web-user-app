const liveDomains = [
  'dashboard.corona-school.de',
  'my.corona-school.de',
  'web-user-app-live.herokuapp.com',
];

// const devAPI = 'https://dev.api.corona-school.de/api';
const devAPI = 'http://localhost:5000/api';

export const apiURL = liveDomains.includes(window.location.host)
  ? 'https://api.corona-school.de/api'
  : devAPI;

export const dev = process.env.NODE_ENV === 'development';
