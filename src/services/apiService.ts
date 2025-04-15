import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token from localStorage before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiService = {
  signup: async (username: string, password: string) => {
    const response = await api.post('/chrono/signup', { username, password });
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await api.post('/chrono/login', { username, password });
    const token = response.data.token;
    if (token) localStorage.setItem('token', token);
    return response.data;
  },

  getTimelines: async () => {
    const response = await api.get('/chrono/view/timelines');
    return response.data;
  },

  getFileVersions: async () => {
    const response = await api.get('/chrono/view/file-versions');
    return response.data;
  },

  getCapsules: async () => {
    const response = await api.get('/chrono/view/capsules');
    return response.data;
  },

  getSnapshots: async () => {
    const response = await api.get('/chrono/view/ebs-snapshots');
    return response.data;
  },

  getEC2Instances: async () => {
    const response = await api.get('/chrono/view/ec2-instances');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default apiService;
