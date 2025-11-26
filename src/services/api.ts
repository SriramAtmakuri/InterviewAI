import axios from 'axios';
import { auth } from '../config/firebase';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Interview API
export const interviewAPI = {
  start: (data: any) => api.post('/interviews/start', data),
  sendMessage: (interviewId: string, message: string) =>
    api.post(`/interviews/${interviewId}/message`, { message }),
  end: (interviewId: string) => api.post(`/interviews/${interviewId}/end`),
  getDetails: (interviewId: string) => api.get(`/interviews/${interviewId}`),
  getHistory: (limit?: number) => api.get('/interviews', { params: { limit } }),
};

// Code API
export const codeAPI = {
  execute: (code: string, language: string, testCases?: any[]) =>
    api.post('/code/execute', { code, language, testCases }),
  submit: (interviewId: string, code: string, language: string, problem: string) =>
    api.post(`/code/submit/${interviewId}`, { code, language, problem }),
  validate: (code: string, language: string) =>
    api.post('/code/validate', { code, language }),
  analyze: (code: string, problem: string, language: string) =>
    api.post('/code/analyze', { code, problem, language }),
  getLanguages: () => api.get('/code/languages'),
};

// Resume API
export const resumeAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  analyze: (resumeText: string, jobDescription: string) =>
    api.post('/resume/analyze', { resumeText, jobDescription }),
  generateQuestions: (resumeText: string, jobDescription: string) =>
    api.post('/resume/questions', { resumeText, jobDescription }),
  extractSkills: (resumeText: string) =>
    api.post('/resume/skills', { resumeText }),
  getSuggestions: (resumeText: string) =>
    api.post('/resume/suggestions', { resumeText }),
  benchmark: (resumeText: string, targetRole: string) =>
    api.post('/resume/benchmark', { resumeText, targetRole }),
  getAll: () => api.get('/resume'),
};

// Video API
export const videoAPI = {
  upload: (file: File, interviewId: string) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('interviewId', interviewId);
    return api.post('/video/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadChunk: (chunk: Blob, interviewId: string, chunkIndex: number) => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('interviewId', interviewId);
    formData.append('chunkIndex', chunkIndex.toString());
    return api.post('/video/chunk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  finalize: (interviewId: string, totalChunks: number) =>
    api.post('/video/finalize', { interviewId, totalChunks }),
  getRecordings: (interviewId: string) =>
    api.get(`/video/interview/${interviewId}`),
  delete: (recordingId: string) => api.delete(`/video/${recordingId}`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  getStats: () => api.get('/user/stats'),
};

export default api;
