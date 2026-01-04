import React, { useRef, useState } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";

const MessageInput = ({ onSend, onUpload }) => {
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleUploadClick = () => fileInputRef.current.click();

  return (
    <div className="border-t bg-white px-4 py-3 shadow-inner">
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <button
          onClick={handleUploadClick}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Upload Resume"
        >
          <FiPaperclip size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          hidden
          onChange={(e) => {
            if (e.target.files.length === 0) return;
            onUpload(e.target.files[0]);
            e.target.value = null;
          }}
        />

        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-full disabled:opacity-50 hover:bg-blue-700 transition"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
