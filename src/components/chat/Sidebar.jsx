import React, { useState } from "react";
import { FiTrash2, FiEdit2, FiStar } from "react-icons/fi";

const Sidebar = ({
  sessions,
  currentSession,
  onSelectSession,
  onNewSession,
  onRename,
  onDelete,
  onPin,
  search,
  onSearch
}) => {
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");

  const formatTime = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div className="w-72 bg-[#202123] text-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-700 flex justify-between items-center">
        <span className="font-semibold text-sm uppercase">Chats</span>
        <button onClick={onNewSession} className="text-xs bg-blue-600 px-2 py-1 rounded">
          + New
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-gray-700">
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search chats..."
          className="w-full px-2 py-1 rounded bg-gray-800 text-white text-sm"
        />
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto">
        {sessions.map((s) => (
          <div
            key={s.sessionId}
            className={`group px-4 py-3 cursor-pointer text-sm flex items-center justify-between ${
              s.sessionId === currentSession ? "bg-gray-700" : "hover:bg-gray-700/50"
            }`}
          >
            <div className="flex-1 flex flex-col">
              {editingId === s.sessionId ? (
                <input
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => { onRename(s.sessionId, name); setEditingId(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { onRename(s.sessionId, name); setEditingId(null); } }}
                  className="w-full bg-gray-800 text-white px-1"
                />
              ) : (
                <span onClick={() => onSelectSession(s.sessionId)} className="truncate">
                  {s.name || "New Chat"}
                </span>
              )}
              {s.lastActiveAt && (
                <span className="text-xs text-gray-400 mt-1">{formatTime(s.lastActiveAt)}</span>
              )}
            </div>

            <div className="hidden group-hover:flex gap-2 ml-2">
              <FiStar onClick={() => onPin(s.sessionId)} className={`cursor-pointer ${s.pinned ? "text-yellow-400" : ""}`} />
              <FiEdit2 onClick={() => { setEditingId(s.sessionId); setName(s.name); }} className="cursor-pointer" />
              <FiTrash2 onClick={() => onDelete(s.sessionId)} className="cursor-pointer text-red-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
