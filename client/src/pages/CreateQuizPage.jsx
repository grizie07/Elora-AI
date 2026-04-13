import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateQuizPage = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    topicsCoveredText: "",
    difficulty: "mixed",
    sourceType: "topic_based",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get("/quizzes/questions/me");
        setQuestions(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load questions");
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (questionId) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoadingSubmit(true);

    try {
      const payload = {
        ...formData,
        topicsCovered: formData.topicsCoveredText
          ? formData.topicsCoveredText
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        questionIds: selectedQuestionIds,
      };

      delete payload.topicsCoveredText;

      await api.post("/quizzes", payload);

      setSuccess("Quiz created successfully");
      setTimeout(() => navigate("/quizzes"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1>Create Quiz</h1>
          <Link to="/quizzes">Back to Quizzes</Link>
        </div>

        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", marginBottom: "12px" }}>{success}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <input
            name="title"
            placeholder="Quiz title"
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
            name="topicsCoveredText"
            placeholder="Topics covered (comma separated)"
            value={formData.topicsCoveredText}
            onChange={handleChange}
          />

          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="mixed">Mixed</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            name="sourceType"
            value={formData.sourceType}
            onChange={handleChange}
          >
            <option value="topic_based">Topic Based</option>
            <option value="material_based">Material Based</option>
            <option value="weakness_based">Weakness Based</option>
            <option value="mixed">Mixed</option>
          </select>

          <div style={{ marginTop: "12px" }}>
            <h3>Select Questions</h3>

            {loadingQuestions ? (
              <p>Loading questions...</p>
            ) : !questions.length ? (
              <p>No questions available. Create questions first.</p>
            ) : (
              <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
                {questions.map((question) => (
                  <label
                    key={question._id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "12px",
                      display: "block",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestionIds.includes(question._id)}
                      onChange={() => handleCheckboxChange(question._id)}
                      style={{ marginRight: "10px" }}
                    />
                    <strong>{question.questionText}</strong>
                    <div style={{ marginTop: "6px", fontSize: "14px" }}>
                      {question.subject} | {question.topic} | {question.difficulty}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loadingSubmit}>
            {loadingSubmit ? "Creating..." : "Create Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizPage;