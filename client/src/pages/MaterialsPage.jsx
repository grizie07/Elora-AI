import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "18px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMaterials = async () => {
    try {
      const response = await api.get("/materials/me");
      setMaterials(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/materials/${id}`);
      setMaterials((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete material");
    }
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading materials...</div>;
  }

  if (error) {
    return <div style={{ padding: "24px", color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h1>My Study Materials</h1>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/materials/upload">Upload Material</Link>
            <Link to="/student">Back to Dashboard</Link>
          </div>
        </div>

        {!materials.length ? (
          <div style={cardStyle}>
            <p>No materials uploaded yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {materials.map((item) => (
              <div key={item._id} style={cardStyle}>
                <h2>{item.title}</h2>
                <p style={{ marginTop: "8px" }}>File: {item.originalFileName}</p>
                <p>Subject: {item.subject || "N/A"}</p>
                <p>Topic: {item.topic || "N/A"}</p>
                <p>Status: {item.processingStatus}</p>

                <button
                  onClick={() => handleDelete(item._id)}
                  style={{ marginTop: "12px" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;