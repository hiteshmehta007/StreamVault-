import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-2 text-sm font-medium">{label}</label>}
      <textarea
        className={`border rounded-md p-2 resize-none ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      />
      {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default TextArea;