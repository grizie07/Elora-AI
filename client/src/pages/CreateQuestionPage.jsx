import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";

const CreateQuestionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    questionText: "", questionType: "mcq", options: ["", "", "", ""],
    correctAnswer: "", explanation: "", subject: "", chapter: "",
    topic: "", subtopic: "", difficulty: "easy",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleOptionChange = (i, val) => {
    const opts = [...formData.options];
    opts[i] = val;
    setFormData(p => ({ ...p, options: opts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const payload = { ...formData, options: formData.options.filter(Boolean) };
      await api.post("/quizzes/questions", payload);
      navigate("/quizzes");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create question");
    } finally { setLoading(false); }
  };

  const label = { fontSize: 12, fontWeight: 500, color: "#9CA3AF", marginBottom: 6, display: "block" };
  const sectionCard = { background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22, marginBottom: 16 };

  const showOptions = formData.questionType === "mcq";
  const showTrueFalse = formData.questionType === "true_false";

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Create Question</h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Add a new question to the question bank</p>
          </div>
          <Link to="/quizzes" style={{ fontSize: 13, color: "#818CF8", textDecoration: "none" }}>← Back</Link>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Question */}
          <div style={sectionCard}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Question</div>
            <div style={{ marginBottom: 14 }}>
              <label style={label}>Question Text *</label>
              <textarea name="questionText" placeholder="Enter your question here..." rows={3} value={formData.questionText}
                onChange={handleChange} required style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={label}>Question Type</label>
                <select name="questionType" value={formData.questionType} onChange={handleChange}>
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="true_false">True / False</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="fill_blank">Fill in the Blank</option>
                </select>
              </div>
              <div>
                <label style={label}>Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Options */}
          {showOptions && (
            <div style={sectionCard}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Answer Options</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                {formData.options.map((opt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: "rgba(99,102,241,0.15)", color: "#818CF8",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 12,
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt}
                      onChange={e => handleOptionChange(i, e.target.value)} />
                  </div>
                ))}
              </div>
              <div>
                <label style={label}>Correct Answer *</label>
                <select name="correctAnswer" value={formData.correctAnswer} onChange={handleChange} required>
                  <option value="">Select correct option</option>
                  {formData.options.filter(Boolean).map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {showTrueFalse && (
            <div style={sectionCard}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Correct Answer</div>
              <div style={{ display: "flex", gap: 12 }}>
                {["True", "False"].map(v => (
                  <button key={v} type="button" onClick={() => setFormData(p => ({ ...p, correctAnswer: v }))} style={{
                    flex: 1, padding: "11px", borderRadius: 10, cursor: "pointer",
                    border: `1px solid ${formData.correctAnswer === v ? "#6366F1" : "rgba(255,255,255,0.08)"}`,
                    background: formData.correctAnswer === v ? "rgba(99,102,241,0.15)" : "transparent",
                    color: formData.correctAnswer === v ? "#fff" : "#9CA3AF", fontSize: 14, fontWeight: 500,
                    transition: "all 0.15s",
                  }}>{v}</button>
                ))}
              </div>
            </div>
          )}

          {!showOptions && !showTrueFalse && (
            <div style={sectionCard}>
              <label style={label}>Correct Answer *</label>
              <input name="correctAnswer" placeholder="Enter the correct answer" value={formData.correctAnswer} onChange={handleChange} required />
            </div>
          )}

          {/* Metadata */}
          <div style={sectionCard}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Topic Metadata</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label style={label}>Subject *</label><input name="subject" placeholder="e.g. Operating Systems" value={formData.subject} onChange={handleChange} required /></div>
              <div><label style={label}>Chapter</label><input name="chapter" placeholder="e.g. Chapter 3" value={formData.chapter} onChange={handleChange} /></div>
              <div><label style={label}>Topic *</label><input name="topic" placeholder="e.g. Process Scheduling" value={formData.topic} onChange={handleChange} required /></div>
              <div><label style={label}>Subtopic</label><input name="subtopic" placeholder="e.g. Round Robin" value={formData.subtopic} onChange={handleChange} /></div>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={label}>Explanation (optional)</label>
              <textarea name="explanation" placeholder="Explain why the answer is correct..." rows={2} value={formData.explanation} onChange={handleChange} style={{ resize: "vertical" }} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: 12, borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
            fontWeight: 600, fontSize: 14, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Saving..." : "Save Question"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateQuestionPage;