// import React, { useState, useEffect } from "react";
// import ChatWindow from "../components/chat/ChatWindow";
// import MessageInput from "../components/chat/MessageInput";
// import Sidebar from "../components/chat/Sidebar";
// import { auth } from "../firebase";
// import { extractTextFromPDF } from "../utils/pdfExtractor";
// import { FiLogOut } from "react-icons/fi";
// import { generatePdfBlobFromHtml } from "../utils/pdfGenerator";

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [sessionId, setSessionId] = useState(null);
//   const [sessions, setSessions] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ===== Firebase auth + profile ===== */
//   useEffect(() => {
//     const unsub = auth.onAuthStateChanged(async (u) => {
//       if (!u) return;
//       const t = await u.getIdToken();
//       setUser({ uid: u.uid, name: u.displayName || u.email });
//       setToken(t);

//       const res = await fetch("http://localhost:5000/api/user/me", {
//         headers: { Authorization: `Bearer ${t}` },
//       });
//       const data = await res.json();
//       setProfile(data);
//     });
//     return () => unsub();
//   }, []);

//   /* ===== Load all sessions + last chat ===== */
//   useEffect(() => {
//     if (!token) return;

//     const loadSessions = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/chat/all", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setSessions(data.sessions || []);

//         if (data.sessions?.length) {
//           const last = data.sessions[0];
//           setSessionId(last.sessionId);

//           // Load messages
//           const histRes = await fetch(`http://localhost:5000/api/chat/${last.sessionId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const history = await histRes.json();
//           setMessages(history || []);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadSessions();
//   }, [token]);

//   /* ===== Save message ===== */
//   const saveMessage = (msg) => {
//     if (!token || !sessionId) return;
//     fetch(`http://localhost:5000/api/chat/${sessionId}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify(msg),
//     }).catch(console.error);
//   };

//   /* ===== Process AI response (handle HTML → PDF) ===== */
//   const processAiResponse = async (aiText) => {
//     if (!aiText) return;

//     // Check if HTML for PDF
//     if (aiText.includes("<RESUME_FINAL>") || /<[^>]+>/.test(aiText)) {
//       try {
//         const pdfBlob = await generatePdfBlobFromHtml(aiText);
//         const pdfUrl = URL.createObjectURL(pdfBlob);

//         const pdfMsg = {
//           sender: "AI",
//           type: "pdf_ready",
//           pdfUrl,
//           text: "Your resume is ready to view/download!"
//         };
//         setMessages((prev) => [...prev, pdfMsg]);
//         saveMessage(pdfMsg);

//       } catch (err) {
//         console.error("PDF generation failed:", err);
//         const errMsg = { sender: "AI", text: "❌ Failed to generate PDF." };
//         setMessages((prev) => [...prev, errMsg]);
//         saveMessage(errMsg);
//       }
//     } else {
//       const aiMsg = { sender: "AI", text: aiText, createdAt: new Date() };
//       setMessages((prev) => [...prev, aiMsg]);
//       saveMessage(aiMsg);
//     }
//   };

//   /* ===== Send user message + AI reply ===== */
//   const handleSend = async (text) => {
//     const userMsg = { sender: "User", text, createdAt: new Date() };
//     setMessages((prev) => [...prev, userMsg]);
//     saveMessage(userMsg);

//     setIsTyping(true);
//     try {
//       const res = await fetch("http://localhost:5678/webhook/resume-assistant", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           sessionId,
//           message: text,
//           user: { name: user?.name },
//           onboarding: profile?.onboarding || {},
//         }),
//       });
//       const raw = await res.text();
//       const aiText = JSON.parse(raw)?.reply || raw;
//       await processAiResponse(aiText);
//     } catch (err) {
//       console.error(err);
//       const aiMsg = { sender: "AI", text: "AI server error", createdAt: new Date() };
//       setMessages((m) => [...m, aiMsg]);
//       saveMessage(aiMsg);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   /* ===== Drag & drop / PDF Upload ===== */
//   const handleUpload = async (file) => {
//     const uploadMsg = { sender: "User", text: `📄 Uploaded: ${file.name}`, createdAt: new Date() };
//     setMessages((m) => [...m, uploadMsg]);
//     saveMessage(uploadMsg);

//     try {
//       const pdfText = await extractTextFromPDF(file);
//       await handleSend(`Here is my resume PDF content:\n\n${pdfText}`);
//     } catch {
//       const errMsg = { sender: "AI", text: "❌ Failed to read PDF", createdAt: new Date() };
//       setMessages((m) => [...m, errMsg]);
//       saveMessage(errMsg);
//     }
//   };

//   /* ===== New session ===== */
//   const handleNewSession = async () => {
//     if (!token) return;
//     const res = await fetch("http://localhost:5000/api/chat/session", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setSessionId(data.sessionId);
//     setMessages([]);
//     setSessions([{ sessionId: data.sessionId }, ...sessions]);
//   };

//   const handleSelectSession = async (sid) => {
//     setSessionId(sid);
//     const histRes = await fetch(`http://localhost:5000/api/chat/${sid}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const history = await histRes.json();
//     setMessages(history || []);
//   };

//   /* ===== Logout ===== */
//   const handleLogout = async () => {
//     await auth.signOut();
//     setUser(null);
//     setToken(null);
//     setProfile(null);
//     setSessionId(null);
//     setMessages([]);
//   };

//   if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <Sidebar
//         sessions={sessions}
//         currentSession={sessionId}
//         onSelectSession={handleSelectSession}
//         onNewSession={handleNewSession}
//       />

//       <div className="flex-1 flex flex-col">
//         {/* Navbar */}
//         <header className="flex justify-between items-center bg-white border-b px-6 py-4 shadow-md sticky top-0 z-10">
//           <h1 className="text-xl font-semibold text-gray-800">Resume AI Assistant</h1>
//           <div className="flex gap-2">
//             <button
//               onClick={handleNewSession}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             >
//               New Session
//             </button>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
//             >
//               <FiLogOut size={18} /> Logout
//             </button>
//           </div>
//         </header>

//         {/* Chat Window */}
//         <ChatWindow messages={messages} isTyping={isTyping} />

//         {/* Message Input */}
//         <div className="sticky bottom-0 z-10 bg-white border-t px-4 py-2">
//           <MessageInput onSend={handleSend} onUpload={handleUpload} />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import MessageInput from "../components/chat/MessageInput";
import Sidebar from "../components/chat/Sidebar";
import { auth } from "../firebase";
import { extractTextFromPDF } from "../utils/pdfExtractor";
import { FiLogOut } from "react-icons/fi";
import { generatePdfBlobFromHtml } from "../utils/pdfGenerator";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===== Firebase auth + profile ===== */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) return;
      const t = await u.getIdToken();
      setUser({ uid: u.uid, name: u.displayName || u.email });
      setToken(t);

      const res = await fetch("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      setProfile(data);
    });
    return () => unsub();
  }, []);

  /* ===== Load all sessions + latest session messages ===== */
