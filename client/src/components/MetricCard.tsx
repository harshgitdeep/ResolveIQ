import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  comparison?: {
    text: string;
    trend: 'up' | 'down' | 'neutral';
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  comparison
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200/80 p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-semibold tracking-tight text-slate-900">{value}</span>
        {comparison && (
          <span
            className={`text-xs font-medium ${
              comparison.trend === 'up'
                ? 'text-emerald-600'
                : comparison.trend === 'down'
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}
          >
            {comparison.text}
          </span>
        )}
      </div>
    </div>
  );
};
