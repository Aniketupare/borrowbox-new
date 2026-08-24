import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-accent text-white dark:text-gray-900 font-semibold hover:bg-accent-hover",
    secondary: "bg-surface text-primary border border-border hover:bg-border/60",
    outline: "bg-transparent text-primary border border-border hover:bg-border/40",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
};
