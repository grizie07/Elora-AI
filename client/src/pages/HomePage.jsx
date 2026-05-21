import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "📚", title: "Smart RAG Chat", desc: "Ask questions answered directly from your uploaded notes — no hallucinations, fully grounded." },
  { icon: "🧠", title: "Quiz Engine", desc: "Auto-generated MCQs, True/False and short-answer quizzes per topic, with score tracking." },
  { icon: "📊", title: "Topic Mastery", desc: "Accuracy-based mastery levels — Weak, Moderate, Strong — updated after every attempt." },
  { icon: "🃏", title: "Flashcards", desc: "AI-generated flip cards from your material chunks for rapid revision with spaced repetition." },
  { icon: "📅", title: "Study Planner", desc: "Smart weekly schedule built around your real exam date and weakest topics first." },
  { icon: "🎯", title: "Recommendations", desc: "Personalised next-topic suggestions prioritised by your mastery gaps and exam proximity." },
];

const flow = [
  { icon: "⬆", title: "Upload Notes", desc: "PDF, DOCX or TXT. ELORA extracts text, splits it into chunks, and stores semantic embeddings." },
  { icon: "💬", title: "Chat & Quiz", desc: "Ask any question — answers are retrieved from your notes, not the internet. Take targeted quizzes." },
  { icon: "📈", title: "Track & Plan", desc: "See your mastery per topic, spot weak areas, and let ELORA generate your revision calendar." },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D1117",
      fontFamily: "'Inter', sans-serif",
      color: "#E5E7EB",
      overflowX: "hidden",
    }}>

      {/* NAV */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(13,17,23,0.9)",
        backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg,#6366F1,#A855F7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, color: "#fff",
          }}>✦</div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.3px", color: "#fff" }}>ELORA</span>
          <span style={{ fontSize: 11, color: "#4B5563", marginLeft: 4 }}>AI Learning System</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {isAuthenticated ? (
            <Link to="/student" style={{
              padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: "linear-gradient(135deg,#6366F1,#7C3AED)",
              color: "#fff", textDecoration: "none",
            }}>Go to Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" style={{
                padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                color: "#9CA3AF", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
              }}>Log in</Link>
              <Link to="/register" style={{
                padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "linear-gradient(135deg,#6366F1,#7C3AED)",
                color: "#fff", textDecoration: "none",
              }}>Get Started →</Link>
            </>
          )}
        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "88px 24px 72px", position: "relative" }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 380,
          background: "radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.16) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "5px 14px", borderRadius: 100, marginBottom: 24,
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.25)",
          fontSize: 12, color: "#818CF8", fontWeight: 500,
        }}>
          ✦ Semantic RAG · Vector Embeddings · Adaptive Learning
        </div>

        <h1 style={{
          fontSize: "clamp(34px,5.5vw,68px)", fontWeight: 800,
          letterSpacing: "-2px", lineHeight: 1.08,
          margin: "0 auto 20px", maxWidth: 760, color: "#fff",
        }}>
          Your notes.{" "}
          <span style={{ background: "linear-gradient(135deg,#818CF8,#A78BFA,#C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Your AI tutor.
          </span>
        </h1>

        <p style={{
          maxWidth: 520, margin: "0 auto 36px",
          fontSize: 16, color: "#6B7280", lineHeight: 1.7,
        }}>
          Upload lecture notes, chat with them, take adaptive quizzes, flip flashcards,
          and let ELORA plan your path to exam day — all grounded in your own material.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" style={{
            padding: "13px 30px", borderRadius: 12, fontSize: 14, fontWeight: 700,
            background: "linear-gradient(135deg,#6366F1,#7C3AED)",
            color: "#fff", textDecoration: "none",
            boxShadow: "0 0 28px rgba(99,102,241,0.3)",
          }}>Start for Free →</Link>
          <Link to="/login" style={{
            padding: "13px 30px", borderRadius: 12, fontSize: 14, fontWeight: 500,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            color: "#9CA3AF", textDecoration: "none",
          }}>I have an account</Link>
        </div>

        {/* App preview mockup */}
        <div style={{
          maxWidth: 820, margin: "56px auto 0",
          background: "#161B27", borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}>
          <div style={{
            background: "#0D1117", padding: "10px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {["#EF4444","#F59E0B","#10B981"].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
            <div style={{
              flex: 1, marginLeft: 8, background: "rgba(255,255,255,0.04)",
              borderRadius: 5, height: 20, display: "flex", alignItems: "center",
              paddingLeft: 10, fontSize: 11, color: "#4B5563",
            }}>localhost:5173/student — ELORA</div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{
              width: 140, background: "#111827", borderRight: "1px solid rgba(255,255,255,0.06)",
              padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4,
            }}>
              {["⌂ Dashboard","📚 Library","💬 AI Chat","📝 Quizzes","🃏 Flashcards","📅 Planner","📊 Analytics"].map((lbl, i) => (
                <div key={lbl} style={{
                  padding: "7px 10px", borderRadius: 8, fontSize: 11,
                  color: i === 0 ? "#fff" : "#6B7280",
                  background: i === 0 ? "linear-gradient(135deg,#6366F1,#7C3AED)" : "transparent",
                  fontWeight: i === 0 ? 600 : 400,
                }}>{lbl}</div>
              ))}
            </div>
            <div style={{ flex: 1, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Good morning 👋</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                {[["84%","Quiz Accuracy","#34D399"],["6","Materials","#818CF8"],["12 days","Until Exam","#F87171"]].map(([v,l,c]) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 8 }}>AI Chat · OS Notes</div>
                <div style={{ background: "rgba(99,102,241,0.15)", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: "#C7D2FE", marginBottom: 6, marginLeft: "auto", maxWidth: "75%" }}>
                  What is round-robin scheduling?
                </div>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>
                  <strong style={{ color: "#E5E7EB" }}>From your OS Notes:</strong><br />
                  Round-robin assigns a fixed time quantum to each process in circular order, ensuring fairness...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "72px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", color: "#fff", marginBottom: 10 }}>
            Everything you need to ace your exams
          </h2>
          <p style={{ fontSize: 14, color: "#6B7280" }}>
            ELORA combines RAG, vector search, and adaptive learning in one cohesive platform.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: "22px 20px",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 11, marginBottom: 14,
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "60px 24px", maxWidth: 820, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, letterSpacing: "-1px", color: "#fff", marginBottom: 44 }}>
          How ELORA works
        </h2>
        <div style={{ display: "flex", gap: 0, position: "relative" }}>
          {flow.map((step, i) => (
            <div key={step.title} style={{ flex: 1, textAlign: "center", padding: "0 20px", position: "relative" }}>
              {i < flow.length - 1 && (
                <div style={{
                  position: "absolute", top: 21, left: "62%", width: "76%", height: 1,
                  background: "linear-gradient(90deg, rgba(99,102,241,0.4), transparent)",
                }} />
              )}
              <div style={{
                width: 42, height: 42, borderRadius: "50%", margin: "0 auto 14px",
                background: "linear-gradient(135deg,#6366F1,#7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, color: "#fff",
              }}>{step.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 6 }}>{step.title}</div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "48px 24px 80px" }}>
        <div style={{
          maxWidth: 560, margin: "0 auto", textAlign: "center",
          background: "#161B27", border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 20, padding: "48px 36px",
          boxShadow: "0 0 60px rgba(99,102,241,0.1)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>🎓</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
            Ready to study smarter?
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, marginBottom: 24 }}>
            Join ELORA and turn your notes into an intelligent tutor — start for free, no credit card needed.
          </p>
          <Link to="/register" style={{
            display: "inline-block", padding: "12px 32px", borderRadius: 12,
            background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
            fontWeight: 700, fontSize: 14, textDecoration: "none",
            boxShadow: "0 0 24px rgba(99,102,241,0.35)",
          }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: "linear-gradient(135deg,#6366F1,#A855F7)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
          }}>✦</div>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>ELORA</span>
        </div>
        <span style={{ fontSize: 11, color: "#374151" }}>
          AI Learning System · Semantic RAG · v1.0.0
        </span>
      </footer>
    </div>
  );
};

export default HomePage;