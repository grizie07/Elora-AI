import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const navLinks = [
  { to: "/student", icon: "⌂", label: "Dashboard" },
  { to: "/materials", icon: "📚", label: "Library" },
  { to: "/chats", icon: "💬", label: "AI Chat" },
  { to: "/quizzes", icon: "📝", label: "Quizzes" },
  { to: "/flashcards", icon: "🃏", label: "Flashcards" },
  { to: "/planner", icon: "📅", label: "Planner" },
  { to: "/analytics", icon: "📊", label: "Analytics" },
  { to: "/settings", icon: "⚙", label: "Settings" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isLight = theme === "light";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const bg = isLight ? "#F8FAFC" : "#111827";
  const border = isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.06)";
  const mutedColor = isLight ? "#64748B" : "#6B7280";
  const textColor = isLight ? "#0F172A" : "#fff";

  return (
    <div style={{
      width: 232, minWidth: 232,
      background: bg,
      borderRight: border,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      height: "100vh", position: "sticky", top: 0,
      transition: "background 0.25s",
    }}>
      {/* Logo */}
      <div>
        <div style={{ padding: "24px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg,#6366F1,#A855F7)",
              borderRadius: 10, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18,
            }}>✦</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 1, color: textColor }}>ELORA</div>
              <div style={{ fontSize: 11, color: mutedColor, marginTop: 1 }}>AI Learning System</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navLinks.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 12,
                fontWeight: isActive ? 600 : 400, fontSize: 14,
                color: isActive ? "#fff" : mutedColor,
                background: isActive
                  ? "linear-gradient(135deg,#6366F1,#7C3AED)"
                  : "transparent",
                transition: "all 0.18s", textDecoration: "none",
              })}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Profile / Logout */}
      <div style={{ padding: "16px 16px 20px", borderTop: border }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 12,
            background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
            cursor: "pointer",
          }}
          onClick={handleLogout}
          title="Click to logout"
        >
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg,#6366F1,#A855F7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 15, flexShrink: 0,
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: textColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name || "User"}
            </div>
            <div style={{ fontSize: 11, color: mutedColor, marginTop: 1 }}>
              {user?.course || "Student"}
            </div>
          </div>
          <div style={{ marginLeft: "auto", color: mutedColor, fontSize: 12 }}>↗</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;