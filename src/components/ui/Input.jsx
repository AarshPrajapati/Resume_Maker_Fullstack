import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 hover:border-slate-600'}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
