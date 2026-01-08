import React from "react";

export default function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="bg-slate-800 text-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
}
