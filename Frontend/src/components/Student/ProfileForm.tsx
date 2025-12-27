import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Student } from '@/lib/types';

interface ProfileFormProps {
  formData: {
    name: string;
    email: string;
    college: string;
    department: string;
    graduationYear: number;
  };
  setFormData: (data: any) => void;
  student: Student | null;
}

export function ProfileForm({ formData, setFormData, student }: ProfileFormProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Profile Information
      </h3>
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className='flex flex-col item-start gap-2'>
            <Label htmlFor="name" className='ml-1'>Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              disabled={!!student?.resumeHash}
            />
          </div>
          <div className='flex flex-col item-start gap-2'>
            <Label htmlFor="email" className='ml-1'>Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@college.edu"
              disabled={!!student?.resumeHash}
            />
          </div>
        </div>
        <div className='flex flex-col item-start gap-2'>
          <Label htmlFor="college" className='ml-1'>College</Label>
          <Input
            id="college"
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            placeholder="State University"
            disabled={!!student?.resumeHash}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className='flex flex-col item-start gap-2'>
            <Label htmlFor="department" className='ml-1'>Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Computer Science"
              disabled={!!student?.resumeHash}
            />
          </div>
          <div className='flex flex-col item-start gap-2'>
            <Label htmlFor="year" className='ml-1'>Graduation Year</Label>
            <Input
              id="year"
              type="number"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
              disabled={!!student?.resumeHash}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
