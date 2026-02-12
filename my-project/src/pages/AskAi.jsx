import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

// ChatGPT Logo
const Logo = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.67.416a6.02 6.02 0 00-5.755 4.218 5.987 5.987 0 00-3.996 2.9 6.042 6.042 0 00.744 7.087 5.98 5.98 0 00.516 4.911 6.04 6.04 0 006.51 2.9A6.07 6.07 0 0013.33 23.584a6.02 6.02 0 005.755-4.218 5.985 5.985 0 003.996-2.9 6.042 6.042 0 00-.799-6.645z" fill="#10a37f"/>
    <path d="M13.33 22.396a4.472 4.472 0 01-2.876-1.05l.143-.082 4.775-2.758a.773.773 0 00.391-.677v-6.737l2.019 1.166a.071.071 0 01.039.054v5.576a4.504 4.504 0 01-4.491 4.508z" fill="#fff"/>
    <path d="M3.463 18.267a4.494 4.494 0 01-.537-3.018l.143.085 4.775 2.758a.782.782 0 00.782 0l5.832-3.367v2.332a.074.074 0 01-.03.06L9.58 19.906a4.506 4.506 0 01-6.117-1.639z" fill="#fff"/>
    <path d="M2.34 7.896a4.485 4.485 0 012.366-1.973v5.682a.773.773 0 00.391.676l5.832 3.367-2.019 1.166a.074.074 0 01-.07.006L3.992 13.93A4.504 4.504 0 012.34 7.872v.024z" fill="#fff"/>
    <path d="M18.837 12.006l-5.832-3.367 2.019-1.166a.074.074 0 01.07-.006l4.848 2.798a4.494 4.494 0 01-.676 8.105v-5.682a.773.773 0 00-.391-.676l-.038-.006z" fill="#fff"/>
    <path d="M20.537 8.75l-.143-.085-4.775-2.758a.782.782 0 00-.782 0L8.997 9.274V6.942a.074.074 0 01.03-.06l4.848-2.798a4.494 4.494 0 016.662 4.666z" fill="#fff"/>
    <path d="M8.005 13.274l-2.019-1.166a.071.071 0 01-.039-.054V6.478a4.494 4.494 0 017.367-3.456l-.143.082-4.775 2.758a.773.773 0 00-.391.677v6.735z" fill="#fff"/>
  </svg>
);

// Mini logo for message avatars
const MiniLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
    <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.67.416a6.02 6.02 0 00-5.755 4.218 5.987 5.987 0 00-3.996 2.9 6.042 6.042 0 00.744 7.087 5.98 5.98 0 00.516 4.911 6.04 6.04 0 006.51 2.9A6.07 6.07 0 0013.33 23.584a6.02 6.02 0 005.755-4.218 5.985 5.985 0 003.996-2.9 6.042 6.042 0 00-.799-6.645z" fill="#10a37f"/>
    <path d="M13.33 22.396a4.472 4.472 0 01-2.876-1.05l.143-.082 4.775-2.758a.773.773 0 00.391-.677v-6.737l2.019 1.166a.071.071 0 01.039.054v5.576a4.504 4.504 0 01-4.491 4.508z" fill="#fff"/>
  </svg>
);

