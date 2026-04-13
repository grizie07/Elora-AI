import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateChatPage = () => {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
  });

  const [error, setError] = useState("");
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get("/chats/materials/processed");
        setMaterials(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load processed materials");
      } finally {
        setLoadingMaterials(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (materialId) => {
    setSelectedMaterialIds((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingSubmit(true);

    try {
      const response = await api.post("/chats", {
        title: formData.title || "New Chat",
        subject: formData.subject,
        linkedMaterialIds: selectedMaterialIds,
      });

      navigate(`/chats/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create chat");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", background: "#fff", padding: "24px", borderRadius: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h1>Create Chat</h1>
          <Link to="/chats">Back to Chats</Link>
        </div>

        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <input
            name="title"
            placeholder="Chat title"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />

          <div style={{ marginTop: "12px" }}>
            <h3>Select Processed Materials</h3>

            {loadingMaterials ? (
              <p>Loading materials...</p>
            ) : !materials.length ? (
              <p>No processed materials available. Upload and process material first.</p>
            ) : (
              <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
                {materials.map((material) => (
                  <label
                    key={material._id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "12px",
                      display: "block",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMaterialIds.includes(material._id)}
                      onChange={() => handleCheckboxChange(material._id)}
                      style={{ marginRight: "10px" }}
                    />
                    <strong>{material.title}</strong>
                    <div style={{ marginTop: "6px", fontSize: "14px" }}>
                      {material.subject} | {material.topic} | {material.processingStatus}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loadingSubmit}>
            {loadingSubmit ? "Creating..." : "Create Chat"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChatPage;