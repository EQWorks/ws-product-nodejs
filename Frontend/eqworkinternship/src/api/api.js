import axios from 'axios'

const port = process.env.REACT_APP_PORT || 5000 ;
const baseUrl = `http://localhost:${port}` ;

const API = axios.create({baseURL: `${baseUrl}`});

export const welcomeApi = () => API.get('/');

export const dailyStatApi = () => API.get('/stats/daily');

export const hourlyStatApi = () => API.get('/stats/hourly');

export const dailyEventApi = () => API.get('/events/daily');

export const hourlyEventApi = () => API.get('/events/hourly');