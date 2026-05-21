import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const S = {
  page: {
    minHeight: "100vh",
    background: "#0D1117",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "Inter, sans-serif",
  },
  card: {
    background: "#161B27",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 480,
  },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28 },
  logoIcon: {
    width: 40, height: 40,
    background: "linear-gradient(135deg,#6366F1,#A855F7)",
    borderRadius: 12, display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 20,
  },
  h1: { fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 },
  sub: { fontSize: 13, color: "#6B7280", marginBottom: 28 },
  label: { fontSize: 12, fontWeight: 500, color: "#9CA3AF", marginBottom: 6, display: "block" },
  group: { marginBottom: 14 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  error: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13, marginBottom: 16,
  },
  btn: {
    width: "100%", padding: "12px", borderRadius: 12,
    background: "linear-gradient(135deg,#6366F1,#7C3AED)",
    color: "#fff", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", marginTop: 8,
  },
  foot: { marginTop: 20, textAlign: "center", fontSize: 13, color: "#6B7280" },
  link: { color: "#818CF8", fontWeight: 500 },
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", course: "", year: "", studyGoals: "", examDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      login(res.data.data);
      navigate("/student");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logo}>
          <div style={S.logoIcon}>✦</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>ELORA</div>
            <div style={{ fontSize: 11, color: "#6B7280" }}>AI Learning System</div>
          </div>
        </div>
        <h1 style={S.h1}>Create your account</h1>
        <p style={S.sub}>Start your AI-powered learning journey today</p>

        {error && <div style={S.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={S.group}>
            <label style={S.label}>Full Name</label>
            <input name="name" placeholder="Brasen Grizelda" value={formData.name} onChange={handleChange} required />
          </div>
          <div style={S.group}>
            <label style={S.label}>Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div style={S.group}>
            <label style={S.label}>Password</label>
            <input name="password" type="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required />
          </div>
          <div style={{ ...S.grid2, marginBottom: 14 }}>
            <div>
              <label style={S.label}>Course</label>
              <input name="course" placeholder="e.g. BTech CS" value={formData.course} onChange={handleChange} />
            </div>
            <div>
              <label style={S.label}>Year</label>
              <input name="year" placeholder="e.g. 3rd" value={formData.year} onChange={handleChange} />
            </div>
          </div>
          <div style={S.group}>
            <label style={S.label}>Study Goal</label>
            <input name="studyGoals" placeholder="e.g. Interview preparation" value={formData.studyGoals} onChange={handleChange} />
          </div>
          <div style={S.group}>
            <label style={S.label}>Exam Date (optional)</label>
            <input name="examDate" type="date" value={formData.examDate} onChange={handleChange}
              style={{ colorScheme: "dark" }} />
          </div>
          <button type="submit" style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Creating account..." : "Get Started →"}
          </button>
        </form>

        <p style={S.foot}>
          Already have an account?{" "}
          <Link to="/login" style={S.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;