import { useTheme } from "../../context/ThemeContext";

const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        background: isLight ? "rgba(248,250,252,0.9)" : "#0D1117",
        borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(8px)",
        transition: "background 0.25s",
      }}
    >
      {/* Search */}
      <div style={{ position: "relative", width: 420, maxWidth: "50%" }}>
        <span style={{
          position: "absolute", left: 14, top: "50%",
          transform: "translateY(-50%)", color: "#4B5563",
          fontSize: 15, pointerEvents: "none",
        }}>🔍</span>
        <input
          type="text"
          placeholder="Search courses, notes, or ask a question..."
          style={{
            background: isLight ? "#F1F5F9" : "#161B27",
            border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 12,
            padding: "10px 14px 10px 40px",
            color: isLight ? "#0F172A" : "#9CA3AF",
            fontSize: 13, width: "100%", outline: "none",
          }}
        />
      </div>

      {/* Icons */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: isLight ? "#E2E8F0" : "#161B27",
            border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)"}`,
            color: isLight ? "#F59E0B" : "#9CA3AF",
            fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s",
          }}
          title={isLight ? "Switch to dark mode" : "Switch to light mode"}
        >
          {isLight ? "🌙" : "☀"}
        </button>

        {/* Notifications */}
        <button
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: isLight ? "#E2E8F0" : "#161B27",
            border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)"}`,
            color: "#9CA3AF", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative",
          }}
          title="Notifications"
        >
          🔔
          <span style={{
            position: "absolute", top: 7, right: 8,
            width: 7, height: 7, borderRadius: "50%",
            background: "#6366F1",
            border: `2px solid ${isLight ? "#F8FAFC" : "#0D1117"}`,
          }} />
        </button>
      </div>
    </div>
  );
};

export default Topbar;