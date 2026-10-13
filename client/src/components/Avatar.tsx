import React from 'react';

interface AvatarProps {
  initials: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  name,
  size = 'md',
  bgColor,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm font-medium',
    xl: 'w-14 h-14 text-base font-semibold'
  }[size];

  // Deterministic soft color if none provided
  const defaultBg = bgColor || 'bg-slate-100 text-slate-700 border border-slate-200';
  const customStyle = bgColor ? { backgroundColor: bgColor } : undefined;

  return (
    <div
      title={name}
      style={customStyle}
      className={`inline-flex items-center justify-center rounded-full font-medium select-none shrink-0 ${sizeClasses} ${!bgColor ? defaultBg : 'text-slate-800'} ${className}`}
    >
      {initials}
    </div>
  );
};
