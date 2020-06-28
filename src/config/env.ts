export const dev = process.env.NODE_ENV === 'development';

const url = dev
  ? process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api'
  : process.env.REACT_APP_BACKEND_URL || 'https://api.corona-school.de/api';

console.log(url);

(window as any).apiURL = url;

export const apiURL = (window as any).apiURL;
