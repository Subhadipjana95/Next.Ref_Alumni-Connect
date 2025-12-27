import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/lib/types";
import {
  GraduationCap,
  ShieldCheck,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "student" as UserRole,
    image: "/Student.png",
    title: "Student",
    description: "Upload your resume, get verified, and apply for referrals",
    icon: GraduationCap,
    color: "student",
    gradient: "from-student to-primary",
  },
  {
    id: "verifier" as UserRole,
    image: "/Verifier.png",
    title: "Resume Verifier",
    description: "College authority to verify student resumes",
    icon: ShieldCheck,
    color: "verifier",
    gradient: "from-verifier to-primary",
  },
  {
    id: "alumni" as UserRole,
    image: "/Alumni.png",
    title: "Alumni",
    description: "Post jobs and provide referrals to verified students",
    icon: Briefcase,
    color: "alumni",
    gradient: "from-alumni to-info",
  },
];

export function RoleSelector() {
  const navigate = useNavigate();

  const handleRoleSelect = (roleId: UserRole) => {
    // Redirect to appropriate auth pages based on role
    if (roleId === 'student') {
      navigate('/auth/student/login');
      return;
    }
    
    if (roleId === 'verifier') {
      navigate('/auth/verifier/login');
      return;
    }
    
    if (roleId === 'alumni') {
      navigate('/auth/alumni/login');
      return;
    }
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto mt-32 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-foreground">
            Select
            <span className="gradient-text3"> Your</span>
            <span className="gradient-text2"> Role</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;

            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleRoleSelect(role.id)}
                className={cn(
                  "group relative p-2 rounded-xl bg-card border-2 border-border/50",
                  "hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                )}
              >
                <div className="relative bg-background rounded-lg overflow-hidden border-2 min-h-[400px] flex flex-col justify-end">
                  {/* Image */}
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={role.image}
                      alt={role.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10 text-left p-3">
                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                      {role.title}
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    <p className="text-sm max-w-sm text-popover-foreground leading-tight tracking-tight">
                      {role.description}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background from-30% via-background/70 via-60% to-transparent pointer-events-none z-[1]" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Info message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 w-fit h-fit p-4 rounded-md bg-muted/50 mx-auto"
        >
          <p className="text-muted-foreground text-center">
            <strong className="text-primary">Choose Your Role:</strong> Select
            Student to apply for referrals, Alumni to post opportunities, or Verifier to validate resumes.
          </p>
        </motion.div>
      </div>
    </>
  );
}
