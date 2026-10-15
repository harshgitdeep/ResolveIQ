import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

const sizeConfig = {
  xs: { img: 'w-5 h-5', text: 'text-xs', container: 'gap-1.5' },
  sm: { img: 'w-7 h-7', text: 'text-sm', container: 'gap-2' },
  md: { img: 'w-8 h-8', text: 'text-base', container: 'gap-2.5' },
  lg: { img: 'w-10 h-10', text: 'text-xl', container: 'gap-3' },
  xl: { img: 'w-12 h-12', text: 'text-2xl', container: 'gap-3' },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  subtitle,
  className = '',
}) => {
  const { img, text, container } = sizeConfig[size];

  return (
    <div className={`inline-flex items-center ${container} ${className} select-none`}>
      <img
        src="/logo.svg"
        alt="ResolveIQ Logo"
        className={`${img} rounded-lg object-contain shrink-0 shadow-xs border border-zinc-900/10`}
      />
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold text-zinc-900 tracking-tight ${text}`}>
            ResolveIQ
          </span>
          {subtitle && (
            <span className="text-[11px] font-medium text-zinc-500">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
