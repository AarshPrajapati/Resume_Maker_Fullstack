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
import { FileText, Download, Sparkles } from "lucide-react";

const TextRenderer = ({ content }) => (
  <div className="whitespace-pre-wrap break-words leading-relaxed text-slate-300">{content}</div>
);

const PdfViewerCard = ({ url }) => (
  <div className="w-full max-w-2xl rounded-2xl overflow-hidden glass-panel border border-slate-700/50 shadow-2xl animate-scale-in">
    <div className="flex items-center justify-between px-5 py-4 bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-white">Resume Ready</p>
          <p className="text-xs text-slate-400">Your enhanced resume is complete</p>
        </div>
      </div>
      <a
        href={url}
        download="enhanced_resume.pdf"
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
      >
        <Download className="w-4 h-4" />
        Download
      </a>
    </div>
    <iframe
      src={`${url}#view=FitH&toolbar=0`}
      className="w-full h-[500px] bg-slate-900"
      title="PDF Preview"
    />
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
    <div className="glass-panel px-5 py-3.5 rounded-2xl rounded-bl-md shadow-sm border border-slate-700/50">
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
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-0 animate-fade-in" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
             <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shadow-inner border border-white/5 mb-6">
                 <Sparkles className="w-10 h-10 text-indigo-400" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
             <p className="text-slate-400 max-w-md">I can help you build, analyze, or rewrite your resume to increase your chances of getting hired.</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.sender === "User";
          const isPdf = msg.type === "pdf_ready";

          return (
            <div
              key={i}
              className={`flex items-end gap-3 animate-message-in ${isUser ? "justify-end" : "justify-start"}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-2xl ${
                  isPdf ? "w-full" : ""
                }`}
              >
                {isPdf ? (
                  <PdfViewerCard url={msg.pdfUrl} />
                ) : (
                  <div
                    className={`px-6 py-4 text-[15px] shadow-sm leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-indigo-500/20"
                        : "glass-panel text-slate-200 rounded-2xl rounded-bl-md border border-slate-700/50"
                    }`}
                  >
                    {isUser ? msg.text : <TextRenderer content={msg.text} />}
                  </div>
                )}
              </div>
              {isUser && (
                 <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shadow-md flex-shrink-0 border border-slate-600">
                   <span className="text-white text-xs font-semibold">ME</span>
                 </div>
               )}
            </div>
          );
        })}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatWindow;