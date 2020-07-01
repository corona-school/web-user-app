const liveDomains = [
  'dashboard.corona-school.de',
  'my.corona-school.de',
  'web-user-app-live.herokuapp.com',
];

console.log(window.location.hostname);

export const apiURL = liveDomains.includes(window.location.host)
  ? 'https://api.corona-school.de/api'
  : 'https://dev.api.corona-school.de/api';

export const dev = process.env.NODE_ENV === 'development';
