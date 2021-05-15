import runtimeEnv from '@mars/heroku-js-runtime-env';

const liveDomains = [
  'dashboard.corona-school.de',
  'my.corona-school.de',
  'web-user-app-live.herokuapp.com',
  'nrw.corona-school.de',
  'jufo.corona-school.de',
  'partnerschule.corona-school.de',
  'drehtuer.corona-school.de',
  'dashboard.lern-fair.de',
  'my.lern-fair.de',
  'nrw.lern-fair.de',
  'jufo.lern-fair.de',
  'partnerschule.lern-fair.de',
  'drehtuer.lern-fair.de',
];

export const env = runtimeEnv();

const devAPI =
  process.env.REACT_APP_MODE === 'LOCAL'
    ? 'http://localhost:5000/api'
    : env.REACT_APP_BACKEND_URL ?? 'https://dev.api.corona-school.de/api';

export const apiURL = liveDomains.includes(window.location.host)
  ? env.REACT_APP_BACKEND_URL ?? 'https://api.corona-school.de/api'
  : devAPI;

export const dev = process.env.NODE_ENV === 'development';
