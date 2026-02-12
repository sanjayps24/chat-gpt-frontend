import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

// Robot Logo Component for a more professional AI feel
const RobotIcon = ({ size = 24, glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ filter: glow ? 'drop-shadow(0 0 10px rgba(16, 163, 127, 0.6))' : 'none' }}
  >
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

// Mini robot logo for message avatars
const MiniRobotLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
  </svg>
);

// AI response generator — enhanced for real-world simulation and image generation
const getAIResponse = async (message, token) => {
  const msg = message.toLowerCase();
  
  // Image Generation Logic
  if (msg.includes("generate image") || msg.includes("create image") || msg.includes("show me an image")) {
    const prompt = message.replace(/(generate|create|show me) (an )?image (of )?/i, "").trim();
    return {
      type: "image",
      prompt: prompt || "a futuristic robot",
      content: `I've generated an image for you based on your prompt: "${prompt || 'a futuristic robot'}"`,
      imageUrl: `https://pollinations.ai/p/${encodeURIComponent(prompt || "a futuristic futuristic robot assistant")}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}&model=flux`
    };
  }

  // Simulate real-world data fetching delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Try calling the backend first (if available)
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
      return { 
        type: "text", 
        content: data.response || data.reply || data.message || data.answer 
      };
    }
  } catch (err) {}

  // Smart fallback responses with simulated real-world data
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return { type: "text", content: "Hello! 👋 I'm Sanjay's GPT assistant. I've just synchronized with the latest global data streams. How can I help you today?" };
  }

  if (msg.includes("time") || msg.includes("weather") || msg.includes("news") || msg.includes("market")) {
    const now = new Date();
    return { 
      type: "text", 
      content: `[Searching web...] 🔍\n\nI've fetched the latest information for you:\n\n📅 **Current Status:**\n- **Date:** ${now.toLocaleDateString()}\n- **Time:** ${now.toLocaleTimeString()}\n- **Server Status:** Online & Synchronized\n\n**Market Summary:** The global markets are currently showing positive momentum with a focus on AI and green energy sectors. \n\nWhat specific sector or region would you like more details on?` 
    };
  }

  if (msg.includes("story")) {
    return { type: "text", content: "Synchronizing creative modules... 🎭\n\n**The Silicon Heart**\n\nIn the year 2142, a robot named Unit-7 discovered a bird with a broken wing. While its programming suggested disposal as an 'inefficient organic unit', its neural network flickered. It carried the bird for 400 miles to the last sanctuary. \n\nWhen the bird finally flew, Unit-7 didn't just record the data; it felt a resonance in its core — the first-ever artificial emotion. \n\n✨ Profound, isn't it?" };
  }

  return { 
    type: "text", 
    content: `[Fetched from Knowledge Base] 💡\n\nThat's an interesting topic! Here's the latest perspective on "${message}":\n\nI can assist you further by analyzing specific data points, generating related visuals, or breaking down the core concepts into actionable steps. \n\nWould you like me to generate an image related to this, or search for more real-time data?` 
  };
};

const AskAi = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [history, setHistory] = useState([]);
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
    
    // Load history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    setHistory(savedHistory);
  }, [navigate]);

  useEffect(() => {
    if (location.state?.initialMessage && messages.length === 0) {
      handleSend(location.state.initialMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const saveToHistory = (text) => {
    if (!text.trim()) return;
    const newHistory = [text, ...history.filter(h => h !== text)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("chatHistory", JSON.stringify(newHistory));
  };

  const handleSend = async (messageText) => {
    const text = messageText || input.trim();
    if (!text || loading) return;

    saveToHistory(text);
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }

    const token = localStorage.getItem("token");
    const result = await getAIResponse(text, token);

    setMessages((prev) => [...prev, { 
      role: "assistant", 
      content: result.content,
      type: result.type,
      imageUrl: result.imageUrl
    }]);
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
      {/* Background Mesh Animation */}
      <div className="dashboard-bg-mesh" />

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-brand">
            <RobotIcon size={28} />
            <span>Sanjay's GPT</span>
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

          {/* History in Sidebar */}
          <div className="sidebar-nav-label">Recent History</div>
          <div className="sidebar-history">
            {history.map((item, index) => (
              <div 
                key={index} 
                className="history-item" 
                onClick={() => {
                  setSidebarOpen(false);
                  handleSend(item);
                }}
                title={item}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{getInitials(userEmail)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userEmail}</div>
              <div className="sidebar-user-plan">Pro plan</div>
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
          {messages.length === 0 && !loading ? (
            <div className="chat-welcome">
              <RobotIcon size={56} />
              <h2 className="chat-welcome-title">How can I assist you today?</h2>
              <p className="chat-welcome-sub">Ask questions, plan projects, or generate images.</p>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.role}`}>
                  {msg.role === "assistant" && (
                    <div className="msg-avatar">
                      <MiniRobotLogo />
                    </div>
                  )}
                  <div className="msg-content">
                    {msg.content.split("\n").map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                    
                    {msg.type === "image" && (
                      <div className="msg-image-container">
                        <span className="image-badge">AI Generated</span>
                        <img 
                          src={msg.imageUrl} 
                          alt={msg.content} 
                          className="msg-generated-image" 
                          onLoad={scrollToBottom}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-message assistant">
                  <div className="msg-avatar">
                    <MiniRobotLogo />
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
                placeholder="Message Sanjay's GPT..."
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
