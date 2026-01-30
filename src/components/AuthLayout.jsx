import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-5xl bg-slate-800/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-700/50 backdrop-blur-xl animate-fade-in">
        
        {/* Left Side - Branding / Visual */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 transition-transform hover:scale-105">
              <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Resume AI
              </span>
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Craft Your Perfect Career Story
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Build professional, ATS-friendly resumes in minutes with the power of AI. Stand out from the crowd.
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <div className="flex -space-x-4">
               {[1,2,3,4].map((i) => (
                 <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs text-white z-${10-i} bg-cover`} style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`}}></div>
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-indigo-600 flex items-center justify-center text-xs font-bold text-white z-0">
                 +10k
               </div>
            </div>
            <p className="text-sm text-slate-400 mt-3 font-medium">Join 10,000+ professionals hired by top companies</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-900/50 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
              {subtitle && <p className="text-slate-400">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
