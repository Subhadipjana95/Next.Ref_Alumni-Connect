import axios from 'axios';
import { API_BASE_URL } from '@/services/Auth/config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export interface SignedUrlResponse {
  success: boolean;
  signedUrl: string;
  message: string;
}

export const interviewApi = {
  /**
   * Get signed URL for ElevenLabs conversation
   */
  getSignedUrl: async (): Promise<SignedUrlResponse> => {
    const response = await api.get('/interview/signed-url');
    return response.data;
  },
};
