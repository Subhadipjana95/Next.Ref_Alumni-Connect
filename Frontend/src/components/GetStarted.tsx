import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";

export function GetStarted() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/role-selector");
  };

  return (
    <>
      <Button
        variant="gradient"
        onClick={handleGetStarted}
        className="gap-2 rounded-md border border-primary/30 px-6 py-2.5 text-sm font-medium hover:border-primary/50 transition-colors"
      >
        Get Started
      </Button>
      
    </>
  );
}

// Keep WalletButton as an alias for backward compatibility
export const WalletButton = GetStarted;
