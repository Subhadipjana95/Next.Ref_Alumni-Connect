import { Job, Student, Application } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import {
  FileText,
  Star,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface JobApplicationsProps {
  selectedJob: Job | null;
  applications: (Application & { student: Student })[];
  processingAction: { jobId: string; studentAddress: string; action: string } | null;
  onShortlist: (jobId: string, studentAddress: string) => Promise<void>;
  onRefer: (jobId: string, studentAddress: string) => Promise<void>;
}

export function JobApplications({
  selectedJob,
  applications,
  processingAction,
  onShortlist,
  onRefer,
}: JobApplicationsProps) {
  const isProcessingThis = (jobId: string, studentAddress: string, action: string) => {
    return (
      processingAction?.jobId === jobId &&
      processingAction?.studentAddress === studentAddress &&
      processingAction?.action === action
    );
  };

  if (!selectedJob) {
    return (
      <div className="bg-card rounded-lg border border-border/50 shadow-sm">
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a job to view applications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">
          Applications for {selectedJob.title}
        </h3>
      </div>
      <div className="divide-y divide-border/50 max-h-[500px] overflow-y-auto">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No applications yet
          </div>
        ) : (
          applications.map(({ student, status, txHash }) => (
            <div
              key={student.walletAddress}
              className="p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.college} • {student.department}
                  </p>
                </div>
                <StatusBadge status={status} />
              </div>
              {txHash && (
                <a
                  href={getExplorerUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mb-3"
                >
                  Application TX
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <div className="flex gap-2">
                {status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onShortlist(selectedJob.id, student.walletAddress)}
                    disabled={!!processingAction}
                  >
                    {isProcessingThis(selectedJob.id, student.walletAddress, 'shortlist') ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Star className="w-3.5 h-3.5" />
                    )}
                    Sign & Shortlist
                  </Button>
                )}
                {(status === 'pending' || status === 'shortlisted') && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onRefer(selectedJob.id, student.walletAddress)}
                    disabled={!!processingAction}
                  >
                    {isProcessingThis(selectedJob.id, student.walletAddress, 'refer') ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Sign & Refer
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
