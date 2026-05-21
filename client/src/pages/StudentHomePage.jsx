import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";

const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16, padding: 20, ...style,
  }}>
    {children}
  </div>
);

const StatCard = ({ label, value, icon, color = "#6366F1" }) => (
  <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{label}</span>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16,
      }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{value ?? 0}</div>
  </Card>
);

const StudentHomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/dashboard/student");
        setDashboard(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetch();
  }, [user]);

  if (loading) return (
    <AppLayout>
      <div style={{ padding: 32, color: "#6B7280", fontSize: 14 }}>Loading dashboard...</div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div style={{ padding: 32, color: "#F87171", fontSize: 14 }}>{error}</div>
    </AppLayout>
  );

  const d = dashboard;
  const stats = [
    { label: "Quiz Attempts", value: d?.summary?.totalQuizAttempts, icon: "📝", color: "#6366F1" },
    { label: "Accuracy", value: `${d?.summary?.averageAccuracy || 0}%`, icon: "🎯", color: "#10B981" },
    { label: "Weak Topics", value: d?.summary?.weakTopicsCount, icon: "⚠", color: "#F59E0B" },
    { label: "Strong Topics", value: d?.summary?.strongTopicsCount, icon: "⚡", color: "#6366F1" },
    { label: "Pending", value: d?.summary?.pendingRecommendationsCount, icon: "📌", color: "#EC4899" },
  ];

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Welcome Header */}
        <Card style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
                Welcome back, {d?.user?.name?.split(" ")[0]} 👋
              </h1>
              <p style={{ color: "#6B7280", fontSize: 13, marginTop: 6 }}>
                {d?.user?.course} · {d?.user?.year} · Goal: {d?.user?.studyGoals}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { to: "/quizzes", label: "📝 Quizzes" },
                { to: "/materials", label: "📚 Library" },
                { to: "/chats", label: "💬 AI Chat" },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{
                  padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                  background: "rgba(99,102,241,0.15)", color: "#818CF8",
                  border: "1px solid rgba(99,102,241,0.3)", textDecoration: "none",
                  transition: "background 0.2s",
                }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* AI Quick Actions */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 14 }}>AI Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[
              { to: "/chats/create", icon: "✦", title: "Ask AI Anything", sub: "Get instant answers from your materials", color: "#6366F1" },
              { to: "/materials/upload", icon: "⬆", title: "Upload Material", sub: "PDFs, notes, or documents", color: "#10B981" },
              { to: "/quizzes", icon: "📝", title: "Take a Quiz", sub: "Test your knowledge and track progress", color: "#F59E0B" },
            ].map(({ to, icon, title, sub, color }) => (
              <Link key={to} to={to} style={{ textDecoration: "none" }}>
                <Card style={{
                  cursor: "pointer", transition: "border-color 0.2s",
                  borderColor: "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", gap: 16,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: `${color}22`, color,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>{sub}</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Weak + Strong Topics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 16 }}>⚠ Weak Topics</h2>
            {d?.weakTopics?.length ? d.weakTopics.map((t) => (
              <div key={t._id} style={{
                borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12, marginBottom: 12,
              }}>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#fff" }}>{t.topic}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>
                  {t.subject} · {t.accuracy?.toFixed(1)}% accuracy
                </div>
              </div>
            )) : <p style={{ color: "#4B5563", fontSize: 13 }}>No weak topics yet 🎉</p>}
          </Card>

          <Card>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 16 }}>⚡ Strong Topics</h2>
            {d?.strongTopics?.length ? d.strongTopics.map((t) => (
              <div key={t._id} style={{
                borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12, marginBottom: 12,
              }}>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#fff" }}>{t.topic}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>
                  {t.subject} · {t.accuracy?.toFixed(1)}% accuracy
                </div>
              </div>
            )) : <p style={{ color: "#4B5563", fontSize: 13 }}>Complete quizzes to see your strong topics</p>}
          </Card>
        </div>

        {/* Recommendations */}
        {d?.recommendations?.length > 0 && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 14 }}>📌 Recommendations</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {d.recommendations.slice(0, 4).map((r) => (
                <Card key={r._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: r.priority === "high" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                    color: r.priority === "high" ? "#F87171" : "#FCD34D",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                  }}>
                    {r.type === "quiz" ? "📝" : "💡"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{r.message}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 6,
                    background: r.priority === "high" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                    color: r.priority === "high" ? "#F87171" : "#FCD34D",
                  }}>
                    {r.priority}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default StudentHomePage;