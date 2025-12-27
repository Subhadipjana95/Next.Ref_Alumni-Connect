import { Referral, Student, ReferralApplication } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import {
  FileText,
  CheckCircle,
  Loader2,
  ExternalLink,
  XCircle,
} from 'lucide-react';

interface ReferralApplicationsProps {
  selectedReferral: Referral | null;
  applications: (ReferralApplication & { student: Student })[];
  processingAction: { referralId: string; studentAddress: string; action: string } | null;
  onAccept: (referralId: string, studentAddress: string) => Promise<void>;
  onReject: (referralId: string, studentAddress: string) => Promise<void>;
}

export function ReferralApplications({
  selectedReferral,
  applications,
  processingAction,
  onAccept,
  onReject,
}: ReferralApplicationsProps) {
  const isProcessingThis = (referralId: string, studentAddress: string, action: string) => {
    return (
      processingAction?.referralId === referralId &&
      processingAction?.studentAddress === studentAddress &&
      processingAction?.action === action
    );
  };

  if (!selectedReferral) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm">
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a referral to view applications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">
          Applications for {selectedReferral.title}
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
                <StatusBadge status={status === 'accepted' ? 'referred' : status} />
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
                  <>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => onAccept(selectedReferral.id, student.walletAddress)}
                      disabled={!!processingAction}
                    >
                      {isProcessingThis(selectedReferral.id, student.walletAddress, 'accept') ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      Sign & Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(selectedReferral.id, student.walletAddress)}
                      disabled={!!processingAction}
                    >
                      {isProcessingThis(selectedReferral.id, student.walletAddress, 'reject') ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
