import { Student } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Users, CheckCircle } from 'lucide-react';

interface VerifiedCandidatesListProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
}

export function VerifiedCandidatesList({
  students,
  selectedStudent,
  onSelectStudent,
}: VerifiedCandidatesListProps) {
  return (
    <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Users className="w-4 h-4" />
          Verified Students ({students.length})
        </h3>
      </div>
      <div className="divide-y divide-border/50 max-h-[500px] overflow-y-auto">
        {students.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No verified students yet
          </div>
        ) : (
          students.map((student) => (
            <button
              key={student.walletAddress}
              onClick={() => onSelectStudent(student)}
              className={cn(
                'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                selectedStudent?.walletAddress === student.walletAddress &&
                  'bg-alumni/5'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.college} • Class of {student.graduationYear}
                  </p>
                </div>
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
