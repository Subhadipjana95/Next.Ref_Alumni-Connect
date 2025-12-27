import { Student } from '@/lib/types';
import {
  User,
  Mail,
  Building2,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

interface CandidateDetailsProps {
  selectedStudent: Student | null;
}

export function CandidateDetails({ selectedStudent }: CandidateDetailsProps) {
  if (!selectedStudent) {
    return (
      <div className="bg-card rounded-lg border border-border/50 shadow-sm">
        <div className="p-12 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a candidate to view profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-alumni/10 flex items-center justify-center">
            <User className="w-8 h-8 text-alumni" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {selectedStudent.name}
            </h3>
            <p className="text-muted-foreground">{selectedStudent.department}</p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{selectedStudent.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{selectedStudent.college}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              Class of {selectedStudent.graduationYear}
            </span>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <p className="text-xs text-muted-foreground">Resume Verified On-Chain</p>
          <code className="text-xs font-mono text-foreground bg-muted/50 p-2 rounded block break-all">
            {selectedStudent.resumeHash?.slice(0, 40)}...
          </code>
          {selectedStudent.verificationTxHash && (
            <a
              href={getExplorerUrl(selectedStudent.verificationTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View verification TX
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
