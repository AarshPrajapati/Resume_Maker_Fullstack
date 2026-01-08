// import React, { useEffect, useRef } from "react";

// const TextRenderer = ({ content }) => (
//   <div className="whitespace-pre-wrap break-words">{content}</div>
// );

// const PdfViewerCard = ({ url }) => (
//   <div className="w-full max-w-3xl border rounded-xl overflow-hidden shadow bg-white my-2">
//     <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
//       <span className="text-gray-700 font-medium">📄 Resume Ready</span>
//       <a
//         href={url}
//         download="enhanced_resume.pdf"
//         className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//       >
//         Download
//       </a>
//     </div>
//     <iframe
//       src={`${url}#view=FitH&toolbar=0`}
//       className="w-full h-[400px]"
//       title="PDF Preview"
//     />
//   </div>
// );

// const ChatWindow = ({ messages, isTyping }) => {
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   return (
//     <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
//       {messages.map((msg, i) => {
//         const isUser = msg.sender === "User";
//         const isPdf = msg.type === "pdf_ready";

//         return (
//           <div
//             key={i}
//             className={`flex items-start gap-3 my-2 ${
//               isUser ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-xl px-4 py-2 rounded-2xl text-sm shadow break-words ${
//                 isUser
//                   ? "bg-blue-600 text-white rounded-br-none"
//                   : "bg-white text-gray-800 rounded-bl-none"
//               }`}
//             >
//               {isPdf ? <PdfViewerCard url={msg.pdfUrl} /> : <TextRenderer content={msg.text} />}
//             </div>
//           </div>
//         );
//       })}
//       {isTyping && (
//         <div className="flex items-center gap-3 justify-start my-2">
//           <div className="bg-gray-200 px-4 py-2 rounded-2xl flex gap-1 animate-pulse">
//             <span>•</span>
//             <span>•</span>
//             <span>•</span>
//           </div>
//         </div>
//       )}
//       <div ref={bottomRef} />
//     </div>
//   );
// };

// export default ChatWindow;


import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Sparkles } from "lucide-react";

const TextRenderer = ({ content }) => (
  <div className="whitespace-pre-wrap break-words leading-relaxed">{content}</div>
);

const PdfViewerCard = ({ url }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full max-w-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 shadow-xl shadow-slate-200/50"
  >
    <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">Resume Ready</p>
          <p className="text-xs text-slate-500">Your enhanced resume is complete</p>
        </div>
      </div>
      <a
        href={url}
        download="enhanced_resume.pdf"
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
      >
        <Download className="w-4 h-4" />
        Download
      </a>
    </div>
    <iframe
      src={`${url}#view=FitH&toolbar=0`}
      className="w-full h-[420px] bg-white"
      title="PDF Preview"
    />
  </motion.div>
);

const TypingIndicator = () => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
    <div className="bg-white px-5 py-3.5 rounded-2xl rounded-bl-md shadow-sm border border-slate-100">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const ChatWindow = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => {
            const isUser = msg.sender === "User";
            const isPdf = msg.type === "pdf_ready";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] md:max-w-xl ${
                    isPdf ? "w-full" : ""
                  }`}
                >
                  {isPdf ? (
                    <PdfViewerCard url={msg.pdfUrl} />
                  ) : (
                    <div
                      className={`px-5 py-3.5 text-[15px] shadow-sm ${
                        isUser
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-indigo-500/20"
                          : "bg-white text-slate-700 rounded-2xl rounded-bl-md border border-slate-100"
                      }`}
                    >
                      <TextRenderer content={msg.text} />
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white text-xs font-semibold">U</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isTyping && <TypingIndicator />}
        
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatWindow;