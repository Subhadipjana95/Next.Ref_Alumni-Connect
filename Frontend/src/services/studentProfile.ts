import axios from 'axios';
import { API_BASE_URL } from '@/services/Auth/config';

// Create axios instance with base configuration
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

// ============================================
// Type Definitions
// ============================================

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

// Resume stored as PDF in MongoDB
export interface ResumeData {
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  uploadedAt?: string;
  data?: Buffer; // PDF binary data (not returned in JSON responses)
}

// LinkedIn data with optional URL and PDF
export interface LinkedInData {
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  uploadedAt?: string;
  linkedInUrl?: string;
  data?: Buffer; // PDF binary data (not returned in JSON responses)
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
  resume?: ResumeData;
  linkedIn?: LinkedInData;
  githubUrl?: string;
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
      linkedIn: string;
      github: string;
    };
  };
}

// ============================================
// Resume API Response Types
// ============================================

export interface ResumeUploadResponse {
  success: boolean;
  message: string;
  data: {
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    profileCompleteness: number;
  };
}

// ============================================
// LinkedIn API Response Types
// ============================================

export interface LinkedInUploadResponse {
  success: boolean;
  message: string;
  data: {
    fileName?: string;
    fileSize?: number;
    uploadedAt?: string;
    linkedInUrl?: string;
    profileCompleteness: number;
  };
}

export interface LinkedInUrlResponse {
  success: boolean;
  message: string;
  data: {
    linkedInUrl: string;
    profileCompleteness: number;
  };
}

// ============================================
// GitHub URL API Response Types
// ============================================

export interface GithubUrlResponse {
  success: boolean;
  message: string;
  data: {
    githubUrl?: string;
    profileCompleteness?: number;
  };
}

// ============================================
// Delete Response Type
// ============================================

export interface DeleteResponse {
  success: boolean;
  message: string;
  data: {
    profileCompleteness: number;
  };
}

// ============================================
// Profile API Functions
// ============================================

export const studentProfileApi = {
  // Get student profile
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  // Update student profile (branch, graduationYear, skills, projects, etc.)
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

// ============================================
// Resume API Functions
// ============================================

export const resumeApi = {
  /**
   * Upload resume PDF (first time)
   * @param file - PDF file to upload
   * @returns Upload response with file details
   */
  uploadResume: async (file: File): Promise<ResumeUploadResponse> => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/student/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update/replace existing resume PDF
   * @param file - New PDF file to upload
   * @returns Upload response with file details
   */
  updateResume: async (file: File): Promise<ResumeUploadResponse> => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.put('/student/resume/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Download resume PDF
   * @returns PDF file as Blob
   */
  getResume: async (): Promise<Blob> => {
    const response = await api.get('/student/resume', {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Delete resume PDF
   * @returns Delete response with updated profile completeness
   */
  deleteResume: async (): Promise<DeleteResponse> => {
    const response = await api.delete('/student/resume');
    return response.data;
  },
};

// ============================================
// LinkedIn API Functions
// ============================================

export const linkedInApi = {
  /**
   * Upload LinkedIn PDF with optional URL (first time)
   * @param file - LinkedIn PDF file
   * @param linkedInUrl - Optional LinkedIn profile URL
   * @returns Upload response with file details
   */
  uploadLinkedIn: async (file: File, linkedInUrl?: string): Promise<LinkedInUploadResponse> => {
    const formData = new FormData();
    formData.append('linkedIn', file);
    if (linkedInUrl) {
      formData.append('linkedInUrl', linkedInUrl);
    }
    
    const response = await api.post('/student/linkedin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update only LinkedIn URL (without changing PDF)
   * @param linkedInUrl - New LinkedIn profile URL
   * @returns Response with updated URL
   */
  updateLinkedInUrl: async (linkedInUrl: string): Promise<LinkedInUrlResponse> => {
    const response = await api.put('/student/linkedin/url', { linkedInUrl });
    return response.data;
  },

  /**
   * Update only LinkedIn PDF (without changing URL)
   * @param file - New LinkedIn PDF file
   * @returns Upload response with file details
   */
  updateLinkedInPdf: async (file: File): Promise<LinkedInUploadResponse> => {
    const formData = new FormData();
    formData.append('linkedIn', file);
    
    const response = await api.put('/student/linkedin/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Download LinkedIn PDF
   * @returns PDF file as Blob
   */
  getLinkedIn: async (): Promise<Blob> => {
    const response = await api.get('/student/linkedin', {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Delete LinkedIn PDF
   * @returns Delete response with updated profile completeness
   */
  deleteLinkedIn: async (): Promise<DeleteResponse> => {
    const response = await api.delete('/student/linkedin');
    return response.data;
  },
};

// ============================================
// GitHub URL API Functions
// ============================================

export const githubApi = {
  /**
   * Add GitHub URL (first time)
   * @param githubUrl - GitHub profile URL
   * @returns Response with GitHub URL and profile completeness
   */
  addGithubUrl: async (githubUrl: string): Promise<GithubUrlResponse> => {
    const response = await api.post('/student/github', { githubUrl });
    return response.data;
  },

  /**
   * Update GitHub URL
   * @param githubUrl - New GitHub profile URL
   * @returns Response with updated GitHub URL and profile completeness
   */
  updateGithubUrl: async (githubUrl: string): Promise<GithubUrlResponse> => {
    const response = await api.put('/student/github', { githubUrl });
    return response.data;
  },

  /**
   * Get GitHub URL
   * @returns Response with current GitHub URL
   */
  getGithubUrl: async (): Promise<GithubUrlResponse> => {
    const response = await api.get('/student/github');
    return response.data;
  },

  /**
   * Delete GitHub URL
   * @returns Delete response with updated profile completeness
   */
  deleteGithubUrl: async (): Promise<DeleteResponse> => {
    const response = await api.delete('/student/github');
    return response.data;
  },
};
