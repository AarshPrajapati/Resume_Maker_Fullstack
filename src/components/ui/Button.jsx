import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false, 
  disabled, 
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 focus:ring-indigo-500 border-none",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 focus:ring-slate-500",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white focus:ring-slate-500",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 focus:ring-red-500"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};

export default Button;
