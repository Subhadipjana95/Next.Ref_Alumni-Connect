// Authentication Types

export type AccountType = 'Student' | 'Alumni' | 'Verifier';

// Base user interface
export interface BaseUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: AccountType;
  image: string;
  college: {
    _id: string;
    name: string;
    matchingName: string;
  };
  token: string;
}

// Student specific user
export interface StudentUser extends BaseUser {
  accountType: 'Student';
  branch?: string;
  graduationYear?: number;
  skills?: string[];
  projects?: Array<{
    title: string;
    description: string;
    link?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date?: string;
  }>;
  preferredRoles?: string[];
  resume?: {
    url: string;
    publicId: string;
  };
  profileCompleteness?: number;
}

// Alumni specific user
export interface AlumniUser extends BaseUser {
  accountType: 'Alumni';
  company?: string;
  jobTitle?: string;
  yearsOfExperience?: number;
  skills?: string[];
  referralPreferences?: string;
}

// Verifier specific user
export interface VerifierUser extends BaseUser {
  accountType: 'Verifier';
  verifierRole?: string;
  department?: string;
}

// Union type for authenticated user
export type AuthUser = StudentUser | AlumniUser | VerifierUser;

// Signup request payloads
export interface StudentSignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  collegeName: string;
}

export interface AlumniSignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  collegeName: string;
  company?: string;
  jobTitle?: string;
}

// Login request payload (same for both)
export interface LoginPayload {
  email: string;
  password: string;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

export interface AuthError {
  success: false;
  message: string;
}

// Auth context state
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth context actions
export interface AuthContextType extends AuthState {
  // Student auth methods
  studentSignup: (data: StudentSignupPayload) => Promise<AuthResponse>;
  studentLogin: (data: LoginPayload) => Promise<AuthResponse>;
  
  // Alumni auth methods
  alumniSignup: (data: AlumniSignupPayload) => Promise<AuthResponse>;
  alumniLogin: (data: LoginPayload) => Promise<AuthResponse>;
  
  // Common methods
  logout: () => void;
  clearError: () => void;
  setUser: (user: AuthUser) => void;
}
