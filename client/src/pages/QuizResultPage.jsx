import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const QuizResultPage = () => {
  const { attemptId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Results are passed via navigate state — no extra API call needed
  const attempt = state?.attempt;
  const recommendations = state?.recommendations || [];

  // If someone navigates here directly (e.g. refresh), redirect to quizzes
  if (!attempt) {
    return (
      <AppLayout>
        <div style={{ padding: 32, maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            Results Unavailable
          </h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>
            The quiz results are not available after a page refresh. Please take a quiz to see your results.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/quizzes" style={{
              padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
              textDecoration: "none",
            }}>← Go to Quizzes</Link>
            <Link to="/student" style={{
              padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 500,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#9CA3AF", textDecoration: "none",
            }}>Dashboard</Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const accuracy = attempt.accuracy?.toFixed(1);
  const grade =
    accuracy >= 80 ? { label: "Excellent! 🎉", color: "#34D399", bg: "rgba(16,185,129,0.1)", emoji: "🏆" }
    : accuracy >= 60 ? { label: "Good Job! 👍", color: "#FCD34D", bg: "rgba(245,158,11,0.1)", emoji: "👍" }
    : { label: "Keep Practicing 💪", color: "#F87171", bg: "rgba(239,68,68,0.1)", emoji: "💪" };

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 820, margin: "0 auto" }}>

        {/* Score Hero */}
        <div style={{
          background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.1))",
          border: "1px solid rgba(99,102,241,0.25)", borderRadius: 20, padding: "36px 32px",
          textAlign: "center", marginBottom: 24,
        }}>
          <div style={{ fontSize: 56, marginBottom: 10 }}>{grade.emoji}</div>
          <div style={{
            display: "inline-block", fontSize: 13, fontWeight: 600, padding: "5px 14px",
            borderRadius: 8, background: grade.bg, color: grade.color, marginBottom: 14,
          }}>{grade.label}</div>
          <div style={{ fontSize: 60, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{accuracy}%</div>
          <div style={{ fontSize: 15, color: "#9CA3AF", marginTop: 8 }}>
            {attempt.score} / {attempt.totalQuestions} questions correct
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Score", value: attempt.score, icon: "✓", color: "#34D399" },
            { label: "Total", value: attempt.totalQuestions, icon: "📝", color: "#818CF8" },
            { label: "Accuracy", value: `${accuracy}%`, icon: "🎯", color: grade.color },
            { label: "Weak Topics", value: attempt.weakTopicsDetected?.length || 0, icon: "⚠", color: "#F87171" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{
              background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "18px 16px", textAlign: "center",
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Weak / Strong Topics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{
            background: "#161B27", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 16, padding: 20,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#F87171", marginBottom: 14 }}>
              ⚠ Weak Topics
            </h3>
            {attempt.weakTopicsDetected?.length ? (
              attempt.weakTopicsDetected.map(t => (
                <div key={t} style={{
                  fontSize: 13, color: "#E5E7EB", padding: "7px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>{t}</div>
              ))
            ) : (
              <p style={{ color: "#4B5563", fontSize: 13 }}>None detected 🎉</p>
            )}
          </div>
          <div style={{
            background: "#161B27", border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 16, padding: 20,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#34D399", marginBottom: 14 }}>
              ⚡ Strong Topics
            </h3>
            {attempt.strongTopicsDetected?.length ? (
              attempt.strongTopicsDetected.map(t => (
                <div key={t} style={{
                  fontSize: 13, color: "#E5E7EB", padding: "7px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>{t}</div>
              ))
            ) : (
              <p style={{ color: "#4B5563", fontSize: 13 }}>Keep practicing!</p>
            )}
          </div>
        </div>

        {/* Answer Review */}
        <div style={{
          background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, padding: 20, marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
            📋 Answer Review
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {attempt.answers?.map((a, i) => (
              <div key={i} style={{
                padding: "12px 14px", borderRadius: 10,
                background: a.isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${a.isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: a.isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: a.isCorrect ? "#34D399" : "#F87171", fontWeight: 700,
                  }}>
                    {a.isCorrect ? "✓" : "✗"}
                  </span>
                  <span style={{ fontSize: 13, color: "#E5E7EB", fontWeight: 500, flex: 1 }}>
                    {a.topic || `Question ${i + 1}`}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 5,
                    background: a.isCorrect ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                    color: a.isCorrect ? "#34D399" : "#F87171",
                  }}>
                    {a.isCorrect ? "Correct" : "Wrong"}
                  </span>
                </div>
                {!a.isCorrect && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "#6B7280", paddingLeft: 32 }}>
                    Your answer: <span style={{ color: "#F87171" }}>{a.selectedAnswer || "(no answer)"}</span>
                    {" · "}
                    Correct: <span style={{ color: "#34D399" }}>{a.correctAnswer}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div style={{
            background: "#161B27", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 16, padding: 20, marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#818CF8", marginBottom: 14 }}>
              💡 Recommended Next Steps
            </h3>
            {recommendations.map((r, i) => (
              <div key={i} style={{
                fontSize: 13, color: "#E5E7EB", padding: "8px 0",
                borderBottom: i < recommendations.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>{r.topic || r.message || JSON.stringify(r)}</div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/student" style={{
            flex: 1, padding: "13px", borderRadius: 12, textAlign: "center",
            textDecoration: "none",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#9CA3AF", fontWeight: 500, fontSize: 14, transition: "all 0.2s",
          }}>🏠 Back to Dashboard</Link>
          <Link to="/quizzes" style={{
            flex: 1, padding: "13px", borderRadius: 12, textAlign: "center",
            textDecoration: "none",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#9CA3AF", fontWeight: 500, fontSize: 14,
          }}>← All Quizzes</Link>
          <Link to="/analytics" style={{
            flex: 1, padding: "13px", borderRadius: 12, textAlign: "center",
            textDecoration: "none",
            background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
            fontWeight: 600, fontSize: 14,
          }}>📊 View Analytics →</Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default QuizResultPage;