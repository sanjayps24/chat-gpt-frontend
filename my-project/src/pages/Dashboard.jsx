import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    style={{ filter: glow ? 'drop-shadow(0 0 8px rgba(16, 163, 127, 0.5))' : 'none' }}
  >
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const suggestions = [
  { title: "Generate a futuristic cityscape", desc: "Image generation prompt" },
  { title: "Analyze global market trends", desc: "Real-world data analysis" },
  { title: "Write a short sci-fi story", desc: "Creative writing" },
  { title: "Plan a trip to Tokyo", desc: "Travel itinerary" },
  { title: "Debug a React useEffect loop", desc: "Coding help" },
  { title: "Draft a promotion request email", desc: "Professional writing" },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setUserEmail(localStorage.getItem("userEmail") || "User");
    
    fetchHistory(token);
  }, [navigate]);

  const fetchHistory = async (token) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/search/history", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data.map(item => item.query));
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleSuggestionClick = (title) => {
    saveToHistory(title);
    navigate("/ask-ai", { state: { initialMessage: title } });
  };

  const saveToHistory = async (text) => {
    if (!text.trim()) return;
    const token = localStorage.getItem("token");
    try {
      await fetch("http://127.0.0.1:8000/search/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ query: text })
      });
      fetchHistory(token);
    } catch (err) {
      // Fallback to local state if backend fails, but still navigate
      const newHistory = [text, ...history.filter(h => h !== text)].slice(0, 10);
      setHistory(newHistory);
    }
  };

  const handleQuickAsk = (e) => {
    e.preventDefault();
    const input = e.target.elements.quickInput.value.trim();
    if (input) {
      saveToHistory(input);
      navigate("/ask-ai", { state: { initialMessage: input } });
    }
  };

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
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

        <button
          className="new-chat-btn"
          onClick={() => navigate("/ask-ai")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New chat
        </button>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Navigation</div>
          <Link to="/" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </Link>
          <Link to="/dashboard" className="sidebar-nav-item active" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
          <Link to="/ask-ai" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Ask AI
          </Link>

          {/* Chat History Section */}
          <div className="sidebar-nav-label">Recent History</div>
          <div className="sidebar-history">
            {history.length > 0 ? (
              history.map((item, index) => (
                <div 
                  key={index} 
                  className="history-item" 
                  onClick={() => handleSuggestionClick(item)}
                  title={item}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  {item}
                </div>
              ))
            ) : (
              <div className="sidebar-nav-item" style={{ opacity: 0.4, cursor: 'default' }}>
                No recent chats
              </div>
            )}
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

      {/* Main */}
      <div className="dashboard-main">
        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="dashboard-welcome">
          <RobotIcon size={64} />

          <h1 className="dash-greeting">{getGreeting()}</h1>
          <p className="dash-subtitle">Welcome to Sanjay's GPT. How can I assist you today?</p>

          <div className="dash-suggestions">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="dash-suggestion-card"
                onClick={() => handleSuggestionClick(s.title)}
              >
                <p className="dash-suggestion-title">{s.title}</p>
                <p className="dash-suggestion-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick input */}
        <div className="dash-input-bar">
          <form className="dash-input-wrapper" onSubmit={handleQuickAsk}>
            <input
              className="dash-input"
              name="quickInput"
              placeholder="Ask anything or generate an image..."
              autoComplete="off"
            />
            <button className="dash-send-btn" type="submit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
