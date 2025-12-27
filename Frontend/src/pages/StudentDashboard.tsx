import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Student, Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import {
  showToast,
  dismissToast,
} from "@/components/TransactionToast";
import { ProfileForm } from "@/components/Student/ProfileForm";
import { ResumeUpload } from "@/components/Student/ResumeUpload";
import { JobsList } from "@/components/Student/JobsList";
import { ReferralsList } from "@/components/Student/ReferralsList";
import { OpportunitiesList } from "@/components/Student/OpportunitiesList";
import { QRCodeSection } from "@/components/Student/QRCodeSection";
import { TabNavigation } from "@/components/Student/TabNavigation";
import { ExternalJobsList } from "@/components/Student/ExternalJobsList";
import { StudentProfilePage } from "@/pages/StudentProfilePage";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { externalJobsApi, ExternalJob } from "@/services/externalJobs";
import { opportunitiesApi, Opportunity } from "@/services/opportunities";

export function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  const [externalJobs, setExternalJobs] = useState<ExternalJob[]>([]);
  const [loadingExternalJobs, setLoadingExternalJobs] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isApplying, setIsApplying] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/auth/student/login');
      return;
    }
  }, [navigate]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    department: "",
    graduationYear: new Date().getFullYear() + 1,
  });

  // Determine active tab from URL
  const getActiveTab = (): "profile" | "jobs" | "referrals" | "qrcode" => {
    if (location.pathname.includes('/profile')) return 'profile';
    if (location.pathname.includes('/jobs')) return 'jobs';
    if (location.pathname.includes('/qrcode')) return 'qrcode';
    return 'referrals';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setJobs(storage.getJobs());
      
      // Fetch opportunities from backend
      fetchOpportunities();
    }
  }, []);

  // Fetch external jobs when jobs tab is active
  useEffect(() => {
    if (activeTab === 'jobs' && externalJobs.length === 0) {
      fetchExternalJobs();
    }
  }, [activeTab]);

  const fetchOpportunities = async () => {
    // Check if token exists
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/auth/student/login');
      return;
    }

    setLoadingOpportunities(true);
    try {
      const response = await opportunitiesApi.getOpportunities();
      if (response.success) {
        setOpportunities(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching opportunities:', error);
      if (error.response?.status !== 401) {
        showToast({
          type: "error",
          message: error.response?.data?.message || "Failed to load opportunities",
        });
      }
    } finally {
      setLoadingOpportunities(false);
    }
  };

  const fetchExternalJobs = async () => {
    // Check if token exists
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/auth/student/login');
      return;
    }

    setLoadingExternalJobs(true);
    try {
      const response = await externalJobsApi.getExternalJobs(1);
      if (response.success) {
        setExternalJobs(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching external jobs:', error);
      if (error.response?.status !== 401) {
        showToast({
          type: "error",
          message: "Failed to load external jobs",
        });
      }
    } finally {
      setLoadingExternalJobs(false);
    }
  };

  // Redirect /student to /student/referrals by default (AFTER all hooks)
  if (location.pathname === '/student') {
    return <Navigate to="/student/referrals" replace />;
  }

  const handleSubmitResume = async (resumeFile: File) => {
    if (!resumeFile) return;

    setIsUploading(true);
    const toastId = showToast({
      type: "pending",
      message: "Uploading resume...",
    });

    try {
      // Simulate resume upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      dismissToast(toastId);
      showToast({
        type: "success",
        message: "Resume uploaded successfully!",
      });

      // Save student data
      const userId = localStorage.getItem('user_id') || 'guest';
      const newStudent: Student = {
        walletAddress: userId,
        ...formData,
        resumeFileName: resumeFile.name,
        resumeHash: `hash_${Date.now()}`,
        resumeStatus: "unverified",
        submittedAt: new Date().toISOString(),
        appliedJobs: student?.appliedJobs || [],
        txHash: `tx_${Date.now()}`,
        ipfsCid: `cid_${Date.now()}`,
        ipfsUrl: `https://example.com/resume`,
      };

      storage.saveStudent(newStudent);
      setStudent(newStudent);
    } catch (error: any) {
      dismissToast(toastId);
      showToast({
        type: "error",
        message: error.message || "Upload failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyJob = async (jobId: string) => {
    if (!student) return;
    if (student.resumeStatus !== "verified") {
      showToast({
        type: "error",
        message: "Your resume must be verified before applying",
      });
      return;
    }

    setIsApplying(jobId);
    const toastId = showToast({
      type: "pending",
      message: "Submitting application...",
    });

    try {
      // Apply for referral via backend API
      const response = await opportunitiesApi.applyForReferral(jobId);

      dismissToast(toastId);
      showToast({
        type: "success",
        message: response.message || "Application submitted successfully!",
      });

      // Refresh opportunities to update UI
      await fetchOpportunities();

    } catch (error: any) {
      dismissToast(toastId);
      showToast({
        type: "error",
        message: error.response?.data?.message || error.message || "Application failed",
      });
    } finally {
      setIsApplying(null);
    }
  };

  return (
    <div className="space-y-6 mt-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 leading-tight text-foreground">
            <span className="gradient-text2">Student </span>
            <span className="gradient-text3">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Upload your resume and apply for referrals
          </p>
        </div>
        {student && <StatusBadge status={student.resumeStatus} />}
      </div>

      {/* Tabs */}
      <TabNavigation
        activeTab={activeTab}
        student={student}
      />

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StudentProfilePage />
        </motion.div>
      )}

      {/* Referrals Tab */}
      {activeTab === "referrals" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Referral Opportunities from Alumni
            </h2>
            <p className="text-muted-foreground">
              Connect with alumni from your college and get referred
            </p>
          </div>
          <OpportunitiesList
            opportunities={opportunities}
            loading={loadingOpportunities}
            isApplying={isApplying}
            onApply={handleApplyJob}
            canApply={student?.resumeStatus === 'verified'}
          />
        </motion.div>
      )}

      {/* Jobs Tab - External Jobs */}
      {activeTab === "jobs" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Browse Jobs from Around the World
            </h2>
            <p className="text-muted-foreground">
              Discover opportunities from global companies
            </p>
          </div>
          <ExternalJobsList 
            jobs={externalJobs} 
            loading={loadingExternalJobs}
          />
        </motion.div>
      )}

      {/* Jobs Tab */}
      {activeTab === "jobs" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <JobsList
            jobs={jobs}
            student={student}
            isApplying={isApplying}
            onApply={handleApplyJob}
          />
        </motion.div>
      )}

      {/* QR Code Tab */}
      {activeTab === "qrcode" && student && address && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <QRCodeSection student={student} address={address} />
        </motion.div>
      )}
    </div>
  );
}
