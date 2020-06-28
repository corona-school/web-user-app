export const dev = process.env.NODE_ENV === 'development';

export const apiURL = dev
  ? process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api'
  : process.env.REACT_APP_BACKEND_URL || 'https://api.corona-school.de/api';
