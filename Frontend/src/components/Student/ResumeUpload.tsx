import { useState } from 'react';
import { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Upload,
  CheckCircle,
  Loader2,
  ExternalLink,
  Hash,
} from 'lucide-react';

interface ResumeUploadProps {
  student: Student | null;
  formData: {
    name: string;
    email: string;
    college: string;
    department: string;
    graduationYear: number;
  };
  onSubmit: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function ResumeUpload({ student, formData, onSubmit, isUploading }: ResumeUploadProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleSubmit = async () => {
    if (!resumeFile) return;
    await onSubmit(resumeFile);
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Resume Upload
      </h3>

      {student?.resumeHash ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-success/10 border border-success/20">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium text-foreground">
                Resume Submitted On-Chain
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {student.resumeFileName}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3" />
                Resume Hash (SHA-256)
              </p>
              <code className="text-xs font-mono text-foreground break-all">
                {student.resumeHash.slice(0, 32)}...
              </code>
            </div>

            {student.ipfsCid && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  IPFS CID (Pinata)
                </p>
                <a
                  href={student.ipfsUrl || `https://gateway.pinata.cloud/ipfs/${student.ipfsCid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
                >
                  {student.ipfsCid.slice(0, 20)}...
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            
            {student.txHash && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Transaction</p>
                <a
                  href={getExplorerUrl(student.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  {student.txHash.slice(0, 20)}...
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Status: <StatusBadge status={student.resumeStatus} className="ml-2" /></p>
            {student.verifiedAt && (
              <p className="mt-2">
                Verified on: {new Date(student.verifiedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
              resumeFile
                ? 'border-success bg-success/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer block"
            >
              {resumeFile ? (
                <>
                  <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
                  <p className="font-medium text-foreground">{resumeFile.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click to change file
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-foreground">
                    Click to upload your resume
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF format only
                  </p>
                </>
              )}
            </label>
          </div>

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Signing with Petra:</strong> Your resume hash will be recorded on Aptos Devnet. You'll need to approve the transaction in your wallet.
            </p>
          </div>

          <Button
            variant="student"
            className="w-full"
            onClick={handleSubmit}
            disabled={!resumeFile || !formData.name || !formData.email || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Awaiting Signature...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Sign & Submit Resume
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
