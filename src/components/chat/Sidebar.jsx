import React from "react";

const Sidebar = ({ sessions, currentSession, onSelectSession, onNewSession }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen overflow-y-auto">
      <div className="px-4 py-4 font-bold text-lg border-b border-gray-700 flex justify-between items-center">
        <span>Sessions</span>
        <button
          onClick={onNewSession}
          className="bg-blue-600 px-2 py-1 rounded hover:bg-blue-700 text-sm"
        >
          + New
        </button>
      </div>
      <div className="flex-1">
        {sessions.map((s) => (
          <div
            key={s.sessionId}
            onClick={() => onSelectSession(s.sessionId)}
            className={`px-4 py-3 cursor-pointer hover:bg-gray-700 ${
              s.sessionId === currentSession ? "bg-gray-700" : ""
            }`}
          >
            Session {s.sessionId.slice(-4)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
