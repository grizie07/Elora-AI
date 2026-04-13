import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const ChatPage = () => {
  const { id } = useParams();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chats/${id}/messages`);
      setChat(response.data.data.chat);
      setMessages(response.data.data.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  const handleSend = async () => {
    if (!content.trim()) return;

    setSending(true);
    setError("");

    try {
      const response = await api.post(`/chats/${id}/messages`, {
        content: content.trim(),
      });

      setMessages((prev) => [
        ...prev,
        response.data.data.userMessage,
        response.data.data.assistantMessage,
      ]);
      setContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading chat...</div>;
  }

  if (error && !chat) {
    return <div style={{ padding: "24px", color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gap: "16px",
        }}
      >
        <div style={{ background: "#fff", borderRadius: "12px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h1>{chat?.title || "Chat"}</h1>
              <p style={{ marginTop: "8px" }}>
                Subject: {chat?.subject || "N/A"}
              </p>
            </div>
            <Link to="/chats">Back to Chats</Link>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "18px",
            minHeight: "450px",
            display: "grid",
            gap: "14px",
          }}
        >
          {!messages.length ? (
            <p>No messages yet. Ask your first question.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  background:
                    message.sender === "user" ? "#e8f1ff" : "#f3f3f3",
                }}
              >
                <p>
                  <strong>
                    {message.sender === "user" ? "You" : "Assistant"}:
                  </strong>
                </p>
                <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>
                  {message.content}
                </p>

                {message.sender === "assistant" &&
                  message.citedChunks?.length > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      <strong>Citations:</strong>
                      {message.citedChunks.map((citation, idx) => (
                        <div
                          key={idx}
                          style={{ marginTop: "8px", fontSize: "14px" }}
                        >
                          <p>Chunk: {citation.chunkId}</p>
                          <p>{citation.excerpt}</p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))
          )}
        </div>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <div style={{ background: "#fff", borderRadius: "12px", padding: "18px" }}>
          <textarea
            rows={4}
            placeholder="Ask a question from your uploaded materials..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", marginBottom: "12px" }}
          />
          <button onClick={handleSend} disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;