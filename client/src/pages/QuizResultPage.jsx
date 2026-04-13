import { Link, useLocation, Navigate } from "react-router-dom";

const sectionStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "18px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const QuizResultPage = () => {
  const location = useLocation();
  const state = location.state;

  if (!state?.result || !state?.quiz) {
    return <Navigate to="/quizzes" replace />;
  }

  const { result, quiz } = state;
  const attempt = result.attempt;

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "20px" }}>
        <div style={sectionStyle}>
          <h1>Quiz Result</h1>
          <p style={{ marginTop: "10px" }}>
            <strong>{quiz.title}</strong>
          </p>
          <p>Score: {attempt.score} / {attempt.totalQuestions}</p>
          <p>Accuracy: {attempt.accuracy.toFixed(2)}%</p>
          <p>Total Time: {attempt.totalTimeSeconds} seconds</p>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <Link to="/quizzes">Back to Quizzes</Link>
            <Link to="/student">Go to Dashboard</Link>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2>Weak Topics Detected</h2>
          {result.weakTopicsDetected?.length ? (
            result.weakTopicsDetected.map((topic, idx) => (
              <p key={idx} style={{ marginTop: "10px" }}>
                - {topic}
              </p>
            ))
          ) : (
            <p style={{ marginTop: "10px" }}>No weak topics detected.</p>
          )}
        </div>

        <div style={sectionStyle}>
          <h2>Strong Topics Detected</h2>
          {result.strongTopicsDetected?.length ? (
            result.strongTopicsDetected.map((topic, idx) => (
              <p key={idx} style={{ marginTop: "10px" }}>
                - {topic}
              </p>
            ))
          ) : (
            <p style={{ marginTop: "10px" }}>No strong topics detected.</p>
          )}
        </div>

        <div style={sectionStyle}>
          <h2>Recommendations</h2>
          {result.recommendations?.length ? (
            result.recommendations.map((item) => (
              <div key={item._id} style={{ marginTop: "12px", paddingBottom: "10px", borderBottom: "1px solid #eee" }}>
                <p><strong>{item.title}</strong></p>
                <p>{item.message}</p>
                <p>Priority: {item.priority}</p>
              </div>
            ))
          ) : (
            <p style={{ marginTop: "10px" }}>No recommendations generated.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;