import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Linkedin, 
  Upload, 
  Download, 
  Trash2, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Link as LinkIcon,
  ExternalLink,
  Save
} from 'lucide-react';
import { linkedInApi, LinkedInData } from '@/services/studentProfile';
import { showTransactionToast, dismissToast } from '@/components/TransactionToast';

interface LinkedInSectionProps {
  // LinkedIn data from profile
  linkedIn?: LinkedInData;
  // Callback to refresh profile data after changes
  onLinkedInChange: () => void;
}

/**
 * LinkedInSection Component
 * Handles LinkedIn PDF upload/update and LinkedIn URL management
 * Stores LinkedIn PDF in MongoDB with optional URL
 */
export function LinkedInSection({ linkedIn, onLinkedInChange }: LinkedInSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingUrl, setUpdatingUrl] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState(linkedIn?.linkedInUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if LinkedIn PDF exists
  const hasLinkedInPdf = linkedIn?.fileName && linkedIn?.fileSize;
  // Check if LinkedIn URL exists
  const hasLinkedInUrl = !!linkedIn?.linkedInUrl;

  /**
   * Handle file selection and upload
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      showTransactionToast({
        type: 'error',
        message: 'Please upload a PDF file only',
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showTransactionToast({
        type: 'error',
        message: 'File size must be less than 5MB',
      });
      return;
    }

    setUploading(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: hasLinkedInPdf ? 'Updating LinkedIn PDF...' : 'Uploading LinkedIn PDF...',
    });

    try {
      // Use update API if PDF exists, otherwise use upload API
      if (hasLinkedInPdf) {
        await linkedInApi.updateLinkedInPdf(file);
      } else {
        // First upload - include URL if provided
        await linkedInApi.uploadLinkedIn(file, linkedInUrl || undefined);
      }

      dismissToast(toastId);
      showTransactionToast({
        type: 'success',
        message: hasLinkedInPdf ? 'LinkedIn PDF updated!' : 'LinkedIn PDF uploaded!',
      });

      // Refresh profile data
      onLinkedInChange();
    } catch (error: any) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to upload LinkedIn PDF',
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Update LinkedIn URL
   */
  const handleUpdateUrl = async () => {
    if (!linkedInUrl.trim()) {
      showTransactionToast({
        type: 'error',
        message: 'Please enter a LinkedIn URL',
      });
      return;
    }

    // Basic LinkedIn URL validation
    const linkedInPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
    if (!linkedInPattern.test(linkedInUrl.trim())) {
      showTransactionToast({
        type: 'error',
        message: 'Please enter a valid LinkedIn profile URL (e.g., linkedin.com/in/username)',
      });
      return;
    }

    setUpdatingUrl(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: 'Updating LinkedIn URL...',
    });

    try {
      await linkedInApi.updateLinkedInUrl(linkedInUrl.trim());

      dismissToast(toastId);
      showTransactionToast({
        type: 'success',
        message: 'LinkedIn URL updated successfully!',
      });

      // Refresh profile data
      onLinkedInChange();
    } catch (error: any) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update LinkedIn URL',
      });
    } finally {
      setUpdatingUrl(false);
    }
  };

  /**
   * Download LinkedIn PDF
   */
  const handleDownload = async () => {
    if (!hasLinkedInPdf) return;

    setDownloading(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: 'Downloading LinkedIn PDF...',
    });

    try {
      const blob = await linkedInApi.getLinkedIn();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = linkedIn?.fileName || 'linkedin.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      dismissToast(toastId);
      showTransactionToast({
        type: 'success',
        message: 'LinkedIn PDF downloaded!',
      });
    } catch (error: any) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to download LinkedIn PDF',
      });
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Delete LinkedIn PDF
   */
  const handleDelete = async () => {
    if (!hasLinkedInPdf) return;

    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete your LinkedIn PDF?')) {
      return;
    }

    setDeleting(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: 'Deleting LinkedIn PDF...',
    });

    try {
      await linkedInApi.deleteLinkedIn();

      dismissToast(toastId);
      showTransactionToast({
        type: 'success',
        message: 'LinkedIn PDF deleted!',
      });

      // Reset URL state
      setLinkedInUrl('');
      
      // Refresh profile data
      onLinkedInChange();
    } catch (error: any) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete LinkedIn PDF',
      });
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let size = bytes;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            <div>
              <CardTitle>LinkedIn</CardTitle>
              <CardDescription>Upload LinkedIn PDF and add profile URL</CardDescription>
            </div>
          </div>
          {(hasLinkedInPdf || hasLinkedInUrl) && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {hasLinkedInPdf && hasLinkedInUrl ? 'Complete' : 'Partial'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="linkedin-upload"
        />

        {/* LinkedIn URL Section */}
        <div className="space-y-3">
          <Label htmlFor="linkedin-url" className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            LinkedIn Profile URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="linkedin-url"
              type="url"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleUpdateUrl}
              disabled={updatingUrl || !linkedInUrl.trim()}
              title="Save URL"
            >
              {updatingUrl ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </Button>
            {hasLinkedInUrl && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(linkedIn?.linkedInUrl, '_blank')}
                title="Open LinkedIn Profile"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* LinkedIn PDF Section */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            LinkedIn PDF Export
          </Label>
          
          {hasLinkedInPdf ? (
            // PDF exists - show file info and actions
            <div className="space-y-3">
              {/* File info */}
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-start gap-3">
                  <Linkedin className="w-8 h-8 text-[#0A66C2] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{linkedIn?.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(linkedIn?.fileSize)}
                    </p>
                    {linkedIn?.uploadedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded: {formatDate(linkedIn.uploadedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Replace
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            // No PDF - show upload prompt
            <div className="space-y-3">
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 rounded-full bg-muted">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Upload LinkedIn PDF</p>
                    <p className="text-xs text-muted-foreground">
                      Export from LinkedIn (PDF, max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload LinkedIn PDF
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Info message */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Export your LinkedIn profile as PDF from LinkedIn settings. 
            This helps recruiters verify your professional background.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
