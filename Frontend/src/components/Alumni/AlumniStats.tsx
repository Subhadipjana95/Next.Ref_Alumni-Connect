interface BackendOpportunity {
  _id: string;
  jobTitle: string;
  numberOfReferrals: number;
  referralsGiven: number;
  isActive?: boolean;
  status?: string;
}

interface AlumniStatsProps {
  backendOpportunities?: BackendOpportunity[];
}

export function AlumniStats({ backendOpportunities = [] }: AlumniStatsProps) {
  // Backend stats
  const opportunitiesCount = backendOpportunities.length;
  const totalReferralsGiven = backendOpportunities.reduce((acc, opp) => acc + (opp.referralsGiven || 0), 0);
  const activeOpportunities = backendOpportunities.filter(opp => opp.isActive || opp.status === 'active').length;

  return (
    <div className="mx-auto grid sm:grid-cols-4 gap-4">
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{opportunitiesCount}</p>
        <p className="text-sm text-muted-foreground">Opportunities Posted</p>
      </div>
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{activeOpportunities}</p>
        <p className="text-sm text-muted-foreground">Active Opportunities</p>
      </div>
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{totalReferralsGiven}</p>
        <p className="text-sm text-muted-foreground">Referrals Given</p>
      </div>
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{backendOpportunities.reduce((acc, opp) => acc + (opp.numberOfReferrals || 0), 0)}</p>
        <p className="text-sm text-muted-foreground">Total Referrals</p>
      </div>
    </div>
  );
}
