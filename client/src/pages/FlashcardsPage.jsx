import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";
import Modal from "../components/ui/Modal";

const diffColor = { easy: "#34D399", medium: "#FCD34D", hard: "#F87171" };
const statusColor = { new: "#6366F1", learning: "#F59E0B", known: "#10B981" };
const statusLabel = { new: "New", learning: "Still Learning", known: "Known ✓" };

const FlashcardsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matLoading, setMatLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "" });

  const closeModal = () => setModal(m => ({ ...m, isOpen: false }));

  useEffect(() => {
    api.get("/materials/me")
      .then(r => setMaterials((r.data.data || []).filter(m => m.processingStatus === "processed")))
      .catch(() => setError("Failed to load materials"))
      .finally(() => setMatLoading(false));
  }, []);

  const handleGenerate = async (mat) => {
    setSelectedMaterial(mat);
    setLoading(true);
    setError("");
    setCards([]);
    setCurrentIdx(0);
    setFlipped(false);
    try {
      const res = await api.post("/flashcards/generate", { materialId: mat._id });
      setCards(res.data.data || []);
    } catch (e) {
      setModal({ isOpen: true, title: "Generation Failed", message: e.response?.data?.message || "Could not generate flashcards" });
    } finally { setLoading(false); }
  };

  const handleStatus = async (status) => {
    const card = cards[currentIdx];
    try {
      await api.patch(`/flashcards/${card._id}/status`, { status });
      setCards(p => p.map((c, i) => i === currentIdx ? { ...c, reviewStatus: status } : c));
    } catch { /* silent */ }
    if (currentIdx < cards.length - 1) {
      setCurrentIdx(p => p + 1);
      setFlipped(false);
    }
  };

  const known = cards.filter(c => c.reviewStatus === "known").length;
  const progress = cards.length ? Math.round((known / cards.length) * 100) : 0;

  const card = cards[currentIdx];

  return (
    <AppLayout>
      <Modal isOpen={modal.isOpen} type="warning" icon="⚠" title={modal.title} message={modal.message} confirmLabel="OK" onConfirm={closeModal} onCancel={closeModal} />
      <div style={{ padding: 28, maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>🃏 Flashcards</h1>
          <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>AI-generated flip cards from your study materials</p>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {/* Material selector */}
        {!selectedMaterial || cards.length === 0 ? (
          <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 14 }}>
              {loading ? "Generating flashcards..." : "Choose a material to study"}
            </div>
            {matLoading && <p style={{ color: "#6B7280", fontSize: 13 }}>Loading materials...</p>}
            {!matLoading && materials.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p style={{ color: "#6B7280", fontSize: 13 }}>No processed materials yet.</p>
                <Link to="/materials" style={{ color: "#818CF8", fontSize: 13 }}>Upload and process materials →</Link>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {materials.map(m => (
                <button key={m._id} onClick={() => handleGenerate(m)} disabled={loading} style={{
                  textAlign: "left", padding: 16, borderRadius: 12, cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: selectedMaterial?._id === m._id ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                  transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>📄</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>{m.subject} · {m.topic}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => { setSelectedMaterial(null); setCards([]); }} style={{ background: "none", border: "none", color: "#818CF8", cursor: "pointer", fontSize: 13 }}>← Back</button>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#6B7280" }}>
                  <span>Card {currentIdx + 1} of {cards.length}</span>
                  <span>{known} known · {progress}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
                  <div style={{ width: `${progress}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#6366F1,#10B981)", transition: "width 0.3s" }} />
                </div>
              </div>
            </div>

            {/* Flip Card */}
            <div
              onClick={() => setFlipped(p => !p)}
              style={{
                perspective: 1200, cursor: "pointer", marginBottom: 18,
                height: 280, userSelect: "none",
              }}
            >
              <div style={{
                position: "relative", width: "100%", height: "100%",
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
              }}>
                {/* Front */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "#161B27", border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: 20, backfaceVisibility: "hidden",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: 32, textAlign: "center",
                }}>
                  <div style={{ fontSize: 11, color: "#818CF8", fontWeight: 600, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>Question</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#fff", lineHeight: 1.5 }}>{card?.question}</div>
                  <div style={{ marginTop: 20, fontSize: 12, color: "#4B5563" }}>Tap to reveal answer</div>
                </div>
                {/* Back */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.08))",
                  border: "1px solid rgba(99,102,241,0.4)",
                  borderRadius: 20, backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: 32, textAlign: "center",
                }}>
                  <div style={{ fontSize: 11, color: "#A78BFA", fontWeight: 600, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>Answer</div>
                  <div style={{ fontSize: 15, color: "#E5E7EB", lineHeight: 1.7 }}>{card?.answer}</div>
                  <div style={{
                    marginTop: 16, fontSize: 11, padding: "3px 10px", borderRadius: 6,
                    background: `${diffColor[card?.difficulty] || "#6B7280"}22`,
                    color: diffColor[card?.difficulty] || "#6B7280",
                  }}>{card?.difficulty}</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {flipped && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { label: "Still Learning", status: "learning", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
                  { label: "Skip", status: "new", color: "#6B7280", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)" },
                  { label: "Known ✓", status: "known", color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
                ].map(btn => (
                  <button key={btn.status} onClick={() => handleStatus(btn.status)} style={{
                    padding: "12px", borderRadius: 12, cursor: "pointer",
                    background: btn.bg, border: `1px solid ${btn.border}`,
                    color: btn.color, fontWeight: 600, fontSize: 13,
                  }}>{btn.label}</button>
                ))}
              </div>
            )}
            {!flipped && (
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => { setCurrentIdx(p => Math.max(0, p - 1)); setFlipped(false); }} disabled={currentIdx === 0} style={{ padding: "10px 20px", borderRadius: 10, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF", fontSize: 13 }}>← Prev</button>
                <button onClick={() => { setCurrentIdx(p => Math.min(cards.length - 1, p + 1)); setFlipped(false); }} disabled={currentIdx === cards.length - 1} style={{ padding: "10px 20px", borderRadius: 10, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF", fontSize: 13 }}>Next →</button>
              </div>
            )}

            {/* Status summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 18 }}>
              {Object.entries(statusColor).map(([s, c]) => (
                <div key={s} style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{cards.filter(x => x.reviewStatus === s).length}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>{statusLabel[s]}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default FlashcardsPage;
