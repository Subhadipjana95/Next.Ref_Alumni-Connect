import { useState, useEffect } from 'react';
import { useAuth } from '@/services/Auth/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { showToast, dismissToast } from '@/components/TransactionToast';
import { AlumniStats } from '@/components/Alumni/AlumniStats';
import { AlumniTabNavigation } from '@/components/Alumni/AlumniTabNavigation';
import { CreateJobModal } from '@/components/Alumni/CreateJobModal';
import { PostReferralModal } from '@/components/Alumni/PostReferralModal';
import { BackendOpportunitiesList } from '@/components/Alumni/BackendOpportunitiesList';
import { EditOpportunityModal } from '@/components/Alumni/EditOpportunityModal';
import { Briefcase, Plus, ArrowLeft, Star } from 'lucide-react';
import { opportunitiesApi } from '@/services/opportunities';
import { applicationsApi } from '@/services/applications';
import { Job } from '@/lib/types';

export function AlumniDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [backendOpportunities, setBackendOpportunities] = useState<any[]>([]);
  const [selectedOpportunityApplications, setSelectedOpportunityApplications] = useState<any[]>([]);
  const [selectedBackendOpportunity, setSelectedBackendOpportunity] = useState<any | null>(null);
  const [showEditOpportunity, setShowEditOpportunity] = useState(false);
  const [isUpdatingOpportunity, setIsUpdatingOpportunity] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'referrals'>('jobs');
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showCreateReferral, setShowCreateReferral] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingReferral, setIsCreatingReferral] = useState(false);

  // Get alumni name from backend auth or default
  const alumniName = user ? `${user.firstName} ${user.lastName}` : 'Alumni';
  const alumniCompany = user?.accountType === 'Alumni' ? (user as any).company : '';

  const [jobForm, setJobForm] = useState({
    title: '',
    company: alumniCompany || '',
    location: '',
    type: 'full-time' as Job['type'],
    description: '',
    requirements: '',
    vacancy: '',
  });

  const [referralForm, setReferralForm] = useState({
    title: '',
    company: alumniCompany || '',
    location: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'internship' | 'contract',
    description: '',
    requirements: '',
    vacancy: '',
  });

  // Update company in forms when user data loads
  useEffect(() => {
    if (user?.accountType === 'Alumni') {
      const company = (user as any).company || '';
      setJobForm(prev => ({ ...prev, company: company || prev.company }));
      setReferralForm(prev => ({ ...prev, company: company || prev.company }));
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    // Fetch opportunities from backend if authenticated
    if (isAuthenticated && user) {
      try {
        const response = await opportunitiesApi.getMyOpportunities();
        if (response.success) {
          setBackendOpportunities(response.data);
        }
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      }
    }
  };

  // Load applications for a selected opportunity
  const loadApplicationsForOpportunity = async (opportunityId: string) => {
    try {
      const response = await applicationsApi.getApplicationsForOpportunity(opportunityId);
      if (response.success && Array.isArray(response.data)) {
        setSelectedOpportunityApplications(response.data);
      } else {
        setSelectedOpportunityApplications([]);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      setSelectedOpportunityApplications([]);
    }
  };

  const handleCreateJob = async () => {
    // Check if user is authenticated with backend (no wallet required)
    if (!isAuthenticated || !user) {
      showToast({
        type: 'error',
        message: 'Please login to post job opportunities',
      });
      return;
    }

    setIsCreating(true);
    const toastId = showToast({
      type: 'pending',
      message: 'Creating job opportunity...',
    });

    try {
      // Map frontend form fields to backend expected format
      const payload = {
        jobTitle: jobForm.title,
        roleDescription: jobForm.description,
        requiredSkills: jobForm.requirements
          .split('\n')
          .map(r => r.trim())
          .filter(r => r.length > 0),
        experienceLevel: jobForm.type, // full-time, part-time, internship, contract
        numberOfReferrals: parseInt(jobForm.vacancy) || 1,
      };

      // Call backend API
      const response = await opportunitiesApi.createOpportunity(payload);

      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Job opportunity posted successfully!',
        });

        // Reset form and reload data
        loadData();
        setShowCreateJob(false);
        setJobForm({
          title: '',
          company: alumniCompany || '',
          location: '',
          type: 'full-time',
          description: '',
          requirements: '',
          vacancy: '',
        });
      } else {
        throw new Error(response.message || 'Failed to create opportunity');
      }
    } catch (error: any) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to create job opportunity',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Remove wallet-dependent shortlist function - using backend only
  const handleShortlistBackend = async (applicationId: string, opportunityId: string) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Shortlisting candidate...',
    });

    try {
      const response = await applicationsApi.shortlistApplication(applicationId);
      
      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Candidate shortlisted successfully!',
        });
        
        // Reload applications for the opportunity
        await loadApplicationsForOpportunity(opportunityId);
      }
    } catch (error: any) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to shortlist candidate',
      });
    }
  };

  // Backend-integrated handler for referring (no blockchain required)
  const handleReferBackend = async (applicationId: string, opportunityId: string) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Processing referral...',
    });

    try {
      const response = await applicationsApi.referApplication(applicationId);
      
      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Referral provided successfully!',
        });
        
        // Reload applications for the opportunity
        await loadApplicationsForOpportunity(opportunityId);
      }
    } catch (error: any) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to provide referral',
      });
    }
  };

  // Backend-integrated handler for rejecting application
  const handleRejectBackend = async (applicationId: string, opportunityId: string) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Rejecting application...',
    });

    try {
      const response = await applicationsApi.rejectApplication(applicationId);
      
      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Application rejected',
        });
        
        // Reload applications for the opportunity
        await loadApplicationsForOpportunity(opportunityId);
      }
    } catch (error: any) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to reject application',
      });
    }
  };

  // Update opportunity (Alumni only - owner)
  const handleUpdateOpportunity = async (opportunityId: string, updateData: any) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Updating opportunity...',
    });

    setIsUpdatingOpportunity(true);

    try {
      const response = await opportunitiesApi.updateOpportunity(opportunityId, updateData);
      
      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Opportunity updated successfully!',
        });
        
        // Close modal and reload opportunities
        setShowEditOpportunity(false);
        setSelectedBackendOpportunity(null);
        await loadData();
      }
    } catch (error: any) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to update opportunity',
      });
    } finally {
      setIsUpdatingOpportunity(false);
    }
  };

  // Delete/Close opportunity (Alumni only - owner)
  const handleDeleteOpportunity = async (opportunityId: string) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Closing opportunity...',
    });

    try {
      const response = await opportunitiesApi.deleteOpportunity(opportunityId);
      
      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Opportunity closed successfully!',
        });
        
        // Reload opportunities
        await loadData();
      }
    } catch (error: any) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to close opportunity',
      });
    }
  };

  // Handle edit opportunity button click
  const handleEditOpportunityClick = (opportunity: any) => {
    setSelectedBackendOpportunity(opportunity);
    setShowEditOpportunity(true);
  };

  const handleRefer = async (jobId: string, studentAddress: string) => {
    showToast({
      type: 'info',
      message: 'Please use backend opportunities for referrals',
    });
    // This function requires wallet integration
    // Using backend opportunities instead
  };

  const handleCreateReferral = async () => {
    // Check if user is authenticated with backend (no wallet required)
    if (!isAuthenticated || !user) {
      showToast({
        type: 'error',
        message: 'Please login to post referral opportunities',
      });
      return;
    }

    setIsCreatingReferral(true);
    const toastId = showToast({
      type: 'pending',
      message: 'Creating referral opportunity...',
    });

    try {
      // Map frontend form fields to backend expected format
      const payload = {
        jobTitle: referralForm.title,
        roleDescription: referralForm.description,
        requiredSkills: referralForm.requirements
          .split('\n')
          .map(r => r.trim())
          .filter(r => r.length > 0),
        experienceLevel: referralForm.type, // full-time, part-time, internship, contract
        numberOfReferrals: parseInt(referralForm.vacancy) || 1,
      };

      // Call backend API
      const response = await opportunitiesApi.createOpportunity(payload);

      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Referral opportunity posted successfully!',
        });

        // Blockchain posting removed - using backend only
        
        // Reset form and reload data
        loadData();
        setShowCreateReferral(false);
        setReferralForm({
          title: '',
          company: alumniCompany || '',
          location: '',
          type: 'full-time',
          description: '',
          requirements: '',
          vacancy: '',
        });
      } else {
        throw new Error(response.message || 'Failed to create opportunity');
      }
    } catch (error: any) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to create referral opportunity',
      });
    } finally {
      setIsCreatingReferral(false);
    }
  };

  return (
    <div className="space-y-6 mt-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 leading-tight text-foreground">
              <span className="gradient-text2">Alumni </span> 
              <span className="gradient-text3">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              {user ? `Welcome back, ${alumniName}!` : 'Create jobs and provide signed referrals to verified students'}
            </p>
        </div>
        <div className="flex gap-2">
          <Button variant="alumni" onClick={() => setShowCreateJob(true)}
          className='text-background rounded-md hover:bg-muted-foreground bg-primary'>
            <Briefcase className="w-4 h-4" />
            Post Job
          </Button>
          <Button variant="success" onClick={() => setShowCreateReferral(true)}
          className='text-background rounded-md bg-muted-foreground hover:bg-primary'>
            <Star className="w-4 h-4" />
            Post Referral
          </Button>
        </div>
      </div>

      {/* Stats */}
      <AlumniStats 
        backendOpportunities={backendOpportunities}
      />

      {/* Tabs */}
      <AlumniTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Referrals Tab */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          {/* Backend Opportunities Section */}
          {isAuthenticated && (
            <div className="grid lg:grid-cols-2 gap-6">
              <BackendOpportunitiesList
                opportunities={backendOpportunities}
                selectedOpportunity={selectedBackendOpportunity}
                onSelectOpportunity={(opp) => {
                  setSelectedBackendOpportunity(opp);
                  loadApplicationsForOpportunity(opp._id);
                }}
                onCreateOpportunity={() => setShowCreateReferral(true)}
                onEditOpportunity={handleEditOpportunityClick}
                onDeleteOpportunity={handleDeleteOpportunity}
              />
              <div className="bg-card rounded-xl border border-border/50">
                {selectedBackendOpportunity ? (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Applications for "{selectedBackendOpportunity.jobTitle}"
                    </h3>
                    {!Array.isArray(selectedOpportunityApplications) || selectedOpportunityApplications.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No applications yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedOpportunityApplications.map((application) => (
                          <div 
                            key={application._id}
                            className="bg-muted/50 rounded-lg p-4 border border-border"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-foreground">
                                  {application.student.firstName} {application.student.lastName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {application.student.email}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {application.student.department} • {application.student.graduationYear}
                                </p>
                              </div>
                              <span className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                application.status === 'pending' && "bg-yellow-500/10 text-yellow-500",
                                application.status === 'shortlisted' && "bg-blue-500/10 text-blue-500",
                                application.status === 'referred' && "bg-success/10 text-success",
                                application.status === 'rejected' && "bg-destructive/10 text-destructive"
                              )}>
                                {application.status}
                              </span>
                            </div>
                            
                            {application.status === 'pending' && (
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleShortlistBackend(application._id, selectedBackendOpportunity._id)}
                                  className="flex-1"
                                >
                                  Shortlist
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectBackend(application._id, selectedBackendOpportunity._id)}
                                  className="flex-1 text-destructive hover:text-destructive"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                            
                            {application.status === 'shortlisted' && (
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleReferBackend(application._id, selectedBackendOpportunity._id)}
                                  className="flex-1 bg-success text-background hover:bg-success/90"
                                >
                                  Provide Referral
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectBackend(application._id, selectedBackendOpportunity._id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground">
                    <p>Select an opportunity to view applications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {/* Backend Opportunities Section */}
          {isAuthenticated && (
            <div className="grid lg:grid-cols-2 gap-6">
              <BackendOpportunitiesList
                opportunities={backendOpportunities}
                selectedOpportunity={selectedBackendOpportunity}
                onSelectOpportunity={(opp) => {
                  setSelectedBackendOpportunity(opp);
                  loadApplicationsForOpportunity(opp._id);
                }}
                onCreateOpportunity={() => setShowCreateJob(true)}
                onEditOpportunity={handleEditOpportunityClick}
                onDeleteOpportunity={handleDeleteOpportunity}
              />
              <div className="bg-card rounded-xl border border-border/50">
                {selectedBackendOpportunity ? (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Applications for "{selectedBackendOpportunity.jobTitle}"
                    </h3>
                    {!Array.isArray(selectedOpportunityApplications) || selectedOpportunityApplications.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No applications yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedOpportunityApplications.map((application) => (
                          <div 
                            key={application._id}
                            className="bg-muted/50 rounded-lg p-4 border border-border"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-foreground">
                                  {application.student.firstName} {application.student.lastName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {application.student.email}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {application.student.department} • {application.student.graduationYear}
                                </p>
                              </div>
                              <span className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                application.status === 'pending' && "bg-yellow-500/10 text-yellow-500",
                                application.status === 'shortlisted' && "bg-blue-500/10 text-blue-500",
                                application.status === 'referred' && "bg-success/10 text-success",
                                application.status === 'rejected' && "bg-destructive/10 text-destructive"
                              )}>
                                {application.status}
                              </span>
                            </div>
                            
                            {application.status === 'pending' && (
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleShortlistBackend(application._id, selectedBackendOpportunity._id)}
                                  className="flex-1"
                                >
                                  Shortlist
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectBackend(application._id, selectedBackendOpportunity._id)}
                                  className="flex-1 text-destructive hover:text-destructive"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                            
                            {application.status === 'shortlisted' && (
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleReferBackend(application._id, selectedBackendOpportunity._id)}
                                  className="flex-1 bg-success text-background hover:bg-success/90"
                                >
                                  Provide Referral
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectBackend(application._id, selectedBackendOpportunity._id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground">
                    <p>Select an opportunity to view applications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}


      {/* Candidates Tab */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          {/* Backend Candidates Section */}
          {isAuthenticated && backendOpportunities.length > 0 && (
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Candidates from Backend Opportunities
              </h3>
              <div className="space-y-4">
                {backendOpportunities.map((opportunity) => (
                  <div key={opportunity._id} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{opportunity.jobTitle}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBackendOpportunity(opportunity);
                          loadApplicationsForOpportunity(opportunity._id);
                          setActiveTab('jobs');
                        }}
                      >
                        View Applications
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {opportunity.referralsGiven || 0} / {opportunity.numberOfReferrals} referrals given
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!isAuthenticated || backendOpportunities.length === 0) && (
            <div className="bg-card rounded-xl p-12 border border-border/50 text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Candidates Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Post opportunities to start receiving applications from candidates
              </p>
              <Button 
                variant="alumni" 
                onClick={() => setActiveTab('jobs')}
                className='bg-primary text-background'
              >
                <Briefcase className="w-4 h-4" />
                Post Opportunity
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create Job Modal */}
      <CreateJobModal
        showModal={showCreateJob}
        onClose={() => setShowCreateJob(false)}
        jobForm={jobForm}
        setJobForm={setJobForm}
        onSubmit={handleCreateJob}
        isCreating={isCreating}
      />

      {/* Post Referral Modal */}
      <PostReferralModal
        showModal={showCreateReferral}
        onClose={() => setShowCreateReferral(false)}
        referralForm={referralForm}
        setReferralForm={setReferralForm}
        onSubmit={handleCreateReferral}
        isCreating={isCreatingReferral}
      />

      {/* Edit Opportunity Modal */}
      <EditOpportunityModal
        showModal={showEditOpportunity}
        onClose={() => {
          setShowEditOpportunity(false);
          setSelectedBackendOpportunity(null);
        }}
        opportunity={selectedBackendOpportunity}
        onSubmit={handleUpdateOpportunity}
        isUpdating={isUpdatingOpportunity}
      />
    </div>
  );
}
