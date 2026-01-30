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
//   const [search, setSearch] = useState("");

//   // Restore last session on refresh
//   useEffect(() => {
//     if (sessionId) localStorage.setItem("lastSessionId", sessionId);
//   }, [sessionId]);

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

//   /* ===== Load all sessions + latest session messages ===== */
//   useEffect(() => {
//     if (!token) return;

//     const loadSessions = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/chat/all", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         const sessionsData = data.sessions || [];

//         // 🆕 NEW USER → AUTO CREATE SESSION
//         if (!sessionsData.length) {
//           const sRes = await fetch("http://localhost:5000/api/chat/session", {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const newSession = await sRes.json();
//           setSessions([newSession]);
//           setSessionId(newSession.sessionId);
//           setMessages([]);
//           return;
//         }

//         setSessions(sessionsData);

//         // Restore last session if exists
//         const lastSessionId = localStorage.getItem("lastSessionId");
//         const preferred =
//           sessionsData.find((s) => s.sessionId === lastSessionId) ||
//           sessionsData[0];

//         setSessionId(preferred.sessionId);

//         const histRes = await fetch(
//           `http://localhost:5000/api/chat/${preferred.sessionId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const history = await histRes.json();
//         setMessages(Array.isArray(history) ? history : []);
//       } catch (err) {
//         console.error("Failed to load sessions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadSessions();
//   }, [token]);

//   /* ===== Save message ===== */
//   const saveMessage = async (msg) => {
//     if (!token || !sessionId) return;

//     try {
//       const res = await fetch(`http://localhost:5000/api/chat/${sessionId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(msg),
//       });

//       const data = await res.json();

//       // 🔥 Update sidebar title locally
//       if (data.renamed && data.newName) {
//         setSessions((prev) =>
//           prev.map((s) =>
//             s.sessionId === sessionId ? { ...s, name: data.newName } : s
//           )
//         );
//       }
//     } catch (err) {
//       console.error("Failed to save message:", err);
//     }
//   };

//   /* ===== Process AI response ===== */
//   const processAiResponse = async (aiText) => {
//     if (!aiText) return;
//     setIsTyping(true);

//     try {
//       if (aiText.includes("<RESUME_FINAL>") || /<[^>]+>/.test(aiText)) {
//         const pdfBlob = await generatePdfBlobFromHtml(aiText);
//         const pdfUrl = URL.createObjectURL(pdfBlob);
//         const pdfMsg = {
//           sender: "AI",
//           type: "pdf_ready",
//           pdfUrl,
//           text: "Your resume is ready!",
//           createdAt: new Date(),
//         };
//         setMessages((prev) => [...prev, pdfMsg]);
//         await saveMessage(pdfMsg);
//       } else {
//         const aiMsg = { sender: "AI", text: aiText, createdAt: new Date() };
//         setMessages((prev) => [...prev, aiMsg]);
//         await saveMessage(aiMsg);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   /* ===== Send user message ===== */
//   const handleSend = async (text) => {
//     const userMsg = { sender: "User", text, createdAt: new Date() };
//     setMessages((prev) => [...prev, userMsg]);
//     await saveMessage(userMsg);

//     setIsTyping(true);
//     try {
//       const res = await fetch(
//         "http://localhost:5678/webhook/resume-assistant",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             sessionId,
//             message: text,
//             user: { name: user?.name },
//             onboarding: profile?.onboarding || {},
//           }),
//         }
//       );
//       const raw = await res.text();
//       const aiText = JSON.parse(raw)?.reply || raw;
//       await processAiResponse(aiText);
//     } catch (err) {
//       console.error(err);
//       const aiMsg = { sender: "AI", text: "AI server error", createdAt: new Date() };
//       setMessages((prev) => [...prev, aiMsg]);
//       await saveMessage(aiMsg);
//       setIsTyping(false);
//     }
//   };

//   /* ===== Upload PDF ===== */
//   const handleUpload = async (file) => {
//     const uploadMsg = { sender: "User", text: `📄 Uploaded: ${file.name}`, createdAt: new Date() };
//     setMessages((prev) => [...prev, uploadMsg]);
//     await saveMessage(uploadMsg);

