import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.token) {
      api.get("/auth/profile")
        .then(r => setProfile(r.data.data))
        .catch(e => setError(e.response?.data?.message || "Failed to fetch profile"));
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate("/login"); };

  const field = (label, value) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
      <span style={{ fontSize: 13, color: "#E5E7EB", fontWeight: 500 }}>{value || "—"}</span>
    </div>
  );

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 24 }}>My Profile</h1>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {!profile ? (
          <p style={{ color: "#6B7280", fontSize: 14 }}>Loading profile...</p>
        ) : (
          <>
            {/* Avatar Card */}
            <div style={{
              background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: "28px 24px", marginBottom: 16, textAlign: "center",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", margin: "0 auto 14px",
                background: "linear-gradient(135deg,#6366F1,#A855F7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 700, color: "#fff",
              }}>
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{profile.email}</div>
              <span style={{
                display: "inline-block", marginTop: 10, fontSize: 11, padding: "3px 10px",
                borderRadius: 6, fontWeight: 600, textTransform: "capitalize",
                background: profile.role === "admin" ? "rgba(245,158,11,0.15)" : "rgba(99,102,241,0.15)",
                color: profile.role === "admin" ? "#FCD34D" : "#818CF8",
              }}>{profile.role}</span>
            </div>

            {/* Details */}
            <div style={{
              background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: "4px 20px 4px", marginBottom: 16,
            }}>
              {field("Course", profile.course)}
              {field("Year", profile.year)}
              {field("Study Goal", profile.studyGoals)}
              {field("Exam Date", profile.examDate)}
            </div>

            <button onClick={handleLogout} style={{
              width: "100%", padding: "12px", borderRadius: 12, cursor: "pointer",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#F87171", fontWeight: 600, fontSize: 14,
            }}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default ProfilePage;