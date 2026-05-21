import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";

const ChatPage = () => {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chats/${id}/messages`);
        setChat(res.data.data.chat);
        setMessages((res.data.data.messages || []).map(m => ({ ...m, role: m.role || m.sender })));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load chat");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const query = input.trim();
    setInput("");
    setSending(true);
    setError("");
    try {
      const res = await api.post(`/chats/${id}/messages`, { content: query });
      const { userMessage, assistantMessage } = res.data.data;
      const newMsgs = [];
      if (userMessage) newMsgs.push({ ...userMessage, role: userMessage.sender });
      if (assistantMessage) newMsgs.push({ ...assistantMessage, role: assistantMessage.sender });
      setMessages((prev) => [...prev, ...newMsgs]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const quickActions = [
    "Summarize my recent uploads",
    "Explain this concept",
    "Generate practice questions",
  ];

  return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 57px)" }}>
        {/* Chat Header */}
        <div style={{
          padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#0D1117", display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg,#6366F1,#A855F7)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>
              {chat?.title || "AI Study Assistant"}
            </div>
            <div style={{ fontSize: 12, color: "#A78BFA" }}>Powered by retrieval-augmented AI</div>
          </div>
          <Link to="/chats" style={{ fontSize: 12, color: "#6B7280", textDecoration: "none" }}>← All chats</Link>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {loading && <p style={{ color: "#6B7280", fontSize: 14 }}>Loading messages...</p>}
          {error && <p style={{ color: "#F87171", fontSize: 14 }}>{error}</p>}

          {!loading && messages.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 18, margin: "0 auto 16px",
                background: "linear-gradient(135deg,#6366F1,#A855F7)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              }}>✦</div>
              <div style={{
                background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "18px 22px", maxWidth: 480, margin: "0 auto 20px", textAlign: "left",
              }}>
                <p style={{ color: "#E5E7EB", fontSize: 14, lineHeight: 1.7 }}>
                  Hi! I&apos;m your AI learning assistant. I&apos;ve analyzed your linked materials and I&apos;m ready to help you study.
                  Ask me anything about your courses, request summaries, or get explanations!
                </p>
                <p style={{ fontSize: 11, color: "#4B5563", marginTop: 8 }}>
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div style={{ color: "#6B7280", fontSize: 13, marginBottom: 12 }}>Quick actions:</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {quickActions.map((q) => (
                  <button key={q} onClick={() => setInput(q)} style={{
                    padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 500,
                    background: "#161B27", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#9CA3AF", cursor: "pointer",
                  }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={msg._id || index} style={{
              display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0, marginRight: 10, marginTop: 4,
                  background: "linear-gradient(135deg,#6366F1,#A855F7)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>✦</div>
              )}
              <div style={{
                maxWidth: "68%",
                background: msg.role === "user"
                  ? "linear-gradient(135deg,#6366F1,#7C3AED)"
                  : "#161B27",
                border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
                padding: "12px 16px",
              }}>
                <p style={{ color: "#E5E7EB", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </p>
                <p style={{ fontSize: 10, color: msg.role === "user" ? "rgba(255,255,255,0.5)" : "#4B5563", marginTop: 6 }}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </p>
              </div>
            </div>
          ))}

          {sending && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366F1,#A855F7)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
              }}>✦</div>
              <div style={{
                background: "#161B27", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "4px 14px 14px 14px", padding: "12px 16px",
                color: "#6B7280", fontSize: 14,
              }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "#0D1117",
        }}>
          <form onSubmit={handleSend} style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your study materials..."
              style={{
                flex: 1, background: "#161B27", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14,
              }}
            />
            <button type="submit" disabled={sending || !input.trim()} style={{
              width: 44, height: 44, borderRadius: 12, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#6366F1,#7C3AED)",
              color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
              opacity: sending || !input.trim() ? 0.5 : 1,
            }}>
              →
            </button>
          </form>
          <p style={{ fontSize: 11, color: "#374151", textAlign: "center", marginTop: 8 }}>
            AI responses are generated from your uploaded study materials
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;