useEffect(() => {
  if (!token) return;

  const loadSessions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chat/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // ✅ Add this line here to avoid undefined errors
      let sessionsData = data.sessions || []; // default to empty array

      setSessions(sessionsData);
      if (sessionsData.length) {
        const last = sessionsData[0];
        setSessionId(last.sessionId);
        console.log("Loading messages for session:", last.sessionId);
        
        const histRes = await fetch(`http://localhost:5000/api/chat/${last.sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const history = await histRes.json();
        setMessages(history || []);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  loadSessions();
}, [token]);



  /* ===== Save message ===== */
  const saveMessage = async (msg) => {
    if (!token || !sessionId) return;
    try {
      await fetch(`http://localhost:5000/api/chat/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(msg),
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  };

  /* ===== Process AI response ===== */
  const processAiResponse = async (aiText) => {
    if (!aiText) return;
    setIsTyping(true);

    try {
      if (aiText.includes("<RESUME_FINAL>") || /<[^>]+>/.test(aiText)) {
        const pdfBlob = await generatePdfBlobFromHtml(aiText);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const pdfMsg = { sender: "AI", type: "pdf_ready", pdfUrl, text: "Your resume is ready!", createdAt: new Date() };
        setMessages((prev) => [...prev, pdfMsg]);
        await saveMessage(pdfMsg);
      } else {
        const aiMsg = { sender: "AI", text: aiText, createdAt: new Date() };
        setMessages((prev) => [...prev, aiMsg]);
        await saveMessage(aiMsg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  /* ===== Send user message ===== */
  const handleSend = async (text) => {
    const userMsg = { sender: "User", text, createdAt: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    await saveMessage(userMsg);

    setIsTyping(true);
    try {
      const res = await fetch("http://localhost:5678/webhook/resume-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text, user: { name: user?.name }, onboarding: profile?.onboarding || {} }),
      });
      const raw = await res.text();
      const aiText = JSON.parse(raw)?.reply || raw;
      await processAiResponse(aiText);
    } catch (err) {
      console.error(err);
      const aiMsg = { sender: "AI", text: "AI server error", createdAt: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      await saveMessage(aiMsg);
      setIsTyping(false);
    }
  };

  /* ===== Upload PDF ===== */
  const handleUpload = async (file) => {
    const uploadMsg = { sender: "User", text: `📄 Uploaded: ${file.name}`, createdAt: new Date() };
    setMessages((prev) => [...prev, uploadMsg]);
    await saveMessage(uploadMsg);

    try {
      setIsTyping(true);
      const pdfText = await extractTextFromPDF(file);
      const res = await fetch("http://localhost:5678/webhook/resume-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: pdfText, user: { name: user?.name }, onboarding: profile?.onboarding || {} }),
      });
      const raw = await res.text();
      const aiText = JSON.parse(raw)?.reply || raw;
      await processAiResponse(aiText);
    } catch (err) {
      console.error(err);
      const errMsg = { sender: "AI", text: "❌ Failed to process PDF", createdAt: new Date() };
      setMessages((prev) => [...prev, errMsg]);
      await saveMessage(errMsg);
    } finally {
      setIsTyping(false);
    }
  };

  /* ===== New session ===== */
  const handleNewSession = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/chat/session", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const newSession = { sessionId: data.sessionId, name: data.name };
      setSessions([newSession, ...sessions]);
      setSessionId(newSession.sessionId);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  /* ===== Select session ===== */
  const handleSelectSession = async (sid) => {
  setSessionId(sid);
  try {
    const histRes = await fetch(`http://localhost:5000/api/chat/${sid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const history = await histRes.json();
    setMessages(Array.isArray(history) ? history : []);
  } catch (err) {
    console.error("Failed to load chat history:", err);
    setMessages([]);
  }
};


  /* ===== Logout ===== */
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setToken(null);
    setProfile(null);
    setSessionId(null);
    setMessages([]);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar sessions={sessions} currentSession={sessionId} onSelectSession={handleSelectSession} onNewSession={handleNewSession} />

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white border-b px-6 py-4 shadow-md sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">Resume AI Assistant</h1>
          <div className="flex gap-2">
            <button onClick={handleNewSession} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">New Session</button>
            <button onClick={handleLogout} className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
              <FiLogOut size={18} /> Logout
            </button>
          </div>
        </header>

        <ChatWindow messages={messages} isTyping={isTyping} />
        <div className="sticky bottom-0 z-10 bg-white border-t px-4 py-2">
          <MessageInput onSend={handleSend} onUpload={handleUpload} />
        </div>
      </div>
    </div>
  );
}
