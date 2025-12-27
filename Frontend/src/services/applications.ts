import axios from 'axios';
import { API_BASE_URL } from '@/Auth/config';

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
      const currentPath = window.location.pathname;
      if (currentPath.includes('/student')) {
        window.location.href = '/auth/student/login';
      } else if (currentPath.includes('/alumni')) {
        window.location.href = '/auth/alumni/login';
      } else {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export interface ApplicationStudent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  college: string;
  department: string;
  graduationYear: number;
  skills?: string[];
  resume?: string;
}

export interface ApplicationDetail {
  _id: string;
  student: ApplicationStudent;
  opportunity: {
    _id: string;
    jobTitle: string;
    roleDescription: string;
    experienceLevel: string;
  };
  status: 'pending' | 'shortlisted' | 'referred' | 'rejected';
  appliedAt: string;
  updatedAt: string;
  statusHistory?: Array<{
    status: string;
    changedAt: string;
    changedBy: string;
  }>;
}

export interface ApplicationsResponse {
  success: boolean;
  count: number;
  data: ApplicationDetail[];
}

export interface SingleApplicationResponse {
  success: boolean;
  data: ApplicationDetail;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const applicationsApi = {
  /**
   * Get all applications for a specific opportunity (Alumni only - owner)
   * @param opportunityId - ID of the opportunity
   */
  getApplicationsForOpportunity: async (opportunityId: string): Promise<ApplicationsResponse> => {
    const response = await api.get(`/applications/${opportunityId}`);
    return response.data;
  },

  /**
   * View a student's profile (Alumni - same college)
   * @param studentId - ID of the student
   */
  getStudentProfile: async (studentId: string): Promise<SingleApplicationResponse> => {
    const response = await api.get(`/applications/student/${studentId}`);
    return response.data;
  },

  /**
   * Shortlist a student application (Alumni only - owner)
   * @param applicationId - ID of the application
   */
  shortlistApplication: async (applicationId: string): Promise<ActionResponse> => {
    const response = await api.post(`/applications/${applicationId}/shortlist`);
    return response.data;
  },

  /**
   * Mark an application as referred (Alumni only - owner)
   * @param applicationId - ID of the application
   */
  referApplication: async (applicationId: string): Promise<ActionResponse> => {
    const response = await api.post(`/applications/${applicationId}/refer`);
    return response.data;
  },

  /**
   * Reject a student application (Alumni only - owner)
   * @param applicationId - ID of the application
   */
  rejectApplication: async (applicationId: string): Promise<ActionResponse> => {
    const response = await api.post(`/applications/${applicationId}/reject`);
    return response.data;
  },
};
