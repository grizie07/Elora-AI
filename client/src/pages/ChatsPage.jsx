import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "18px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const ChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get("/chats/me");
        setChats(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading chats...</div>;
  }

  if (error) {
    return <div style={{ padding: "24px", color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1>My Chats</h1>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/chats/create">New Chat</Link>
            <Link to="/student">Back to Dashboard</Link>
          </div>
        </div>

        {!chats.length ? (
          <div style={cardStyle}>
            <p>No chats created yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {chats.map((chat) => (
              <div key={chat._id} style={cardStyle}>
                <h2>{chat.title}</h2>
                <p style={{ marginTop: "8px" }}>
                  Subject: {chat.subject || "N/A"}
                </p>
                <p>Linked Materials: {chat.linkedMaterialIds?.length || 0}</p>
                <div style={{ marginTop: "12px" }}>
                  <Link to={`/chats/${chat._id}`}>Open Chat</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;