// AI response generator — calls backend or uses built-in fallback
const getAIResponse = async (message, token) => {
  // Try calling the backend first
  try {
    const response = await fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.response || data.reply || data.message || data.answer;
    }
  } catch (err) {
    // Backend not available — use built-in fallback
  }

  // Smart fallback responses
  const msg = message.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hello! 👋 I'm ChatGPT, your AI assistant. I'm here to help you with writing, analysis, coding, brainstorming, and much more. What would you like to explore today?";
  }

  if (msg.includes("write a story") || msg.includes("story")) {
    return "Here's a short story for you:\n\n**The Last Lighthouse Keeper**\n\nOn a forgotten island where the sea met the sky, old Marcus kept the lighthouse burning. Every night for forty years, he climbed 127 steps to light the flame.\n\nOne stormy evening, a young girl washed ashore. She had no memory of where she came from — only a compass that pointed not north, but toward whatever she needed most.\n\n\"Why does it point at you?\" she asked Marcus.\n\nHe smiled. \"Perhaps because everyone needs a light in the dark.\"\n\nFrom that day, Marcus had an apprentice. And the lighthouse never went dark again. 🌊✨";
  }

  if (msg.includes("analyze") || msg.includes("data")) {
    return "I'd love to help you analyze data! Here's how I can assist:\n\n📊 **Data Analysis Capabilities:**\n- Identify trends and patterns in your datasets\n- Statistical summaries and insights\n- Data visualization recommendations\n- Comparative analysis across time periods\n- Anomaly detection and outlier identification\n\nPlease share your data or describe what you'd like to analyze, and I'll provide detailed insights!";
  }

  if (msg.includes("plan") || msg.includes("trip") || msg.includes("travel")) {
    return "Let me help you plan an amazing trip! 🗺️\n\nTo create the perfect itinerary, I need a few details:\n\n1. **Destination** — Where would you like to go?\n2. **Duration** — How many days?\n3. **Budget** — Luxury, mid-range, or budget-friendly?\n4. **Interests** — Adventure, culture, food, relaxation?\n5. **Travel companions** — Solo, couple, family, or friends?\n\nOnce you share these, I'll build a day-by-day itinerary with recommendations for accommodations, activities, restaurants, and local tips! ✈️";
  }

  if (msg.includes("code") || msg.includes("debug") || msg.includes("programming") || msg.includes("javascript") || msg.includes("python")) {
    return "I'm ready to help with your code! 💻\n\nI can assist with:\n\n🔧 **Debugging** — Paste your code and error messages\n📝 **Writing code** — Describe what you need built\n🎓 **Explaining concepts** — Any programming topic\n⚡ **Optimization** — Make your code faster and cleaner\n🔄 **Refactoring** — Improve code structure\n\nI support **Python, JavaScript, TypeScript, Java, C++, Go, Rust**, and many more languages.\n\nWhat would you like to work on?";
  }

  if (msg.includes("email") || msg.includes("draft") || msg.includes("write")) {
    return "I'll help you draft a professional email! ✉️\n\nPlease tell me:\n\n1. **Recipient** — Who is it for? (boss, client, colleague)\n2. **Purpose** — What's the goal? (request, follow-up, invitation, complaint)\n3. **Tone** — Formal, semi-formal, or casual?\n4. **Key points** — What must be included?\n\nHere's a quick template to get started:\n\n---\n**Subject:** [Your topic here]\n\nDear [Name],\n\nI hope this message finds you well. I'm reaching out regarding...\n\nBest regards,\n[Your name]\n\n---\n\nShare the details and I'll customize it for you!";
  }

  if (msg.includes("brainstorm") || msg.includes("idea")) {
    return "Let's brainstorm together! 🧠💡\n\nHere are some creative frameworks to get started:\n\n🎯 **Mind Mapping** — Start with a central concept and branch out\n🔀 **SCAMPER Method** — Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse\n💭 **What If...** — Challenge assumptions with hypothetical questions\n\nTell me your topic or challenge, and I'll generate ideas using these techniques!\n\nSome areas I can brainstorm:\n- Business ideas\n- Marketing campaigns\n- Product features\n- Content topics\n- Problem solutions";
  }

  // Default response
  return `Great question! Here's my take on "${message}":\n\nI can help you explore this topic in depth. Here are some ways I can assist:\n\n🔍 **Research** — I can provide detailed information and explanations\n💡 **Analysis** — I can break down complex concepts into simple terms\n✍️ **Content creation** — I can write, edit, and improve text\n🧮 **Problem solving** — I can help find solutions to challenges\n\nWould you like me to dive deeper into any specific aspect? I'm here to help! 🚀`;
};

const AskAi = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setUserEmail(localStorage.getItem("userEmail") || "User");
  }, [navigate]);

  // Handle initial message from dashboard suggestion
  useEffect(() => {
    if (location.state?.initialMessage && messages.length === 0) {
      handleSend(location.state.initialMessage);
      // Clear the state so it doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (messageText) => {
    const text = messageText || input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Auto-resize textarea back
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }

    const token = localStorage.getItem("token");
    const reply = await getAIResponse(text, token);

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = "24px";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const getInitials = (email) => email?.charAt(0).toUpperCase() || "U";

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-brand">
            <Logo />
            <span>ChatGPT</span>
          </Link>
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New chat
        </button>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Navigation</div>
          <Link to="/dashboard" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </Link>
          <Link to="/ask-ai" className="sidebar-nav-item active" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Ask AI
          </Link>
          <Link to="/" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            Home
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{getInitials(userEmail)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userEmail}</div>
              <div className="sidebar-user-plan">Free plan</div>
            </div>
            <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="dashboard-main">
        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="chat-container">
          {/* Messages or welcome */}
          {messages.length === 0 && !loading ? (
            <div className="chat-welcome">
              <svg className="chat-welcome-logo" viewBox="0 0 24 24" fill="none">
                <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.67.416a6.02 6.02 0 00-5.755 4.218 5.987 5.987 0 00-3.996 2.9 6.042 6.042 0 00.744 7.087 5.98 5.98 0 00.516 4.911 6.04 6.04 0 006.51 2.9A6.07 6.07 0 0013.33 23.584a6.02 6.02 0 005.755-4.218 5.985 5.985 0 003.996-2.9 6.042 6.042 0 00-.799-6.645z" fill="#10a37f"/>
                <path d="M13.33 22.396a4.472 4.472 0 01-2.876-1.05l.143-.082 4.775-2.758a.773.773 0 00.391-.677v-6.737l2.019 1.166a.071.071 0 01.039.054v5.576a4.504 4.504 0 01-4.491 4.508z" fill="#fff"/>
              </svg>
              <h2 className="chat-welcome-title">How can I help you today?</h2>
              <p className="chat-welcome-sub">Ask me anything — I'm here to help!</p>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.role}`}>
                  {msg.role === "assistant" && (
                    <div className="msg-avatar">
                      <MiniLogo />
                    </div>
                  )}
                  <div className="msg-content">
                    {msg.content.split("\n").map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-message assistant">
                  <div className="msg-avatar">
                    <MiniLogo />
                  </div>
                  <div className="msg-content">
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input bar */}
          <div className="chat-input-bar">
            <div className="chat-input-wrapper">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Message ChatGPT..."
                rows={1}
              />
              <button
                className="dash-send-btn"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAi;
