import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, TrendingUp, CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';
import { studentProfileApi, StudentProfile, ProfileStatusResponse, Project, Certification } from '@/services/studentProfile';
import { showTransactionToast, dismissToast } from '@/components/TransactionToast';

export function StudentProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatusResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form data
  const [branch, setBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(new Date().getFullYear() + 1);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchProfileStatus();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentProfileApi.getProfile();
      if (response.success) {
        const profileData = response.data;
        setProfile(profileData);
        
        // Populate form fields
        setBranch(profileData.branch || '');
        setGraduationYear(profileData.graduationYear || new Date().getFullYear() + 1);
        setSkills(profileData.skills || []);
        setProjects(profileData.projects || []);
        setCertifications(profileData.certifications || []);
        setPreferredRoles(profileData.preferredRoles || []);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileStatus = async () => {
    try {
      const response = await studentProfileApi.getProfileStatus();
      if (response.success) {
        setProfileStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile status:', error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: 'Updating profile...',
    });

    try {
      const response = await studentProfileApi.updateProfile({
        branch,
        graduationYear,
        skills,
        projects,
        certifications,
        preferredRoles,
      });

      dismissToast(toastId);
      if (response.success) {
        setProfile(response.data);
        showTransactionToast({
          type: 'success',
          message: 'Profile updated successfully!',
        });
        
        // Refresh profile status
        await fetchProfileStatus();
      }
    } catch (error: any) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addProject = () => {
    if (projectTitle.trim()) {
      setProjects([...projects, { 
        title: projectTitle.trim(), 
        description: projectDescription.trim(), 
        link: projectLink.trim() 
      }]);
      setProjectTitle('');
      setProjectDescription('');
      setProjectLink('');
    }
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    if (certName.trim()) {
      setCertifications([...certifications, { 
        name: certName.trim(), 
        issuer: certIssuer.trim(), 
        date: certDate 
      }]);
      setCertName('');
      setCertIssuer('');
      setCertDate('');
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const addRole = () => {
    if (roleInput.trim() && !preferredRoles.includes(roleInput.trim())) {
      setPreferredRoles([...preferredRoles, roleInput.trim()]);
      setRoleInput('');
    }
  };

  const removeRole = (role: string) => {
    setPreferredRoles(preferredRoles.filter(r => r !== role));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your profile information</p>
        </div>
      </div>

      {/* Profile Completion Status */}
      {profileStatus && (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Profile Completeness</CardTitle>
                  <CardDescription>
                    {profileStatus.completeness}% Complete - {profileStatus.strength}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={
                profileStatus.strength === 'Strong' ? 'default' :
                profileStatus.strength === 'Medium' ? 'secondary' : 'destructive'
              }>
                {profileStatus.strength}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-secondary rounded-full h-3 mb-4">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${profileStatus.completeness}%` }}
              />
            </div>
            {profileStatus.missingFields.length > 0 && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Missing fields:</span>{' '}
                  {profileStatus.missingFields.join(', ')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your account details (cannot be changed)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={profile?.firstName || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={profile?.lastName || ''} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>College</Label>
              <Input value={profile?.college?.name || ''} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your academic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch/Department</Label>
              <Input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(parseInt(e.target.value))}
                placeholder="2024"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add your technical and soft skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="e.g., React, Python, Communication"
              />
              <Button onClick={addSkill} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Add your notable projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Project Title (required)"
              />
              <Input
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Description (optional)"
              />
              <div className="flex gap-2">
                <Input
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  placeholder="Project Link (optional)"
                />
                <Button onClick={addProject} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {projects.map((project, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {project.title}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeProject(index)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>Add your professional certifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="Certification Name (required)"
              />
              <Input
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                placeholder="Issuer (optional)"
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  placeholder="Date (optional)"
                />
                <Button onClick={addCertification} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {cert.name}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeCertification(index)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preferred Roles */}
        <Card>
          <CardHeader>
            <CardTitle>Preferred Roles</CardTitle>
            <CardDescription>What positions are you interested in?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRole()}
                placeholder="e.g., Frontend Developer"
              />
              <Button onClick={addRole} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferredRoles.map((role) => (
                <Badge key={role} variant="secondary" className="gap-1">
                  {role}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeRole(role)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          disabled={saving}
          size="lg"
          className="min-w-[150px]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
