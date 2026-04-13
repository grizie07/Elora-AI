import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const UploadMaterialPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    chapter: "",
    topic: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("title", formData.title);
      payload.append("subject", formData.subject);
      payload.append("chapter", formData.chapter);
      payload.append("topic", formData.topic);
      payload.append("description", formData.description);

      await api.post("/materials", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Material uploaded successfully");
      setTimeout(() => navigate("/materials"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", background: "#fff", padding: "24px", borderRadius: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h1>Upload Study Material</h1>
          <Link to="/materials">Back to Materials</Link>
        </div>

        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "12px" }}>{success}</p>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />

          <input
            name="chapter"
            placeholder="Chapter"
            value={formData.chapter}
            onChange={handleChange}
          />

          <input
            name="topic"
            placeholder="Topic"
            value={formData.topic}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={handleFileChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Material"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterialPage;