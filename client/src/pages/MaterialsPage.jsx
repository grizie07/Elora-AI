import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";
import Modal from "../components/ui/Modal";

const C = {
  card: { background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  badge: (s) => ({
    fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 6,
    background: s === "processed" ? "rgba(16,185,129,0.15)" : s === "failed" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
    color: s === "processed" ? "#34D399" : s === "failed" ? "#F87171" : "#FCD34D",
  }),
};

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modal, setModal] = useState({ isOpen: false, type: "info", icon: "", title: "", message: "", confirmLabel: "OK", cancelLabel: null, onConfirm: null });

  const showAlert = (type, icon, title, message) => {
    setModal({ isOpen: true, type, icon, title, message, confirmLabel: "OK", cancelLabel: null, onConfirm: () => setModal(m => ({ ...m, isOpen: false })) });
  };

  const showConfirm = (title, message, onConfirm) => {
    setModal({
      isOpen: true, type: "danger", icon: "🗑", title, message,
      confirmLabel: "Delete", cancelLabel: "Cancel",
      onConfirm: () => { setModal(m => ({ ...m, isOpen: false })); onConfirm(); },
    });
  };

  const closeModal = () => setModal(m => ({ ...m, isOpen: false }));

  useEffect(() => {
    api.get("/materials/me")
      .then(r => setMaterials(r.data.data || []))
      .catch(e => setError(e.response?.data?.message || "Failed to load materials"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    showConfirm("Delete Material", "This action cannot be undone. The file and all its AI embeddings will be permanently removed.", async () => {
      try {
        await api.delete(`/materials/${id}`);
        setMaterials(p => p.filter(m => m._id !== id));
      } catch (e) {
        showAlert("danger", "⚠", "Delete Failed", e.response?.data?.message || "Failed to delete material");
      }
    });
  };

  const handleReprocess = async (id) => {
    setMaterials(p => p.map(m => m._id === id ? { ...m, processingStatus: "pending" } : m));
    try {
      const res = await api.post(`/materials/${id}/reprocess`);
      const updated = res.data.data.material;
      setMaterials(p => p.map(m => m._id === id ? updated : m));
    } catch (e) {
      setMaterials(p => p.map(m => m._id === id ? { ...m, processingStatus: "failed" } : m));
      showAlert("warning", "⚠", "Reprocess Failed", e.response?.data?.message || "Could not reprocess material");
    }
  };


  return (
    <AppLayout>
      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        icon={modal.icon}
        title={modal.title}
        message={modal.message}
        confirmLabel={modal.confirmLabel}
        cancelLabel={modal.cancelLabel}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />
      <div style={{ padding: 28, maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Your Library</h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
              {materials.length} document{materials.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>
          <Link to="/materials/upload" style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12,
            background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
            fontWeight: 600, fontSize: 13, textDecoration: "none",
          }}>
            ⬆ Upload New
          </Link>
        </div>

        {/* Upload Drop Zone */}
        <div style={{
          ...C.card, border: "2px dashed rgba(99,102,241,0.3)",
          background: "rgba(99,102,241,0.04)", textAlign: "center",
          padding: "40px 20px", marginBottom: 24, cursor: "pointer",
        }} onClick={() => window.location.href = "/materials/upload"}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "rgba(99,102,241,0.15)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 26, margin: "0 auto 14px",
          }}>⬆</div>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#fff", marginBottom: 6 }}>Drop files to upload</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>or click to browse (PDF, DOCX, TXT supported)</div>
          <Link to="/materials/upload" style={{
            display: "inline-block", padding: "9px 22px", borderRadius: 10,
            background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
            fontWeight: 600, fontSize: 13, textDecoration: "none",
          }}>
            Choose Files
          </Link>
        </div>

        {loading && <p style={{ color: "#6B7280", fontSize: 14 }}>Loading materials...</p>}
        {error && <p style={{ color: "#F87171", fontSize: 14 }}>{error}</p>}

        {/* Grid */}
        {!loading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {materials.map((m) => (
              <div key={m._id} style={C.card}>
                <div style={{
                  width: "100%", height: 100, borderRadius: 10, marginBottom: 14,
                  background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.2))",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
                }}>
                  {m.fileType?.includes("pdf") ? "📄" : m.fileType?.includes("word") ? "📘" : "📃"}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#fff", marginBottom: 6 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{m.originalFileName}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>
                  {m.subject && `${m.subject} · `}{m.topic || ""}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={C.badge(m.processingStatus)}>{m.processingStatus}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {m.processingStatus === "failed" && (
                      <button onClick={() => handleReprocess(m._id)} style={{
                        padding: "5px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                        background: "rgba(99,102,241,0.15)", color: "#818CF8",
                        border: "1px solid rgba(99,102,241,0.3)", cursor: "pointer",
                      }}>↺ Retry</button>
                    )}
                    <button onClick={() => handleDelete(m._id)} style={{
                      padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                      background: "rgba(239,68,68,0.1)", color: "#F87171",
                      border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer",
                    }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && materials.length === 0 && (
          <div style={{ ...C.card, textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <div style={{ color: "#9CA3AF", fontSize: 14 }}>No materials uploaded yet.</div>
            <div style={{ color: "#6B7280", fontSize: 13, marginTop: 6 }}>Upload a PDF, DOCX, or TXT to get started.</div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MaterialsPage;