import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateQuestionPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    questionText: "",
    questionType: "mcq",
    optionsText: "",
    correctAnswer: "",
    explanation: "",
    subject: "",
    chapter: "",
    topic: "",
    subtopic: "",
    difficulty: "easy",
    sourceType: "manual",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        options: formData.optionsText
          ? formData.optionsText.split("\n").map((item) => item.trim()).filter(Boolean)
          : [],
      };

      delete payload.optionsText;

      await api.post("/quizzes/questions", payload);

      setSuccess("Question created successfully");
      setTimeout(() => navigate("/quizzes"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", background: "#fff", padding: "24px", borderRadius: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h1>Create Question</h1>
          <Link to="/quizzes">Back to Quizzes</Link>
        </div>

        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "12px" }}>{success}</p>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <textarea
            name="questionText"
            placeholder="Question text"
            value={formData.questionText}
            onChange={handleChange}
            rows={4}
          />

          <select name="questionType" value={formData.questionType} onChange={handleChange}>
            <option value="mcq">MCQ</option>
            <option value="true_false">True / False</option>
            <option value="short_answer">Short Answer</option>
            <option value="fill_blank">Fill in the Blank</option>
          </select>

          <textarea
            name="optionsText"
            placeholder="Options (one per line)"
            value={formData.optionsText}
            onChange={handleChange}
            rows={4}
          />

          <input
            name="correctAnswer"
            placeholder="Correct answer"
            value={formData.correctAnswer}
            onChange={handleChange}
          />

          <textarea
            name="explanation"
            placeholder="Explanation"
            value={formData.explanation}
            onChange={handleChange}
            rows={3}
          />

          <input
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />

          <input
            name="chapter"
            placeholder="Chapter"
            value={formData.chapter}
            onChange={handleChange}
          />

          <input
            name="topic"
            placeholder="Topic"
            value={formData.topic}
            onChange={handleChange}
          />

          <input
            name="subtopic"
            placeholder="Subtopic"
            value={formData.subtopic}
            onChange={handleChange}
          />

          <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestionPage;