import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function QuestionDetailPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [answeredBy, setAnsweredBy] = useState("Librarian");
  const [error, setError] = useState("");

  // Fetch a single question
  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/questions/${id}`);
      if (res.data?.data) {
        setQuestion(res.data.data);
        setError("");
      } else {
        setError("Question not found");
        setQuestion(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load question");
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Add new answer
  const handleAddAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    try {
      await api.post(`/api/questions/${id}/answers`, {
        text: answerText,
        answeredBy,
      });
      setAnswerText("");
      fetchQuestion();
    } catch (err) {
      console.error(err);
      setError("Failed to add answer");
    }
  };

  // Loading state
  if (loading) return <p style={{ padding: "1.5rem" }}>Loading...</p>;

  // Not found or error state
  if (!question)
    return (
      <div style={{ padding: "1.5rem" }}>
        <p>{error || "Question not found"}</p>
        <Link to="/">← Back</Link>
      </div>
    );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem" }}>
      <p>
        <Link to="/">← Back to list</Link>
      </p>

      <h1>{question.title}</h1>
      {question.body && <p>{question.body}</p>}

      <p>
        <strong>Status:</strong> {question.status} |{" "}
        <strong>Priority:</strong> {question.priority}
      </p>
      <p>
        <strong>Asked by:</strong> {question.createdBy || "Anonymous"}
      </p>

      <h3>Answers ({question.answers?.length || 0})</h3>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {question.answers?.map((ans, idx) => (
          <li
            key={idx}
            style={{
              background: "#f3f4f6",
              borderRadius: "6px",
              padding: "0.75rem",
            }}
          >
            <p style={{ marginBottom: "0.25rem" }}>{ans.text}</p>
            <small>By {ans.answeredBy}</small>
          </li>
        ))}
        {(!question.answers || question.answers.length === 0) && (
          <p>No answers yet.</p>
        )}
      </ul>

      <h3 style={{ marginTop: "1.5rem" }}>Add an answer</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleAddAnswer}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={3}
          placeholder="Type the answer here..."
        />
        <input
          value={answeredBy}
          onChange={(e) => setAnsweredBy(e.target.value)}
          placeholder="Librarian / Staff name"
        />
        <button type="submit">Submit answer</button>
      </form>

      {/* Librarian controls */}
      <div
        style={{
          marginTop: "2rem",
          borderTop: "1px solid #ddd",
          paddingTop: "1rem",
        }}
      >
        <h3>Librarian Controls</h3>
        <button
          onClick={async () => {
            try {
              const newStatus =
                question.status === "answered" ? "open" : "answered";
              await api.patch(`/api/questions/${id}/status`, {
                status: newStatus,
              });
              fetchQuestion();
            } catch (err) {
              console.error(err);
              alert("Failed to update status");
            }
          }}
        >
          {question.status === "answered"
            ? "Reopen Question"
            : "Mark as Answered"}
        </button>
      </div>
    </div>
  );
}
