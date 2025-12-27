import { Student, Job, Application, Referral, ReferralApplication } from './types';

const STORAGE_KEYS = {
  STUDENTS: 'alumni_referral_students',
  JOBS: 'alumni_referral_jobs',
  APPLICATIONS: 'alumni_referral_applications',
  REFERRALS: 'alumni_referral_referrals',
  REFERRAL_APPLICATIONS: 'alumni_referral_referral_applications',
  CURRENT_ROLE: 'alumni_referral_current_role',
  VERIFIER_ADDRESS: 'alumni_referral_verifier_address',
};

// Default verifier address (can be set in app)
const DEFAULT_VERIFIER = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

export const storage = {
  // Students
  getStudents: (): Record<string, Student> => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : {};
  },

  saveStudent: (student: Student): void => {
    const students = storage.getStudents();
    students[student.walletAddress] = student;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getStudent: (walletAddress: string): Student | null => {
    const students = storage.getStudents();
    return students[walletAddress] || null;
  },

  // Jobs
  getJobs: (): Job[] => {
    const data = localStorage.getItem(STORAGE_KEYS.JOBS);
    return data ? JSON.parse(data) : [];
  },

  saveJob: (job: Job): void => {
    const jobs = storage.getJobs();
    const existingIndex = jobs.findIndex(j => j.id === job.id);
    if (existingIndex >= 0) {
      jobs[existingIndex] = job;
    } else {
      jobs.push(job);
    }
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  },

  getJob: (jobId: string): Job | null => {
    const jobs = storage.getJobs();
    return jobs.find(j => j.id === jobId) || null;
  },

  // Applications
  getApplications: (): Application[] => {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return data ? JSON.parse(data) : [];
  },

  saveApplication: (application: Application): void => {
    const applications = storage.getApplications();
    const existingIndex = applications.findIndex(
      a => a.jobId === application.jobId && a.studentAddress === application.studentAddress
    );
    if (existingIndex >= 0) {
      applications[existingIndex] = application;
    } else {
      applications.push(application);
    }
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  },

  getStudentApplications: (walletAddress: string): Application[] => {
    return storage.getApplications().filter(a => a.studentAddress === walletAddress);
  },

  getJobApplications: (jobId: string): Application[] => {
    return storage.getApplications().filter(a => a.jobId === jobId);
  },

  // Referrals
  getReferrals: (): Referral[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    return data ? JSON.parse(data) : [];
  },

  saveReferral: (referral: Referral): void => {
    const referrals = storage.getReferrals();
    const existingIndex = referrals.findIndex(r => r.id === referral.id);
    if (existingIndex >= 0) {
      referrals[existingIndex] = referral;
    } else {
      referrals.push(referral);
    }
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
  },

  getReferral: (referralId: string): Referral | null => {
    const referrals = storage.getReferrals();
    return referrals.find(r => r.id === referralId) || null;
  },

  // Referral Applications
  getReferralApplications: (): ReferralApplication[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REFERRAL_APPLICATIONS);
    return data ? JSON.parse(data) : [];
  },

  saveReferralApplication: (application: ReferralApplication): void => {
    const applications = storage.getReferralApplications();
    const existingIndex = applications.findIndex(
      a => a.referralId === application.referralId && a.studentAddress === application.studentAddress
    );
    if (existingIndex >= 0) {
      applications[existingIndex] = application;
    } else {
      applications.push(application);
    }
    localStorage.setItem(STORAGE_KEYS.REFERRAL_APPLICATIONS, JSON.stringify(applications));
  },

  getStudentReferralApplications: (walletAddress: string): ReferralApplication[] => {
    return storage.getReferralApplications().filter(a => a.studentAddress === walletAddress);
  },

  getReferralApplicationsByReferralId: (referralId: string): ReferralApplication[] => {
    return storage.getReferralApplications().filter(a => a.referralId === referralId);
  },

  // Verifier address
  getVerifierAddress: (): string => {
    return localStorage.getItem(STORAGE_KEYS.VERIFIER_ADDRESS) || DEFAULT_VERIFIER;
  },

  setVerifierAddress: (address: string): void => {
    localStorage.setItem(STORAGE_KEYS.VERIFIER_ADDRESS, address);
  },

  // Helper to generate hash from file
  generateHash: async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // Clear all data (for testing)
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};
