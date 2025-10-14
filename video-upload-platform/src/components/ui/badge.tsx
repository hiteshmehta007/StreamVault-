import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'outline' | 'secondary';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => {
  const baseStyles = 'inline-flex items-center px-2 py-1 text-sm font-medium rounded';
  const variantStyles = {
    default: 'bg-blue-500 text-white',
    outline: 'border border-blue-500 text-blue-500',
    secondary: 'bg-gray-200 text-gray-800',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;