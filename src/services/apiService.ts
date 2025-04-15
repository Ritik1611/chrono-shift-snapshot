
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // This should match your Flask backend URL

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/chrono/login', { username, password });
      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('currentUser', username);
      }
      return { success: true, token: response.data.token, username };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Invalid username or password' };
    }
  },
  
  signup: async (username: string, password: string) => {
    try {
      const response = await api.post('/chrono/signup', { username, password });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  },
  
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
  },
  
  // Timeline endpoints
  getTimelines: async () => {
    try {
      const response = await api.get('/chrono/view/timelines');
      return response.data;
    } catch (error) {
      console.error('Get timelines error:', error);
      throw error;
    }
  },
  
  getFileVersions: async () => {
    try {
      const response = await api.get('/chrono/view/file-versions');
      return response.data;
    } catch (error) {
      console.error('Get file versions error:', error);
      throw error;
    }
  },
  
  // Capsule endpoints
  getCapsules: async () => {
    try {
      const response = await api.get('/chrono/list-capsules');
      return response.data.capsules;
    } catch (error) {
      console.error('Get capsules error:', error);
      throw error;
    }
  },
  
  createCapsule: async (capsuleName: string, files: Record<string, string>) => {
    try {
      const response = await api.post('/chrono/clone', {
        capsule_name: capsuleName,
        files: files
      });
      return response.data;
    } catch (error) {
      console.error('Create capsule error:', error);
      throw error;
    }
  },
  
  shiftCapsule: async (capsuleName: string) => {
    try {
      const response = await api.post('/chrono/shift-capsule', {
        capsule_name: capsuleName
      });
      return response.data;
    } catch (error) {
      console.error('Shift capsule error:', error);
      throw error;
    }
  },
  
  // EC2 Instance endpoints
  awakenInstance: async () => {
    try {
      const response = await api.post('/chrono/awaken');
      return response.data;
    } catch (error) {
      console.error('Awaken instance error:', error);
      throw error;
    }
  },
  
  // EBS endpoints
  createEbsSnapshot: async () => {
    try {
      const response = await api.post('/chrono/ebs-snapshot');
      return response.data;
    } catch (error) {
      console.error('Create EBS snapshot error:', error);
      throw error;
    }
  },
  
  restoreEbsSnapshot: async () => {
    try {
      const response = await api.post('/chrono/ebs-restore');
      return response.data;
    } catch (error) {
      console.error('Restore EBS snapshot error:', error);
      throw error;
    }
  },
  
  // File endpoints
  warpFile: async (file: File, filePath: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_path', filePath);
      
      const response = await api.post('/chrono/warp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Warp file error:', error);
      throw error;
    }
  },
  
  timejump: async (filename: string, timeMark: string) => {
    try {
      const response = await api.get('/chrono/timejump', {
        params: {
          filename,
          time_mark: timeMark
        }
      });
      return response.data;
    } catch (error) {
      console.error('Timejump error:', error);
      throw error;
    }
  },
  
  flashbackDiff: async (filename: string, timeMark1: string, timeMark2: string) => {
    try {
      const response = await api.post('/chrono/flashback', {
        filename,
        time_mark1: timeMark1,
        time_mark2: timeMark2
      });
      return response.data;
    } catch (error) {
      console.error('Flashback diff error:', error);
      throw error;
    }
  },
  
  eraseFile: async (filename: string) => {
    try {
      const response = await api.post('/chrono/erase', {
        filename
      });
      return response.data;
    } catch (error) {
      console.error('Erase file error:', error);
      throw error;
    }
  },
  
  getPresentStatus: async () => {
    try {
      const response = await api.get('/chrono/present');
      return response.data;
    } catch (error) {
      console.error('Get present status error:', error);
      throw error;
    }
  },
  
  getFileTimeline: async (filename: string) => {
    try {
      const response = await api.get('/chrono/timeline', {
        params: { filename }
      });
      return response.data;
    } catch (error) {
      console.error('Get file timeline error:', error);
      throw error;
    }
  },
  
  rewindFile: async (filename: string, timeMark: string) => {
    try {
      const response = await api.post('/chrono/rewind', {
        filename,
        time_mark: timeMark
      });
      return response.data;
    } catch (error) {
      console.error('Rewind file error:', error);
      throw error;
    }
  }
};
