import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
};