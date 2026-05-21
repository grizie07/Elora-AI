import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";

const AdminHomePage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard/admin")
      .then(r => setDashboard(r.data.data))
      .catch(e => setError(e.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><div style={{ padding: 32, color: "#6B7280" }}>Loading...</div></AppLayout>;
  if (error) return <AppLayout><div style={{ padding: 32, color: "#F87171" }}>{error}</div></AppLayout>;

  const d = dashboard;
  const stats = [
    { label: "Total Users", value: d?.summary?.totalUsers, icon: "👤", color: "#6366F1" },
    { label: "Students", value: d?.summary?.totalStudents, icon: "🎓", color: "#10B981" },
    { label: "Admins", value: d?.summary?.totalAdmins, icon: "🛡", color: "#F59E0B" },
    { label: "Total Quizzes", value: d?.summary?.totalQuizzes, icon: "📝", color: "#EC4899" },
    { label: "Quiz Attempts", value: d?.summary?.totalQuizAttempts, icon: "🔄", color: "#6366F1" },
    { label: "Recommendations", value: d?.summary?.totalRecommendations, icon: "💡", color: "#10B981" },
  ];

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Header */}
        <div style={{
          background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, padding: "22px 28px",
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
            Admin Dashboard 🛡
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
            System-wide overview · Logged in as {user?.name}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {stats.map(({ label, value, icon, color }) => (
            <div key={label} style={{
              background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: 20,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${color}22`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 20,
              }}>{icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>{value ?? 0}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Users + Attempts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Recent Users */}
          <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>Recent Users</div>
            </div>
            <div>
              {d?.recentUsers?.map((u, i) => (
                <div key={u._id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 20px",
                  borderBottom: i < d.recentUsers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,#6366F1,#A855F7)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13, color: "#fff",
                  }}>{u.name?.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{u.email}</div>
                  </div>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 5, fontWeight: 500,
                    background: u.role === "admin" ? "rgba(245,158,11,0.15)" : "rgba(99,102,241,0.15)",
                    color: u.role === "admin" ? "#FCD34D" : "#818CF8",
                  }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Attempts */}
          <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>Recent Quiz Attempts</div>
            </div>
            <div>
              {d?.recentQuizAttempts?.map((a, i) => (
                <div key={a._id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 20px",
                  borderBottom: i < d.recentQuizAttempts.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{ fontSize: 20 }}>📝</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{a.quizId?.title || "Quiz"}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{a.userId?.name} · {a.score}/{a.totalQuestions}</div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: a.accuracy >= 80 ? "#34D399" : a.accuracy >= 60 ? "#FCD34D" : "#F87171",
                  }}>{a.accuracy?.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminHomePage;