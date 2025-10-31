import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function AskQuestionPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("normal");
  const [createdBy, setCreatedBy] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/api/questions", {
        title,
        body,
        priority,
        createdBy,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem" }}>
      <h1>Ask a question</h1>
      <p>Library staff or other visitors will answer it here.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label>Title *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What time does the library close?"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Details</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Add more context so librarians can answer better"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="urgent">Urgent (opening hours etc.)</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label>Your name (optional)</label>
          <input
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            placeholder="Anonymous"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button type="submit">Submit question</button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        <Link to="/">← Back to questions</Link>
      </p>
    </div>
  );
}
