import { cn } from '@/lib/utils';
import { Student } from '@/lib/types';

interface VerifierStatsProps {
  students: Student[];
  filter: 'all' | 'unverified' | 'verified' | 'rejected';
  onFilterChange: (filter: 'all' | 'unverified' | 'verified' | 'rejected') => void;
}

export function VerifierStats({ students, filter, onFilterChange }: VerifierStatsProps) {
  const stats = [
    { label: 'Total', count: students.length, filter: 'all' as const },
    { label: 'Pending', count: students.filter(s => s.resumeStatus === 'unverified').length, filter: 'unverified' as const },
    { label: 'Verified', count: students.filter(s => s.resumeStatus === 'verified').length, filter: 'verified' as const },
    { label: 'Rejected', count: students.filter(s => s.resumeStatus === 'rejected').length, filter: 'rejected' as const },
  ];

  return (
    <div className="grid sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <button
          key={stat.label}
          onClick={() => onFilterChange(stat.filter)}
          className={cn(
            'p-4 rounded-lg border-2 transition-all text-left',
            filter === stat.filter
              ? 'border-primary bg-primary/5'
              : 'border-border/50 bg-card hover:border-primary/50'
          )}
        >
          <p className="text-2xl font-bold text-foreground">{stat.count}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </button>
      ))}
    </div>
  );
}
