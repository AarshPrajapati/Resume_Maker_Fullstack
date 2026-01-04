import React, { useEffect, useRef } from "react";

const TextRenderer = ({ content }) => (
  <div className="whitespace-pre-wrap break-words">{content}</div>
);

const PdfViewerCard = ({ url }) => (
  <div className="w-full max-w-3xl border rounded-xl overflow-hidden shadow bg-white my-2">
    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
      <span className="text-gray-700 font-medium">📄 Resume Ready</span>
      <a
        href={url}
        download="enhanced_resume.pdf"
        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Download
      </a>
    </div>
    <iframe
      src={`${url}#view=FitH&toolbar=0`}
      className="w-full h-[400px]"
      title="PDF Preview"
    />
  </div>
);

const ChatWindow = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
      {messages.map((msg, i) => {
        const isUser = msg.sender === "User";
        const isPdf = msg.type === "pdf_ready";

        return (
          <div
            key={i}
            className={`flex items-start gap-3 my-2 ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xl px-4 py-2 rounded-2xl text-sm shadow break-words ${
                isUser
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {isPdf ? <PdfViewerCard url={msg.pdfUrl} /> : <TextRenderer content={msg.text} />}
            </div>
          </div>
        );
      })}
      {isTyping && (
        <div className="flex items-center gap-3 justify-start my-2">
          <div className="bg-gray-200 px-4 py-2 rounded-2xl flex gap-1 animate-pulse">
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
