import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-md cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-sm px-4 py-2.5 gap-2'
  }[size];

  const variantStyles = {
    primary: 'bg-zinc-900 text-white hover:bg-black shadow-xs border border-zinc-900 active:scale-[0.99] transition-transform',
    secondary: 'bg-white text-zinc-800 hover:bg-zinc-100 border border-zinc-300 shadow-xs',
    outline: 'bg-transparent text-zinc-800 hover:bg-zinc-100 border border-zinc-300',
    danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200',
    ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-100 border-transparent'
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