//     try {
//       setIsTyping(true);
//       const pdfText = await extractTextFromPDF(file);
//       const res = await fetch("http://localhost:5678/webhook/resume-assistant", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           sessionId,
//           message: pdfText,
//           user: { name: user?.name },
//           onboarding: profile?.onboarding || {},
//         }),
//       });
//       const raw = await res.text();
//       const aiText = JSON.parse(raw)?.reply || raw;
//       await processAiResponse(aiText);
//     } catch (err) {
//       console.error(err);
//       const errMsg = { sender: "AI", text: "❌ Failed to process PDF", createdAt: new Date() };
//       setMessages((prev) => [...prev, errMsg]);
//       await saveMessage(errMsg);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   /* ===== New session ===== */
//   const handleNewSession = async () => {
//     if (!token) return;
//     try {
//       const res = await fetch("http://localhost:5000/api/chat/session", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       const newSession = { sessionId: data.sessionId, name: data.name };
//       setSessions([newSession, ...sessions]);
//       setSessionId(newSession.sessionId);
//       setMessages([]);
//     } catch (err) {
//       console.error("Failed to create session:", err);
//     }
//   };

//   /* ===== Select session ===== */
//   const handleSelectSession = async (sid) => {
//     setSessionId(sid);
//     try {
//       const histRes = await fetch(`http://localhost:5000/api/chat/${sid}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const history = await histRes.json();
//       setMessages(Array.isArray(history) ? history : []);
//     } catch (err) {
//       console.error("Failed to load chat history:", err);
//       setMessages([]);
//     }
//   };

//   /* ===== Rename session ===== */
//   const handleRenameSession = async (sid, newName) => {
//     try {
//       await fetch(`http://localhost:5000/api/chat/session/${sid}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ name: newName }),
//       });

//       setSessions((prev) =>
//         prev.map((s) => (s.sessionId === sid ? { ...s, name: newName } : s))
//       );
//     } catch (err) {
//       console.error("Rename failed", err);
//     }
//   };

//   /* ===== Delete session ===== */
//   const handleDeleteSession = async (sid) => {
//     try {
//       await fetch(`http://localhost:5000/api/chat/session/${sid}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSessions((prev) => prev.filter((s) => s.sessionId !== sid));

//       if (sid === sessionId) {
//         setSessionId(null);
//         setMessages([]);
//       }
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
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

//   /* ===== Pin/Unpin session ===== */
//   const handlePinSession = async (sid) => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/chat/session/${sid}/pin`,
//         { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
//       );
//       const data = await res.json();

//       setSessions((prev) =>
//         prev.map((s) => (s.sessionId === sid ? { ...s, pinned: data.pinned } : s))
//       );
//     } catch (err) {
//       console.error("Pin failed", err);
//     }
//   };

//   const filteredSessions = sessions.filter((s) =>
//     s.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   const sortedSessions = [...filteredSessions].sort((a, b) => {
//     if (a.pinned === b.pinned) return 0;
//     return a.pinned ? -1 : 1;
//   });

//   if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

//   return (
//     <div className="flex h-screen">
//       <Sidebar
//         sessions={sortedSessions}
//         currentSession={sessionId}
//         onSelectSession={handleSelectSession}
//         onNewSession={handleNewSession}
//         onRename={handleRenameSession}
//         onDelete={handleDeleteSession}
//         onPin={handlePinSession}
//         search={search}
//         onSearch={setSearch}
//       />

//       <div className="flex-1 flex flex-col">
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

//         <ChatWindow messages={messages} isTyping={isTyping} />
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
import Loader from "../components/ui/Loader";
import { LogOut, Plus, Menu, X } from "lucide-react";
import { auth } from "../firebase";
import { extractTextFromPDF } from "../utils/pdfExtractor";
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
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;


  // Save last session
  useEffect(() => {
    if (sessionId) localStorage.setItem("lastSessionId", sessionId);
  }, [sessionId]);
  useEffect(() => {
  document.title = "Resume AI • Chat";
  }, []);

  /* ===== Firebase auth + profile ===== */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) return;
      const t = await u.getIdToken();
      setUser({ uid: u.uid, name: u.displayName || u.email });
      setToken(t);

      const res = await fetch(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      setProfile(data);
    });
    return () => unsub();
  }, []);

  /* ===== Load sessions + messages ===== */
  useEffect(() => {
    if (!token) return;

    const loadSessions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chat/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const sessionsData = data.sessions || [];

        // New user → auto-create session
        if (!sessionsData.length) {
          const sRes = await fetch(`${API_URL}/api/chat/session`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          const newSession = await sRes.json();
          setSessions([newSession]);
          setSessionId(newSession.sessionId);
          setMessages([]);
          return;
        }

        setSessions(sessionsData);

        // Restore last session
        const lastSessionId = localStorage.getItem("lastSessionId");
        const preferred =
          sessionsData.find((s) => s.sessionId === lastSessionId) ||
          sessionsData[0];

        setSessionId(preferred.sessionId);

        const histRes = await fetch(
          `${API_URL}/api/chat/${preferred.sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const history = await histRes.json();
        setMessages(Array.isArray(history) ? history : []);
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
      const res = await fetch(`${API_URL}/api/chat/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(msg),
      });

      const data = await res.json();
      // Update session name if renamed
      if (data.renamed && data.newName) {
        setSessions((prev) =>
          prev.map((s) =>
            s.sessionId === sessionId ? { ...s, name: data.newName } : s
          )
        );
      }
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
        const pdfMsg = {
          sender: "AI",
          type: "pdf_ready",
          pdfUrl,
          text: "Your resume is ready!",
          createdAt: new Date(),
        };
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
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: text,
          user: { name: user?.name },
          onboarding: profile?.onboarding || {},
        }),
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
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: pdfText,
          user: { name: user?.name },
          onboarding: profile?.onboarding || {},
        }),
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

  /* ===== Session actions ===== */
  const handleNewSession = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/chat/session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const newSession = { sessionId: data.sessionId, name: data.name };
      setSessions([newSession, ...sessions]);
      setSessionId(newSession.sessionId);
      setMessages([]);
      setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  const handleSelectSession = async (sid) => {
    setSessionId(sid);
    setSidebarOpen(false);
    try {
      const histRes = await fetch(`${API_URL}/api/chat/${sid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const history = await histRes.json();
      setMessages(Array.isArray(history) ? history : []);
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setMessages([]);
    }
  };

  const handleRenameSession = async (sid, newName) => {
    try {
      await fetch(`${API_URL}/api/chat/session/${sid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName }),
      });
      setSessions((prev) =>
        prev.map((s) => (s.sessionId === sid ? { ...s, name: newName } : s))
      );
    } catch (err) {
      console.error("Rename failed", err);
    }
  };

  const handleDeleteSession = async (sid) => {
    try {
      await fetch(`${API_URL}/api/chat/session/${sid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions((prev) => prev.filter((s) => s.sessionId !== sid));
      if (sid === sessionId) {
        setSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handlePinSession = async (sid) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/session/${sid}/pin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSessions((prev) =>
        prev.map((s) => (s.sessionId === sid ? { ...s, pinned: data.pinned } : s))
      );
    } catch (err) {
      console.error("Pin failed", err);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setToken(null);
    setProfile(null);
    setSessionId(null);
    setMessages([]);
    setSidebarOpen(false);
  };

  /* ===== Filter + sort sessions ===== */
  const filteredSessions = sessions.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });

  if (loading) {
    return <Loader fullScreen text="Loading your workspace..." />;
  }

  return (
    <div className="flex h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-white overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative z-50 md:z-auto h-full transform transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          sessions={sortedSessions}
          currentSession={sessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onRename={handleRenameSession}
          onDelete={handleDeleteSession}
          onPin={handlePinSession}
          search={search}
          onSearch={setSearch}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
        <header className="flex items-center justify-between glass-panel border-b border-slate-700/50 px-4 md:px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <img src="/logo.svg" className="w-9 h-9" alt="Logo" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold text-white">
                   {sessions.find(s => s.sessionId === sessionId)?.name || "Resume AI"}
                </h1>
                <p className="text-xs text-slate-500">
                  {sessions.find(s => s.sessionId === sessionId) ? "Chat Session" : "Your intelligent assistant"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewSession}
              className="md:hidden flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
            {/* Desktop: Only show actions that aren't in sidebar if minimal look desired, but 'New Chat' is good to keep accessible */}
            <div className="hidden md:flex items-center gap-3">
               <span className="text-xs text-slate-500 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50">
                  {user?.name || user?.email}
               </span>
            </div>
          </div>
        </header>

        <ChatWindow messages={messages} isTyping={isTyping} />
        <MessageInput onSend={handleSend} onUpload={handleUpload} />
      </div>
    </div>
  );
}
