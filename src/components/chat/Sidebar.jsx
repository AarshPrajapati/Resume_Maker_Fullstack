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
import { Trash2, Pencil, Star, Plus, Search, MessageSquare, Clock } from "lucide-react";

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
  const containerRef = useRef(null);

  // Cancel rename on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        editingId &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setEditingId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingId]);

  const formatTime = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div
      ref={containerRef}
      className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-200 flex flex-col h-screen"
    >
      <div className="px-5 py-5 border-b border-slate-800/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Conversations</span>
          </div>
        </div>

        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {sessions.map((s) => (
          <div
            key={s.sessionId}
            className={`group relative rounded-xl cursor-pointer transition-all duration-200 ${
              s.sessionId === currentSession
                ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
                : "hover:bg-slate-800/50 border border-transparent"
            }`}
          >
            <div className="px-4 py-3 flex items-start justify-between">
              <div
                className="flex-1 min-w-0"
                onClick={() => onSelectSession(s.sessionId)}
              >
                {editingId === s.sessionId ? (
                  <input
                    value={name}
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => {
                      onRename(s.sessionId, name);
                      setEditingId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onRename(s.sessionId, name);
                        setEditingId(null);
                      }
                    }}
                    className="w-full bg-slate-700 text-white px-2 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      {s.pinned && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                      <span className="text-sm font-medium text-white truncate">
                        {s.name || "New Chat"}
                      </span>
                    </div>
                    {s.lastActiveAt && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500">
                          {formatTime(s.lastActiveAt)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="hidden group-hover:flex items-center gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPin(s.sessionId);
                  }}
                  className={`p-1.5 rounded-lg transition-colors relative ${
                    s.pinned
                      ? "text-amber-400"
                      : "text-slate-400 hover:text-amber-400 hover:bg-slate-700"
                  }`}
                  title={s.pinned ? "Unpin" : "Pin"}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${s.pinned ? "fill-amber-400" : ""}`}
                  />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(s.sessionId);
                    setName(s.name || "");
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors relative"
                  title="Rename"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s.sessionId);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors relative"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-4 border-t border-slate-800/50">
        <p className="text-xs text-slate-500 text-center">Resume AI Assistant</p>
      </div>
    </div>
  );
};

export default Sidebar;
