import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-primary">{label}</label>
      <input
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${error ? 'border-red-500' : 'border-border'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
