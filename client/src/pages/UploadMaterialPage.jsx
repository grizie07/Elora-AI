import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";

const UploadMaterialPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", subject: "", chapter: "", topic: "", description: "" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select a file"); return; }
    setError(""); setSuccess(""); setLoading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      await api.post("/materials", payload, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess("Material uploaded and processing started!");
      setTimeout(() => navigate("/materials"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally { setLoading(false); }
  };

  const label = { fontSize: 12, fontWeight: 500, color: "#9CA3AF", marginBottom: 6, display: "block" };
  const group = { marginBottom: 16 };

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Upload Study Material</h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Add PDFs, DOCX, or TXT notes for AI to analyze</p>
          </div>
          <Link to="/materials" style={{ fontSize: 13, color: "#818CF8", textDecoration: "none" }}>← Back to Library</Link>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13, marginBottom: 16 }}>{error}</div>}
        {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "10px 14px", color: "#34D399", fontSize: 13, marginBottom: 16 }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
            style={{
              background: dragOver ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.04)",
              border: `2px dashed ${dragOver ? "#6366F1" : "rgba(99,102,241,0.3)"}`,
              borderRadius: 14, padding: "36px 20px", textAlign: "center",
              cursor: "pointer", marginBottom: 20, transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>{file ? "📄" : "⬆"}</div>
            <div style={{ fontWeight: 600, color: "#fff", fontSize: 14, marginBottom: 4 }}>
              {file ? file.name : "Drag & drop your file here"}
            </div>
            <div style={{ color: "#6B7280", fontSize: 12 }}>
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse · PDF, DOCX, TXT (max 10MB)"}
            </div>
            <input id="fileInput" type="file" accept=".pdf,.txt,.docx" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
          </div>

          <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><label style={label}>Title *</label><input name="title" placeholder="e.g. OS Notes Chapter 3" value={formData.title} onChange={handleChange} required /></div>
              <div><label style={label}>Subject</label><input name="subject" placeholder="e.g. Operating Systems" value={formData.subject} onChange={handleChange} /></div>
              <div><label style={label}>Chapter</label><input name="chapter" placeholder="e.g. Chapter 3" value={formData.chapter} onChange={handleChange} /></div>
              <div><label style={label}>Topic</label><input name="topic" placeholder="e.g. Process Scheduling" value={formData.topic} onChange={handleChange} /></div>
            </div>
            <div style={group}>
              <label style={label}>Description</label>
              <textarea name="description" placeholder="Brief description of this material..." rows={3} value={formData.description} onChange={handleChange} style={{ resize: "vertical" }} />
            </div>
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: 12, borderRadius: 12, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
              fontWeight: 600, fontSize: 14, opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Uploading & Processing..." : "⬆ Upload Material"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default UploadMaterialPage;