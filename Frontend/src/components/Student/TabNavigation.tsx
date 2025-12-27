import { Link } from 'react-router-dom';
import { Student } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  FileText,
  Briefcase,
  QrCode,
  Users,
  CheckSquare,
} from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'profile' | 'jobs' | 'referrals' | 'qrcode' | 'applied';
  student: Student | null;
  appliedCount?: number;
}

export function TabNavigation({ activeTab, student, appliedCount = 0 }: TabNavigationProps) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit mx-auto flex-wrap justify-center">
      <Link
        to="/student/referrals"
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeTab === 'referrals'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Users className="w-4 h-4 inline-block mr-2" />
        Referrals
      </Link>
      <Link
        to="/student/applied"
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2',
          activeTab === 'applied'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <CheckSquare className="w-4 h-4" />
        Applied Jobs
        {appliedCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
            {appliedCount}
          </span>
        )}
      </Link>
      <Link
        to="/student/jobs"
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeTab === 'jobs'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Briefcase className="w-4 h-4 inline-block mr-2" />
        Browse Jobs
      </Link>
      <Link
        to="/student/profile"
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeTab === 'profile'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <FileText className="w-4 h-4 inline-block mr-2" />
        My Profile
      </Link>
      {student?.resumeHash && (
        <Link
          to="/student/qrcode"
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            activeTab === 'qrcode'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <QrCode className="w-4 h-4 inline-block mr-2" />
          My QR Code
        </Link>
      )}
    </div>
  );
}
