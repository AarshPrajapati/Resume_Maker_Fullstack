// import React, { useState } from "react";
// import { FiTrash2, FiEdit2, FiStar } from "react-icons/fi";

// const Sidebar = ({
//   sessions,
//   currentSession,
//   onSelectSession,
//   onNewSession,
//   onRename,
//   onDelete,
//   onPin,
//   search,
//   onSearch
// }) => {
//   const [editingId, setEditingId] = useState(null);
//   const [name, setName] = useState("");

//   const formatTime = (date) => {
//     if (!date) return "";
//     const diff = Date.now() - new Date(date).getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return "Just now";
//     if (mins < 60) return `${mins} min ago`;
//     if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
//     return `${Math.floor(mins / 1440)}d ago`;
//   };

//   return (
//     <div className="w-72 bg-[#202123] text-gray-200 flex flex-col h-screen">
//       {/* Header */}
//       <div className="px-4 py-4 border-b border-gray-700 flex justify-between items-center">
//         <span className="font-semibold text-sm uppercase">Chats</span>
//         <button onClick={onNewSession} className="text-xs bg-blue-600 px-2 py-1 rounded">
//           + New
//         </button>
//       </div>

//       {/* Search */}
//       <div className="px-4 py-2 border-b border-gray-700">
//         <input
//           value={search}
//           onChange={(e) => onSearch(e.target.value)}
//           placeholder="Search chats..."
//           className="w-full px-2 py-1 rounded bg-gray-800 text-white text-sm"
//         />
//       </div>

//       {/* Sessions */}
//       <div className="flex-1 overflow-y-auto">
//         {sessions.map((s) => (
//           <div
//             key={s.sessionId}
//             className={`group px-4 py-3 cursor-pointer text-sm flex items-center justify-between ${
//               s.sessionId === currentSession ? "bg-gray-700" : "hover:bg-gray-700/50"
//             }`}
//           >
//             <div className="flex-1 flex flex-col">
//               {editingId === s.sessionId ? (
//                 <input
//                   value={name}
//                   autoFocus
//                   onChange={(e) => setName(e.target.value)}
//                   onBlur={() => { onRename(s.sessionId, name); setEditingId(null); }}
//                   onKeyDown={(e) => { if (e.key === "Enter") { onRename(s.sessionId, name); setEditingId(null); } }}
//                   className="w-full bg-gray-800 text-white px-1"
//                 />
//               ) : (
//                 <span onClick={() => onSelectSession(s.sessionId)} className="truncate">
//                   {s.name || "New Chat"}
//                 </span>
//               )}
//               {s.lastActiveAt && (
//                 <span className="text-xs text-gray-400 mt-1">{formatTime(s.lastActiveAt)}</span>
//               )}
//             </div>

//             <div className="hidden group-hover:flex gap-2 ml-2">
//               <FiStar onClick={() => onPin(s.sessionId)} className={`cursor-pointer ${s.pinned ? "text-yellow-400" : ""}`} />
//               <FiEdit2 onClick={() => { setEditingId(s.sessionId); setName(s.name); }} className="cursor-pointer" />
//               <FiTrash2 onClick={() => onDelete(s.sessionId)} className="cursor-pointer text-red-400" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useState, useEffect, useRef } from "react";
import { Trash2, Pencil, Star, Plus, Search, MessageSquare, Clock, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({
  sessions,
  currentSession,
  onSelectSession,
  onNewSession,
  onRename,
  onDelete,
  onPin,
  search,
  onSearch,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const containerRef = useRef(null);
  const { logout, dbUser } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setEditingId(null);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  const getSessionGroup = (session) => {
    if (session.pinned) return "Pinned";
    if (!session.lastActiveAt) return "Older";
    
    const d = new Date(session.lastActiveAt);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return "Today";
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    
    if (now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000) return "Previous 7 Days";
    
    return "Older";
  };

  // Group sessions
  const groupedSessions = sessions.reduce((groups, session) => {
    const group = getSessionGroup(session);
    if (!groups[group]) groups[group] = [];
    groups[group].push(session);
    return groups;
  }, {});

  const groupOrder = ["Pinned", "Today", "Yesterday", "Previous 7 Days", "Older"];

  return (
    <div ref={containerRef} className="w-72 bg-[#0f1117] flex flex-col h-screen border-r border-slate-800/50">
      {/* Header & New Chat */}
      <div className="p-4">
        <button
          onClick={onNewSession}
          className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/20 group"
        >
          <div className="p-1 bg-white/20 rounded-lg">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span>New Chat</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {groupOrder.map((group) => {
          const groupSessions = groupedSessions[group];
          if (!groupSessions?.length) return null;

          return (
            <div key={group}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group}
              </h3>
              <div className="space-y-1">
                {groupSessions.map((s) => (
                  <div
                    key={s.sessionId}
                    className={`group relative rounded-lg cursor-pointer transition-all duration-200 ${
                      s.sessionId === currentSession
                        ? "bg-slate-800/80 text-white shadow-sm"
                        : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                    }`}
                  >
                    <div className="px-3 py-2.5 flex items-center justify-between" onClick={() => onSelectSession(s.sessionId)}>
                      <div className="flex-1 min-w-0 pr-2">
                        {editingId === s.sessionId ? (
                          <input
                            value={name}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => { onRename(s.sessionId, name); setEditingId(null); }}
                            onKeyDown={(e) => { if (e.key === "Enter") { onRename(s.sessionId, name); setEditingId(null); } }}
                            className="w-full bg-slate-900 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-indigo-500/50"
                          />
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate">{s.name || "New Chat"}</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons (visible on hover) */}
                      {editingId !== s.sessionId && (
                        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${s.sessionId === currentSession ? 'opacity-100' : ''}`}>
                          {!s.pinned && (
                             <button onClick={(e) => { e.stopPropagation(); onPin(s.sessionId); }} className="p-1.5 rounded hover:bg-slate-700 text-slate-500 hover:text-amber-400 transition-colors" title="Pin">
                                <Star className="w-3.5 h-3.5" />
                              </button>
                          )}
                          {s.pinned && (
                             <button onClick={(e) => { e.stopPropagation(); onPin(s.sessionId); }} className="p-1.5 rounded hover:bg-slate-700 text-amber-400 hover:text-slate-400 transition-colors" title="Unpin">
                                <Star className="w-3.5 h-3.5 fill-current" />
                             </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); setEditingId(s.sessionId); setName(s.name || ""); }} className="p-1.5 rounded hover:bg-slate-700 text-slate-500 hover:text-white transition-colors" title="Rename">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onDelete(s.sessionId); }} className="p-1.5 rounded hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {sessions.length === 0 && (
          <div className="text-center py-10 px-4">
             <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
               <MessageSquare className="w-6 h-6 text-slate-600" />
             </div>
             <p className="text-slate-500 text-sm">No conversations yet</p>
          </div>
        )}
      </div>

      {/* Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-[#0f1117]">
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-800 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-md">
              {dbUser?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{dbUser?.name || "User"}</p>
              <p className="text-xs text-slate-500 truncate">Free Plan</p>
            </div>
            {/* <ChevronDown className="w-4 h-4 text-slate-500" /> */}
          </button>

          {profileOpen && (
            <div className={`absolute bottom-full left-0 w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 z-50`}>
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <User className="w-4 h-4" />
                Profile Settings
              </Link>
              <div className="h-px bg-slate-700/50 my-0"></div>
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left">
                <Trash2 className="w-4 h-4" /> 
                <span className="ml-[-3px]">Log Out</span> {/* Trash icon is slightly different size, visual adjustment */}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
