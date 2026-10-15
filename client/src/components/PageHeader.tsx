import React from 'react';
import { BrandLogo } from './BrandLogo';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  actions?: React.ReactNode;
  showLogo?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumb,
  actions,
  showLogo = true
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-zinc-200">
      <div className="flex items-start gap-3.5">
        {showLogo && (
          <div className="pt-0.5 shrink-0 hidden sm:block">
            <BrandLogo size="sm" showText={false} />
          </div>
        )}
        <div>
          {breadcrumb && (
            <div className="text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1.5">
              {breadcrumb}
            </div>
          )}
          <h1 className="text-xl font-bold text-zinc-950 tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
