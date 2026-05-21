import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formData, setFormData] = useState({ title: "", subject: "", difficulty: "mixed", sourceType: "topic_based" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/quizzes/questions/me")
      .then(r => setQuestions(r.data.data || []))
      .catch(e => setError(e.response?.data?.message || "Failed to load questions"))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) =>
    setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIds.length) { setError("Select at least one question"); return; }
    setError(""); setSubmitting(true);
    try {
      const res = await api.post("/quizzes", { ...formData, questionIds: selectedIds });
      navigate(`/quizzes/${res.data.data._id}/take`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
    } finally { setSubmitting(false); }
  };

  const diffColor = { easy: "#34D399", medium: "#FCD34D", hard: "#F87171" };
  const label = { fontSize: 12, fontWeight: 500, color: "#9CA3AF", marginBottom: 6, display: "block" };

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Create Quiz</h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Select questions and configure your quiz</p>
          </div>
          <Link to="/quizzes" style={{ fontSize: 13, color: "#818CF8", textDecoration: "none" }}>← Back</Link>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Quiz Details */}
          <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Quiz Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><label style={label}>Quiz Title *</label>
                <input name="title" placeholder="e.g. OS Chapter 3 Quiz" value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required /></div>
              <div><label style={label}>Subject</label>
                <input name="subject" placeholder="e.g. Operating Systems" value={formData.subject}
                  onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label style={label}>Difficulty</label>
                <select value={formData.difficulty} onChange={e => setFormData(p => ({ ...p, difficulty: e.target.value }))}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select></div>
              <div><label style={label}>Source Type</label>
                <select value={formData.sourceType} onChange={e => setFormData(p => ({ ...p, sourceType: e.target.value }))}>
                  <option value="topic_based">Topic Based</option>
                  <option value="material_based">Material Based</option>
                  <option value="weakness_based">Weakness Based</option>
                  <option value="mixed">Mixed</option>
                </select></div>
            </div>
          </div>

          {/* Question Selector */}
          <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                Select Questions
                <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 400, marginLeft: 8 }}>
                  ({selectedIds.length} selected)
                </span>
              </div>
              <Link to="/questions/create" style={{ fontSize: 12, color: "#818CF8", textDecoration: "none" }}>+ New Question</Link>
            </div>

            {loading && <p style={{ color: "#6B7280", fontSize: 13 }}>Loading questions...</p>}
            {!loading && questions.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p style={{ color: "#6B7280", fontSize: 13 }}>No questions yet.</p>
                <Link to="/questions/create" style={{ color: "#818CF8", fontSize: 13, display: "block", marginTop: 8 }}>Create your first question →</Link>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>
              {questions.map(q => {
                const sel = selectedIds.includes(q._id);
                return (
                  <div key={q._id} onClick={() => toggle(q._id)} style={{
                    display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px",
                    borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
                    border: `1px solid ${sel ? "#6366F1" : "rgba(255,255,255,0.06)"}`,
                    background: sel ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 2,
                      border: `2px solid ${sel ? "#6366F1" : "#374151"}`,
                      background: sel ? "#6366F1" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 10,
                    }}>
                      {sel ? "✓" : ""}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#E5E7EB", lineHeight: 1.5 }}>{q.questionText}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}>{q.topic}</span>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}>{q.questionType}</span>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5,
                          color: diffColor[q.difficulty] || "#9CA3AF",
                          background: `${diffColor[q.difficulty]}18` || "rgba(255,255,255,0.06)" }}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" disabled={submitting || !selectedIds.length} style={{
            width: "100%", padding: 12, borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
            fontWeight: 600, fontSize: 14, opacity: submitting || !selectedIds.length ? 0.6 : 1,
          }}>
            {submitting ? "Creating Quiz..." : `Create Quiz with ${selectedIds.length} Question${selectedIds.length !== 1 ? "s" : ""}`}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateQuizPage;