import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";

const CreateChatPage = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState([]);
  const [formData, setFormData] = useState({ title: "", subject: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/chats/materials/processed")
      .then(r => setMaterials(r.data.data || []))
      .catch(e => setError(e.response?.data?.message || "Failed to load materials"))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) =>
    setSelectedMaterialIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSubmitting(true);
    try {
      const res = await api.post("/chats", {
        title: formData.title || "New Chat",
        subject: formData.subject,
        linkedMaterialIds: selectedMaterialIds,
      });
      navigate(`/chats/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create chat");
    } finally { setSubmitting(false); }
  };

  const label = { fontSize: 12, fontWeight: 500, color: "#9CA3AF", marginBottom: 6, display: "block" };

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>New AI Chat</h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Select materials to ground the AI responses</p>
          </div>
          <Link to="/chats" style={{ fontSize: 13, color: "#818CF8", textDecoration: "none" }}>← Back</Link>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22, marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label style={label}>Chat Title</label><input name="title" placeholder="e.g. OS Revision" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} /></div>
              <div><label style={label}>Subject</label><input name="subject" placeholder="e.g. Operating Systems" value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} /></div>
            </div>
          </div>

          <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 14 }}>
              Select Processed Materials
              <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 400, marginLeft: 8 }}>
                ({selectedMaterialIds.length} selected)
              </span>
            </div>
            {loading && <p style={{ color: "#6B7280", fontSize: 13 }}>Loading materials...</p>}
            {!loading && materials.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "#6B7280", fontSize: 13 }}>No processed materials. Upload material first.</p>
                <Link to="/materials/upload" style={{ color: "#818CF8", fontSize: 13, marginTop: 8, display: "block" }}>Upload material →</Link>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {materials.map(m => {
                const selected = selectedMaterialIds.includes(m._id);
                return (
                  <div key={m._id} onClick={() => toggle(m._id)} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12,
                    border: `1px solid ${selected ? "#6366F1" : "rgba(255,255,255,0.07)"}`,
                    background: selected ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      border: `2px solid ${selected ? "#6366F1" : "#374151"}`,
                      background: selected ? "#6366F1" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 12,
                    }}>
                      {selected ? "✓" : ""}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>{m.title}</div>
                      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                        {m.subject} · {m.topic} · {m.processingStatus}
                      </div>
                    </div>
                    <span style={{ fontSize: 20 }}>📄</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" disabled={submitting} style={{
            width: "100%", padding: 12, borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
            fontWeight: 600, fontSize: 14, opacity: submitting ? 0.7 : 1,
          }}>
            {submitting ? "Creating..." : "✦ Start Chat"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateChatPage;