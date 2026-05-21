import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const [notifications, setNotifications] = useState({
    quizReminders: true,
    recommendationAlerts: true,
    weeklyReport: false,
  });

  const toggleNotif = (key) => setNotifications(p => ({ ...p, [key]: !p[key] }));

  const cardStyle = {
    background: isLight ? "#fff" : "#161B27",
    border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 16,
    overflow: "hidden",
    transition: "background 0.25s",
  };

  const headerStyle = {
    padding: "14px 20px",
    borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
    display: "flex", alignItems: "center", gap: 10,
  };

  const rowStyle = (last) => ({
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: last ? "none" : `1px solid ${isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"}`,
  });

  const Toggle = ({ value, onToggle }) => (
    <div onClick={onToggle} style={{
      width: 44, height: 24, borderRadius: 12, cursor: "pointer",
      background: value ? "linear-gradient(135deg,#6366F1,#7C3AED)" : (isLight ? "#CBD5E1" : "rgba(255,255,255,0.1)"),
      position: "relative", transition: "background 0.2s",
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </div>
  );

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 700, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: isLight ? "#0F172A" : "#fff" }}>Settings</h1>
          <p style={{ fontSize: 13, color: isLight ? "#64748B" : "#6B7280", marginTop: 4 }}>Customize your ELORA experience</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Appearance */}
          <div style={cardStyle}>
            <div style={headerStyle}>
              <span style={{ fontSize: 16 }}>🎨</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: isLight ? "#0F172A" : "#fff" }}>Appearance</span>
            </div>
            <div>
              <div style={rowStyle(false)}>
                <span style={{ fontSize: 13, color: isLight ? "#475569" : "#E5E7EB" }}>Theme</span>
                <button onClick={toggleTheme} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                  background: isLight ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)", color: "#818CF8",
                  fontSize: 13, fontWeight: 600,
                }}>
                  {isLight ? "☀ Light" : "🌙 Dark"}
                  <span style={{ fontSize: 11, color: "#6B7280" }}>— click to switch</span>
                </button>
              </div>
              <div style={rowStyle(true)}>
                <span style={{ fontSize: 13, color: isLight ? "#475569" : "#E5E7EB" }}>Language</span>
                <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: "rgba(99,102,241,0.15)", color: "#818CF8", fontWeight: 500 }}>English</span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div style={cardStyle}>
            <div style={headerStyle}>
              <span style={{ fontSize: 16 }}>🔔</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: isLight ? "#0F172A" : "#fff" }}>Notifications</span>
            </div>
            <div>
              {[
                { key: "quizReminders", label: "Quiz Reminders" },
                { key: "recommendationAlerts", label: "Recommendation Alerts" },
                { key: "weeklyReport", label: "Weekly Progress Report" },
              ].map(({ key, label }, i, arr) => (
                <div key={key} style={rowStyle(i === arr.length - 1)}>
                  <span style={{ fontSize: 13, color: isLight ? "#475569" : "#E5E7EB" }}>{label}</span>
                  <Toggle value={notifications[key]} onToggle={() => toggleNotif(key)} />
                </div>
              ))}
            </div>
          </div>

          {/* Study Preferences */}
          <div style={cardStyle}>
            <div style={headerStyle}>
              <span style={{ fontSize: 16 }}>📚</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: isLight ? "#0F172A" : "#fff" }}>Study Preferences</span>
            </div>
            <div>
              {[
                { label: "Default Quiz Difficulty", value: "Mixed" },
                { label: "Daily Study Goal", value: "2 hours", last: true },
              ].map((item, i) => (
                <div key={item.label} style={rowStyle(item.last)}>
                  <span style={{ fontSize: 13, color: isLight ? "#475569" : "#E5E7EB" }}>{item.label}</span>
                  <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: "rgba(99,102,241,0.15)", color: "#818CF8", fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div style={{ ...cardStyle, padding: "20px 24px", textAlign: "center", overflow: "visible" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, margin: "0 auto 12px", background: "linear-gradient(135deg,#6366F1,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✦</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: isLight ? "#0F172A" : "#fff" }}>ELORA</div>
            <div style={{ fontSize: 12, color: isLight ? "#64748B" : "#6B7280", marginTop: 4 }}>AI Learning System · v1.0.0</div>
            <div style={{ fontSize: 12, color: isLight ? "#94A3B8" : "#4B5563", marginTop: 6 }}>
              Powered by retrieval-augmented AI and semantic search
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;