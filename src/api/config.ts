const liveDomains = [
  'dashboard.corona-school.de',
  'my.corona-school.de',
  'web-user-app-live.herokuapp.com',
  'nrw.corona-school.de',
];

const devAPI =
  process.env.REACT_APP_MODE === 'LOCAL'
    ? 'http://localhost:5000/api'
    : 'https://dev.api.corona-school.de/api';

export const apiURL = liveDomains.includes(window.location.host)
  ? 'https://api.corona-school.de/api'
  : devAPI;

export const dev = process.env.NODE_ENV === 'development';
