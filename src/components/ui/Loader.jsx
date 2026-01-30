import React from 'react';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-indigo-500 rounded-full animate-spin"></div>
      </div>
      {text && <p className="text-slate-400 text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
