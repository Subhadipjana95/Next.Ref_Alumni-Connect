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

export interface Opportunity {
  _id: string;
  jobTitle: string;
  roleDescription: string;
  requiredSkills: string[];
  experienceLevel: string;
  numberOfReferrals: number;
  referralsGiven: number;
  postedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    designation: string;
  };
  college: string;
  status: 'Open' | 'Closed';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunitiesResponse {
  success: boolean;
  message: string;
  count: number;
  data: Opportunity[];
}

export interface ApplicationPayload {
  opportunityId: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    application: {
      _id: string;
      student: string;
      opportunity: string;
      status: string;
      appliedAt: string;
    };
  };
}

export interface MyApplication {
  _id: string;
  student: string;
  opportunity: {
    _id: string;
    jobTitle: string;
    roleDescription: string;
    experienceLevel: string;
    postedBy: {
      firstName: string;
      lastName: string;
      company: string;
      designation: string;
    };
  };
  status: string;
  appliedAt: string;
  updatedAt: string;
}

export interface MyApplicationsResponse {
  success: boolean;
  count: number;
  data: MyApplication[];
}

export interface CreateOpportunityPayload {
  jobTitle: string;
  roleDescription: string;
  requiredSkills?: string[];
  experienceLevel: string;
  numberOfReferrals: number;
}

export interface UpdateOpportunityPayload {
  jobTitle?: string;
  roleDescription?: string;
  requiredSkills?: string[];
  experienceLevel?: string;
  numberOfReferrals?: number;
}

export interface OpportunityResponse {
  success: boolean;
  message: string;
  data: Opportunity;
}

export const opportunitiesApi = {
  // Create a new opportunity (Alumni only)
  createOpportunity: async (payload: CreateOpportunityPayload): Promise<OpportunityResponse> => {
    const response = await api.post('/opportunities/create', payload);
    return response.data;
  },

  // Update an opportunity (Alumni only - owner)
  updateOpportunity: async (opportunityId: string, payload: UpdateOpportunityPayload): Promise<OpportunityResponse> => {
    const response = await api.put(`/opportunities/${opportunityId}`, payload);
    return response.data;
  },

  // Delete/Close an opportunity (Alumni only - owner)
  deleteOpportunity: async (opportunityId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/opportunities/${opportunityId}`);
    return response.data;
  },

  // Get all opportunities from same college
  getOpportunities: async (): Promise<OpportunitiesResponse> => {
    const response = await api.get('/opportunities');
    return response.data;
  },

  // Get my posted opportunities (Alumni only)
  getMyOpportunities: async (): Promise<OpportunitiesResponse> => {
    const response = await api.get('/my-opportunities');
    return response.data;
  },

  // Apply for referral
  applyForReferral: async (opportunityId: string): Promise<ApplicationResponse> => {
    const response = await api.post('/apply', { opportunityId });
    return response.data;
  },

  // Get my applications
  getMyApplications: async (): Promise<MyApplicationsResponse> => {
    const response = await api.get('/my-applications');
    return response.data;
  },

  // Get application details
  getApplicationDetails: async (applicationId: string): Promise<any> => {
    const response = await api.get(`/my-applications/${applicationId}`);
    return response.data;
  },
};
