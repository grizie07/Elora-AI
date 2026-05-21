import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";

const diffColor = { easy: "#34D399", medium: "#FCD34D", hard: "#F87171", mixed: "#818CF8" };
const diffBg = { easy: "rgba(16,185,129,0.12)", medium: "rgba(245,158,11,0.12)", hard: "rgba(239,68,68,0.12)", mixed: "rgba(99,102,241,0.12)" };

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/quizzes/me")
      .then(r => setQuizzes(r.data.data || []))
      .catch(e => setError(e.response?.data?.message || "Failed to load quizzes"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>My Quizzes</h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Test your knowledge and track performance</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/questions/create" style={{
              padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#9CA3AF", textDecoration: "none",
            }}>+ Question</Link>
            <Link to="/quizzes/create" style={{
              padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff", textDecoration: "none",
            }}>+ Quiz</Link>
          </div>
        </div>

        {loading && <p style={{ color: "#6B7280", fontSize: 14 }}>Loading quizzes...</p>}
        {error && <p style={{ color: "#F87171", fontSize: 14 }}>{error}</p>}

        {!loading && !error && quizzes.length === 0 && (
          <div style={{
            background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: 48, textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>📝</div>
            <div style={{ fontWeight: 600, color: "#fff", fontSize: 16, marginBottom: 8 }}>No quizzes yet</div>
            <div style={{ color: "#6B7280", fontSize: 13, marginBottom: 20 }}>
              Create questions and build a quiz to test yourself
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Link to="/questions/create" style={{
                padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                background: "rgba(255,255,255,0.06)", color: "#9CA3AF", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>Create Question</Link>
              <Link to="/quizzes/create" style={{
                padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff", textDecoration: "none",
              }}>Create Quiz</Link>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: 14 }}>
          {quizzes.map((quiz) => (
            <div key={quiz._id} style={{
              background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: "18px 22px",
              display: "flex", alignItems: "center", gap: 18,
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.2))",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>📝</div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#fff", marginBottom: 6 }}>{quiz.title}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {quiz.subject && (
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 6,
                      background: "rgba(255,255,255,0.06)", color: "#9CA3AF",
                    }}>{quiz.subject}</span>
                  )}
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 6,
                    background: diffBg[quiz.difficulty] || "rgba(255,255,255,0.06)",
                    color: diffColor[quiz.difficulty] || "#9CA3AF",
                  }}>{quiz.difficulty}</span>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 6,
                    background: "rgba(255,255,255,0.06)", color: "#9CA3AF",
                  }}>{quiz.totalQuestions} questions</span>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 6,
                    background: "rgba(255,255,255,0.06)", color: "#6B7280",
                  }}>{quiz.sourceType?.replace("_", " ")}</span>
                </div>
              </div>

              <Link to={`/quizzes/${quiz._id}/take`} style={{
                padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
                textDecoration: "none", flexShrink: 0,
              }}>
                Start →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default QuizListPage;