import React from 'react';

interface InfoCardProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  action,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};
