import type { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  color: string;
}

export function StatsCard({ icon, label, value, color }: StatsCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
