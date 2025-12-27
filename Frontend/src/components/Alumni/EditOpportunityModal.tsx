import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Opportunity {
  _id: string;
  jobTitle: string;
  roleDescription: string;
  requiredSkills: string[];
  experienceLevel: string;
  numberOfReferrals: number;
}

interface EditOpportunityModalProps {
  showModal: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  onSubmit: (opportunityId: string, updateData: any) => Promise<void>;
  isUpdating: boolean;
}

export function EditOpportunityModal({
  showModal,
  onClose,
  opportunity,
  onSubmit,
  isUpdating,
}: EditOpportunityModalProps) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    roleDescription: '',
    requiredSkills: '',
    experienceLevel: 'full-time',
    numberOfReferrals: 1,
  });

  // Update form when opportunity changes
  useEffect(() => {
    if (opportunity) {
      setFormData({
        jobTitle: opportunity.jobTitle,
        roleDescription: opportunity.roleDescription,
        requiredSkills: opportunity.requiredSkills.join('\n'),
        experienceLevel: opportunity.experienceLevel,
        numberOfReferrals: opportunity.numberOfReferrals,
      });
    }
  }, [opportunity]);

  const handleSubmit = async () => {
    if (!opportunity) return;

    const updateData = {
      jobTitle: formData.jobTitle,
      roleDescription: formData.roleDescription,
      requiredSkills: formData.requiredSkills
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0),
      experienceLevel: formData.experienceLevel,
      numberOfReferrals: formData.numberOfReferrals,
    };

    await onSubmit(opportunity._id, updateData);
  };

  if (!opportunity) return null;

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-lg px-6 py-4 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Edit Opportunity</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className='border p-1 rounded-sm'>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Job Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-type">Employment Type *</Label>
                <select
                  id="edit-type"
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div>
                <Label htmlFor="edit-description">Role Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.roleDescription}
                  onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-skills">Required Skills (one per line)</Label>
                <Textarea
                  id="edit-skills"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  placeholder="React&#10;Node.js&#10;TypeScript&#10;MongoDB"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each skill on a new line
                </p>
              </div>

              <div>
                <Label htmlFor="edit-referrals">Number of Referrals *</Label>
                <Input
                  id="edit-referrals"
                  type="number"
                  min="1"
                  value={formData.numberOfReferrals}
                  onChange={(e) => setFormData({ ...formData, numberOfReferrals: parseInt(e.target.value) || 1 })}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How many students can you refer for this position?
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  variant="alumni"
                  onClick={handleSubmit}
                  className="flex-1 bg-primary text-background"
                  disabled={isUpdating || !formData.jobTitle || !formData.roleDescription}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Opportunity'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
