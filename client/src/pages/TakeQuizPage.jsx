import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";

const TakeQuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answersMap, setAnswersMap] = useState({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/quizzes/${id}`)
      .then(r => setQuiz(r.data.data))
      .catch(e => setError(e.response?.data?.message || "Failed to load quiz"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnswer = (questionId, answer) =>
    setAnswersMap(p => ({ ...p, [questionId]: answer }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answers = quiz.questionIds.map(q => ({
        questionId: q._id,
        selectedAnswer: answersMap[q._id] || "",
        subject: q.subject,
        chapter: q.chapter || "",
        topic: q.topic,
        subtopic: q.subtopic || "",
        difficulty: q.difficulty,
        timeTakenSeconds: 0,
      }));
      const res = await api.post("/quizzes/attempts", { quizId: id, answers, totalTimeSeconds: 0 });
      const { attempt, weakTopicsDetected, strongTopicsDetected, recommendations } = res.data.data;
      navigate(`/quizzes/results/${attempt._id}`, {
        state: { attempt, weakTopicsDetected, strongTopicsDetected, recommendations },
      });
    } catch (e) {
      setError(e.response?.data?.message || "Submission failed");
      setSubmitting(false);
    }
  };

  if (loading) return <AppLayout><div style={{ padding: 32, color: "#6B7280" }}>Loading quiz...</div></AppLayout>;
  if (error) return <AppLayout><div style={{ padding: 32, color: "#F87171" }}>{error}</div></AppLayout>;
  if (!quiz) return null;

  const questions = quiz.questionIds;
  const q = questions[current];
  const answered = Object.keys(answersMap).length;
  const progress = (current / questions.length) * 100;

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 780, margin: "0 auto" }}>
        {/* Quiz Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{quiz.title}</h1>
            <span style={{ fontSize: 13, color: "#6B7280" }}>
              {answered}/{questions.length} answered
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: "linear-gradient(90deg,#6366F1,#A855F7)",
              borderRadius: 4, transition: "width 0.3s",
            }} />
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 28, marginBottom: 20,
        }}>
          <div style={{
            display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px",
            borderRadius: 6, background: "rgba(99,102,241,0.15)", color: "#818CF8", marginBottom: 16,
          }}>
            Question {current + 1} of {questions.length}
          </div>
          <p style={{ fontSize: 17, fontWeight: 500, color: "#fff", lineHeight: 1.6, marginBottom: 24 }}>
            {q.questionText}
          </p>

          {/* Options */}
          {(q.questionType === "mcq" || q.options?.length > 0) && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => {
                const selected = answersMap[q._id] === opt;
                return (
                  <button key={i} onClick={() => handleAnswer(q._id, opt)} style={{
                    textAlign: "left", padding: "13px 18px", borderRadius: 12,
                    border: `1px solid ${selected ? "#6366F1" : "rgba(255,255,255,0.08)"}`,
                    background: selected ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                    color: selected ? "#fff" : "#D1D5DB", fontSize: 14, cursor: "pointer",
                    transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                      border: `2px solid ${selected ? "#6366F1" : "#374151"}`,
                      background: selected ? "#6366F1" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: selected ? "#fff" : "#6B7280",
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {q.questionType === "true_false" && (
            <div style={{ display: "flex", gap: 12 }}>
              {["True", "False"].map(opt => {
                const selected = answersMap[q._id] === opt;
                return (
                  <button key={opt} onClick={() => handleAnswer(q._id, opt)} style={{
                    flex: 1, padding: "12px", borderRadius: 12,
                    border: `1px solid ${selected ? "#6366F1" : "rgba(255,255,255,0.08)"}`,
                    background: selected ? "rgba(99,102,241,0.15)" : "transparent",
                    color: selected ? "#fff" : "#9CA3AF", fontSize: 14, fontWeight: 500, cursor: "pointer",
                    transition: "all 0.15s",
                  }}>
                    {opt === "True" ? "✓ True" : "✗ False"}
                  </button>
                );
              })}
            </div>
          )}

          {(q.questionType === "short_answer" || q.questionType === "fill_blank") && (
            <input
              value={answersMap[q._id] || ""}
              onChange={e => handleAnswer(q._id, e.target.value)}
              placeholder={q.questionType === "fill_blank" ? "Fill in the blank..." : "Type your answer..."}
            />
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0} style={{
            padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            color: current === 0 ? "#374151" : "#9CA3AF", cursor: current === 0 ? "default" : "pointer",
          }}>
            ← Previous
          </button>

          {/* Page dots */}
          <div style={{ display: "flex", gap: 6 }}>
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{
                width: answersMap[questions[i]._id] ? 10 : 8,
                height: answersMap[questions[i]._id] ? 10 : 8,
                borderRadius: "50%", border: "none", cursor: "pointer",
                background: i === current ? "#6366F1" : answersMap[questions[i]._id] ? "#A855F7" : "#374151",
                transition: "all 0.2s",
              }} />
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent(p => p + 1)} style={{
              padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500,
              background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
              color: "#818CF8", cursor: "pointer",
            }}>
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} style={{
              padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
              border: "none", cursor: "pointer", opacity: submitting ? 0.7 : 1,
            }}>
              {submitting ? "Submitting..." : "Submit Quiz ✓"}
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TakeQuizPage;