import { useEffect, useState } from "react";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const priorityColor = { high: "#F87171", medium: "#FCD34D", low: "#34D399" };

const PlannerPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/planner/me")
      .then(r => setPlan(r.data.data))
      .catch(e => setError(e.response?.data?.message || "Failed to load plan"))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true); setError("");
    try {
      const res = await api.post("/planner/generate");
      setPlan(res.data.data);
    } catch (e) { setError(e.response?.data?.message || "Failed to generate plan"); }
    finally { setGenerating(false); }
  };

  const handleToggle = async (sessionId) => {
    try {
      const res = await api.patch(`/planner/${sessionId}/complete`);
      setPlan(res.data.data);
    } catch { /* silent */ }
  };

  const daysLeft = plan?.daysUntilExam;
  const completed = plan?.weeklyPlan?.filter(s => s.completed).length || 0;
  const total = plan?.weeklyPlan?.length || 0;

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>📅 Study Planner</h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>AI-generated weekly schedule based on your weak topics and exam date</p>
          </div>
          <button onClick={handleGenerate} disabled={generating} style={{
            padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
            cursor: "pointer", border: "none",
            background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
            opacity: generating ? 0.7 : 1,
          }}>
            {generating ? "Generating..." : plan ? "↺ Regenerate" : "✦ Generate Plan"}
          </button>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {loading && <p style={{ color: "#6B7280" }}>Loading...</p>}

        {/* Summary cards */}
        {plan && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
              <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#F87171" }}>{daysLeft}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Days until exam</div>
              </div>
              <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#34D399" }}>{completed}/{total}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Sessions completed</div>
              </div>
              <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#818CF8" }}>{plan.weeklyPlan?.reduce((a, s) => a + s.durationMinutes, 0)} min</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Total study time</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 18px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: "#6B7280" }}>
                <span>Weekly Progress</span>
                <span>{total ? Math.round((completed / total) * 100) : 0}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ width: `${total ? (completed / total) * 100 : 0}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#6366F1,#10B981)", transition: "width 0.3s" }} />
              </div>
            </div>

            {/* Weekly grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.weeklyPlan?.map((session, i) => (
                <div key={session._id || i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "#161B27", border: `1px solid ${session.completed ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 14, padding: "14px 18px",
                  opacity: session.completed ? 0.75 : 1, transition: "all 0.2s",
                }}>
                  {/* Day pill */}
                  <div style={{
                    width: 80, flexShrink: 0, textAlign: "center",
                    background: "rgba(99,102,241,0.1)", borderRadius: 8,
                    padding: "6px 0",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#818CF8" }}>{session.day}</div>
                    {session.date && <div style={{ fontSize: 10, color: "#4B5563" }}>{session.date.slice(5)}</div>}
                  </div>

                  {/* Priority dot */}
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                    background: priorityColor[session.priority] || "#6B7280",
                  }} />

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: session.completed ? "#6B7280" : "#fff", textDecoration: session.completed ? "line-through" : "none" }}>
                      {session.topic}
                    </div>
                    <div style={{ fontSize: 12, color: "#4B5563", marginTop: 2 }}>
                      {session.subject && `${session.subject} · `}{session.durationMinutes} min · {session.priority} priority
                    </div>
                  </div>

                  {/* Toggle */}
                  <button onClick={() => handleToggle(session._id)} style={{
                    width: 30, height: 30, borderRadius: "50%", cursor: "pointer",
                    border: `2px solid ${session.completed ? "#10B981" : "rgba(255,255,255,0.15)"}`,
                    background: session.completed ? "#10B981" : "transparent",
                    color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {session.completed ? "✓" : ""}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && !plan && !error && (
          <div style={{
            background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "48px 24px", textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
            <div style={{ fontWeight: 600, fontSize: 16, color: "#fff", marginBottom: 8 }}>No plan yet</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>
              Generate your first AI study plan based on your weak topics and exam date.
            </div>
            <button onClick={handleGenerate} disabled={generating} style={{
              padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600,
              background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
              border: "none", cursor: "pointer",
            }}>
              ✦ Generate My Plan
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PlannerPage;
