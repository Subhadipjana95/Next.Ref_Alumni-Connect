import { Link } from 'react-router-dom';
import { Student } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  FileText,
  Briefcase,
  QrCode,
  Users,
} from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'profile' | 'jobs' | 'referrals' | 'qrcode';
  student: Student | null;
}

export function TabNavigation({ activeTab, student }: TabNavigationProps) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit mx-auto">
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
