import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";

const ChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/chats/me")
      .then(r => setChats(r.data.data || []))
      .catch(e => setError(e.response?.data?.message || "Failed to load chats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>AI Chat</h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Ask questions from your uploaded study materials</p>
          </div>
          <Link to="/chats/create" style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12,
            background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
            fontWeight: 600, fontSize: 13, textDecoration: "none",
          }}>
            + New Chat
          </Link>
        </div>

        {/* AI intro card */}
        <div style={{
          background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.1))",
          border: "1px solid rgba(99,102,241,0.25)", borderRadius: 16,
          padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg,#6366F1,#A855F7)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
          }}>✦</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>AI Study Assistant</div>
            <div style={{ fontSize: 12, color: "#A78BFA", marginTop: 2 }}>Powered by retrieval-augmented AI</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6 }}>
              Create a new chat and link your uploaded materials to get instant, grounded answers.
            </div>
          </div>
        </div>

        {loading && <p style={{ color: "#6B7280", fontSize: 14 }}>Loading chats...</p>}
        {error && <p style={{ color: "#F87171", fontSize: 14 }}>{error}</p>}

        {!loading && !error && chats.length === 0 && (
          <div style={{
            background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: 40, textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <div style={{ fontWeight: 600, color: "#fff", fontSize: 15, marginBottom: 6 }}>No chats yet</div>
            <div style={{ color: "#6B7280", fontSize: 13, marginBottom: 20 }}>
              Start a conversation with your study materials
            </div>
            <Link to="/chats/create" style={{
              display: "inline-block", padding: "10px 22px", borderRadius: 10,
              background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff",
              fontWeight: 600, fontSize: 13, textDecoration: "none",
            }}>
              Start First Chat
            </Link>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {chats.map((chat) => (
            <Link key={chat._id} to={`/chats/${chat._id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "16px 20px",
                display: "flex", alignItems: "center", gap: 14,
                transition: "border-color 0.2s", cursor: "pointer",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.2))",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>💬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>{chat.title}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>
                    {chat.subject || "No subject"} · {chat.linkedMaterialIds?.length || 0} material{chat.linkedMaterialIds?.length !== 1 ? "s" : ""} linked
                  </div>
                </div>
                <span style={{ color: "#4B5563", fontSize: 16 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatsPage;