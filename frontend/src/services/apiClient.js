import axios from 'axios';

// Configure Axios with the base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Base URL for all API calls
});

export default apiClient;
