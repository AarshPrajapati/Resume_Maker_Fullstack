// import React, { useRef, useState } from "react";
// import { FiSend, FiPaperclip } from "react-icons/fi";

// const MessageInput = ({ onSend, onUpload }) => {
//   const [text, setText] = useState("");
//   const fileInputRef = useRef(null);

//   const handleSend = () => {
//     if (!text.trim()) return;
//     onSend(text);
//     setText("");
//   };

//   const handleUploadClick = () => fileInputRef.current.click();

//   return (
//     <div className="border-t bg-white px-4 py-3 shadow-inner">
//       <div className="flex items-center gap-3 max-w-4xl mx-auto">
//         <button
//           onClick={handleUploadClick}
//           className="p-2 rounded-full hover:bg-gray-100 transition"
//           title="Upload Resume"
//         >
//           <FiPaperclip size={20} />
//         </button>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept=".pdf,.txt"
//           hidden
//           onChange={(e) => {
//             if (e.target.files.length === 0) return;
//             onUpload(e.target.files[0]);
//             e.target.value = null;
//           }}
//         />

//         <input
//           className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Type your message…"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />

//         <button
//           onClick={handleSend}
//           disabled={!text.trim()}
//           className="bg-blue-600 text-white px-4 py-2 rounded-full disabled:opacity-50 hover:bg-blue-700 transition"
//         >
//           <FiSend size={18} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageInput;

import React, { useRef, useState } from "react";
import { Send, Paperclip } from "lucide-react";

const MessageInput = ({ onSend, onUpload }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleUploadClick = () => fileInputRef.current.click();

  return (
    <div className="border-t border-slate-100 bg-white/80 backdrop-blur-xl px-4 md:px-8 py-4">
      <div className="max-w-4xl mx-auto">
        <div
          className={`flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 ${
            isFocused
              ? "bg-white shadow-xl shadow-slate-200/50 ring-2 ring-indigo-500/20"
              : "bg-slate-50 hover:bg-slate-100/80"
          }`}
        >
          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            title="Upload Resume"
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-indigo-600 transition-all duration-200"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            hidden
            onChange={(e) => {
              if (!e.target.files.length) return;
              onUpload(e.target.files[0]);
              e.target.value = null;
            }}
          />

          {/* Text Input */}
          <input
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="flex-1 bg-transparent border-0 px-3 py-2.5 text-[15px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={`p-3 rounded-xl transition-all duration-300 ${
              text.trim()
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-3">
          Press Enter to send • Upload PDF or TXT files
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
