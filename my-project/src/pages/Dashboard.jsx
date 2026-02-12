import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const suggestions = [
  { title: "Write a story", desc: "Create a creative short story on any topic" },
  { title: "Analyze data", desc: "Help me understand trends and patterns" },
  { title: "Plan a trip", desc: "Build an itinerary for my next vacation" },
  { title: "Debug code", desc: "Find and fix issues in my project" },
  { title: "Draft an email", desc: "Compose a professional email quickly" },
  { title: "Brainstorm ideas", desc: "Generate creative concepts for my project" },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setUserEmail(localStorage.getItem("userEmail") || "User");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleSuggestionClick = (title) => {
    navigate("/ask-ai", { state: { initialMessage: title } });
  };

  const handleQuickAsk = (e) => {
    e.preventDefault();
    const input = e.target.elements.quickInput.value.trim();
    if (input) {
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
          <Link to="/dashboard" className="sidebar-nav-item active" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </Link>
          <Link to="/ask-ai" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
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
          <svg className="dash-logo" viewBox="0 0 24 24" fill="none">
            <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.67.416a6.02 6.02 0 00-5.755 4.218 5.987 5.987 0 00-3.996 2.9 6.042 6.042 0 00.744 7.087 5.98 5.98 0 00.516 4.911 6.04 6.04 0 006.51 2.9A6.07 6.07 0 0013.33 23.584a6.02 6.02 0 005.755-4.218 5.985 5.985 0 003.996-2.9 6.042 6.042 0 00-.799-6.645z" fill="#10a37f"/>
            <path d="M13.33 22.396a4.472 4.472 0 01-2.876-1.05l.143-.082 4.775-2.758a.773.773 0 00.391-.677v-6.737l2.019 1.166a.071.071 0 01.039.054v5.576a4.504 4.504 0 01-4.491 4.508z" fill="#fff"/>
            <path d="M3.463 18.267a4.494 4.494 0 01-.537-3.018l.143.085 4.775 2.758a.782.782 0 00.782 0l5.832-3.367v2.332a.074.074 0 01-.03.06L9.58 19.906a4.506 4.506 0 01-6.117-1.639z" fill="#fff"/>
          </svg>

          <h1 className="dash-greeting">{getGreeting()}</h1>
          <p className="dash-subtitle">How can I help you today?</p>

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
              placeholder="Message ChatGPT..."
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
