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
      // Token is invalid or missing
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Redirect to login page
      window.location.href = '/auth/student/login';
    }
    return Promise.reject(error);
  }
);

export interface Project {
  title: string;
  description?: string;
  link?: string;
  _id?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  date?: string;
  _id?: string;
}

export interface StudentProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  image?: string;
  college: {
    _id: string;
    name: string;
    matchingName: string;
  };
  branch?: string;
  graduationYear?: number;
  skills?: string[];
  projects?: Project[];
  certifications?: Certification[];
  preferredRoles?: string[];
  resume?: {
    url: string;
    publicId: string;
  };
  resumeStatus?: string;
  profileCompleteness: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  branch?: string;
  graduationYear?: number;
  skills?: string[];
  projects?: Project[];
  certifications?: Certification[];
  preferredRoles?: string[];
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: StudentProfile;
}

export interface ProfileStatusResponse {
  success: boolean;
  message: string;
  data: {
    completeness: number;
    strength: string;
    missingFields: string[];
    breakdown: {
      basicInfo: string;
      college: string;
      academic: string;
      skills: string;
      projects: string;
      certifications: string;
      preferredRoles: string;
      resume: string;
    };
  };
}

export const studentProfileApi = {
  // Get student profile
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  // Update student profile
  updateProfile: async (data: UpdateProfilePayload): Promise<ProfileResponse> => {
    const response = await api.put('/student/profile', data);
    return response.data;
  },

  // Get profile completion status
  getProfileStatus: async (): Promise<ProfileStatusResponse> => {
    const response = await api.get('/student/profile/status');
    return response.data;
  },
};
