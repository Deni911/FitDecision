import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  className,
}: StatCardProps) {
  return (
    <div
      className={`bg-card rounded-lg border border-border p-6 hover:border-accent/50 transition-colors ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon size={24} className="text-primary" />
        </div>
      </div>
    </div>
  );
}
