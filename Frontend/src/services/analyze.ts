import axios from 'axios';

// Use backend proxy instead of calling external API directly
// This avoids CORS issues
const ANALYZE_API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'}/analyze`;

export interface AnalyzePayload {
  resume: File;
  linkedin: File;
  github_url: string;
  target_role: string;
}

export interface AnalyzeResponse {
  status: string;
  data: {
    key_aaskills: { [key: string]: number };
    key_skills: { [key: string]: number };
    job_role: string;
    compatibility_score_percent: number;
    missing_skills: string[];
    weak_skills: string[];
    advisory: string[];
  };
}

export const analyzeApi = {
  /**
   * Analyze candidate profile against target role
   * Calls backend proxy endpoint which forwards to external API
   * @param resume - Resume PDF file
   * @param linkedin - LinkedIn PDF file
   * @param github_url - GitHub profile URL
   * @param target_role - Target job role
   */
  analyzeProfile: async (
    resume: File,
    linkedin: File,
    github_url: string,
    target_role: string
  ): Promise<AnalyzeResponse> => {
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('linkedin', linkedin);
    formData.append('github_url', github_url);
    formData.append('target_role', target_role);

    try {
      console.log('Sending analyze request to backend:', ANALYZE_API_URL);
      console.log('FormData contents:', {
        resume: resume.name,
        linkedin: linkedin.name,
        github_url,
        target_role
      });

      const response = await axios.post(ANALYZE_API_URL, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log('Analyze API response:', response.data);
      
      // Response structure: { success: true, data: {...analysis}, note?: "..." }
      return response.data as unknown as AnalyzeResponse;
    } catch (error) {
      console.error('Analyze API error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          // Request made but no response received
          console.error('No response from server');
          throw new Error('Network Error: No response from analyzer. Check if the API is accessible.');
        }
      }
      
      throw new Error(`Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
