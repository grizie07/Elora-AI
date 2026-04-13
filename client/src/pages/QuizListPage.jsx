import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "18px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get("/quizzes/me");
        setQuizzes(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading quizzes...</div>;
  }

  if (error) {
    return <div style={{ padding: "24px", color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h1>My Quizzes</h1>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/questions/create">Create Question</Link>
            <Link to="/quizzes/create">Create Quiz</Link>
            <Link to="/student">Back to Dashboard</Link>
          </div>
        </div>

        {!quizzes.length ? (
          <div style={cardStyle}>
            <p>No quizzes created yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {quizzes.map((quiz) => (
              <div key={quiz._id} style={cardStyle}>
                <h2>{quiz.title}</h2>
                <p style={{ marginTop: "8px" }}>Subject: {quiz.subject || "N/A"}</p>
                <p>Difficulty: {quiz.difficulty}</p>
                <p>Total Questions: {quiz.totalQuestions}</p>
                <p>Source Type: {quiz.sourceType}</p>

                <div style={{ marginTop: "12px" }}>
                  <Link to={`/quizzes/${quiz._id}/take`}>Take Quiz</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListPage;