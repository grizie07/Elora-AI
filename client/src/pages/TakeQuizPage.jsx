import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const TakeQuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answersMap, setAnswersMap] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        setQuiz(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const totalQuestions = useMemo(() => quiz?.questionIds?.length || 0, [quiz]);

  const handleAnswerChange = (questionId, value) => {
    setAnswersMap((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz?.questionIds?.length) return;

    setSubmitting(true);
    setError("");

    try {
      const totalTimeSeconds = Math.floor((Date.now() - startTime) / 1000);

      const answers = quiz.questionIds.map((question) => {
        const selectedAnswer = answersMap[question._id] || "";
        const isCorrect = selectedAnswer === question.correctAnswer;

        return {
          questionId: question._id,
          selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          subject: question.subject,
          chapter: question.chapter || "",
          topic: question.topic,
          subtopic: question.subtopic || "",
          difficulty: question.difficulty,
          timeTakenSeconds: 0,
        };
      });

      const response = await api.post("/quizzes/attempts", {
        quizId: quiz._id,
        totalTimeSeconds,
        answers,
      });

      navigate("/quizzes/result", {
        state: {
          result: response.data.data,
          quiz,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading quiz...</div>;
  }

  if (error) {
    return <div style={{ padding: "24px", color: "red" }}>{error}</div>;
  }

  if (!quiz) {
    return <div style={{ padding: "24px" }}>Quiz not found.</div>;
  }

  return (
    <div style={{ padding: "24px", background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", background: "#fff", padding: "24px", borderRadius: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h1>{quiz.title}</h1>
            <p style={{ marginTop: "8px" }}>
              Subject: {quiz.subject || "N/A"} | Difficulty: {quiz.difficulty}
            </p>
            <p>Total Questions: {totalQuestions}</p>
          </div>
          <Link to="/quizzes">Back to Quizzes</Link>
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          {quiz.questionIds.map((question, index) => (
            <div
              key={question._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <h3>
                Q{index + 1}. {question.questionText}
              </h3>

              <p style={{ marginTop: "8px", fontSize: "14px" }}>
                {question.subject} | {question.topic} | {question.difficulty}
              </p>

              <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
                {question.options?.length ? (
                  question.options.map((option, idx) => (
                    <label key={idx}>
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        checked={answersMap[question._id] === option}
                        onChange={(e) =>
                          handleAnswerChange(question._id, e.target.value)
                        }
                        style={{ marginRight: "8px" }}
                      />
                      {option}
                    </label>
                  ))
                ) : (
                  <input
                    type="text"
                    placeholder="Enter your answer"
                    value={answersMap[question._id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question._id, e.target.value)
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{ marginTop: "24px" }}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
};

export default TakeQuizPage;