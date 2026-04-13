import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "18px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const StudentHomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard/student");
        setDashboard(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchDashboard();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading student dashboard...</div>;
  }

  if (error) {
    return <div style={{ padding: "24px", color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h1>Student Dashboard</h1>
          <p style={{ marginTop: "10px" }}>Welcome, {dashboard?.user?.name}</p>
          <p style={{ marginTop: "6px" }}>
            {dashboard?.user?.course || "Course not set"} |{" "}
            {dashboard?.user?.year || "Year not set"}
          </p>
          <p style={{ marginTop: "6px" }}>
            Goal: {dashboard?.user?.studyGoals || "No study goal added"}
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "14px",
              flexWrap: "wrap",
            }}
          >
            <Link to="/quizzes">My Quizzes</Link>
            <Link to="/questions/create">Create Question</Link>
            <Link to="/quizzes/create">Create Quiz</Link>
            <Link to="/materials">My Materials</Link>
            <Link to="/materials/upload">Upload Material</Link>
            <Link to="/profile">My Profile</Link>
            <Link to="/chats">My Chats</Link>
            <Link to="/chats/create">New Chat</Link>
          </div>

          <button onClick={handleLogout} style={{ marginTop: "14px" }}>
            Logout
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <div style={cardStyle}>
            <h3>Total Quiz Attempts</h3>
            <p
              style={{
                marginTop: "10px",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {dashboard?.summary?.totalQuizAttempts || 0}
            </p>
          </div>

          <div style={cardStyle}>
            <h3>Average Accuracy</h3>
            <p
              style={{
                marginTop: "10px",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {dashboard?.summary?.averageAccuracy || 0}%
            </p>
          </div>

          <div style={cardStyle}>
            <h3>Weak Topics</h3>
            <p
              style={{
                marginTop: "10px",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {dashboard?.summary?.weakTopicsCount || 0}
            </p>
          </div>

          <div style={cardStyle}>
            <h3>Strong Topics</h3>
            <p
              style={{
                marginTop: "10px",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {dashboard?.summary?.strongTopicsCount || 0}
            </p>
          </div>

          <div style={cardStyle}>
            <h3>Pending Recommendations</h3>
            <p
              style={{
                marginTop: "10px",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {dashboard?.summary?.pendingRecommendationsCount || 0}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          <div style={cardStyle}>
            <h2>Weak Topics</h2>
            {dashboard?.weakTopics?.length ? (
              dashboard.weakTopics.map((item) => (
                <div
                  key={item._id}
                  style={{
                    marginTop: "12px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <p>
                    <strong>{item.topic}</strong>
                  </p>
                  <p>Subject: {item.subject}</p>
                  <p>Accuracy: {item.accuracy?.toFixed(2)}%</p>
                  <p>Status: {item.status}</p>
                </div>
              ))
            ) : (
              <p style={{ marginTop: "10px" }}>No weak topics yet.</p>
            )}
          </div>

          <div style={cardStyle}>
            <h2>Strong Topics</h2>
            {dashboard?.strongTopics?.length ? (
              dashboard.strongTopics.map((item) => (
                <div
                  key={item._id}
                  style={{
                    marginTop: "12px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <p>
                    <strong>{item.topic}</strong>
                  </p>
                  <p>Subject: {item.subject}</p>
                  <p>Accuracy: {item.accuracy?.toFixed(2)}%</p>
                  <p>Status: {item.status}</p>
                </div>
              ))
            ) : (
              <p style={{ marginTop: "10px" }}>No strong topics yet.</p>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          <div style={cardStyle}>
            <h2>Recommendations</h2>
            {dashboard?.recommendations?.length ? (
              dashboard.recommendations.map((item) => (
                <div
                  key={item._id}
                  style={{
                    marginTop: "12px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <p>
                    <strong>{item.title}</strong>
                  </p>
                  <p>{item.message}</p>
                  <p>Priority: {item.priority}</p>
                </div>
              ))
            ) : (
              <p style={{ marginTop: "10px" }}>No recommendations yet.</p>
            )}
          </div>

          <div style={cardStyle}>
            <h2>Recent Quiz Attempts</h2>
            {dashboard?.recentAttempts?.length ? (
              dashboard.recentAttempts.map((item) => (
                <div
                  key={item._id}
                  style={{
                    marginTop: "12px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <p>
                    <strong>{item.quizId?.title || "Untitled Quiz"}</strong>
                  </p>
                  <p>Subject: {item.quizId?.subject || "N/A"}</p>
                  <p>
                    Score: {item.score}/{item.totalQuestions}
                  </p>
                  <p>Accuracy: {item.accuracy?.toFixed(2)}%</p>
                </div>
              ))
            ) : (
              <p style={{ marginTop: "10px" }}>No quiz attempts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;