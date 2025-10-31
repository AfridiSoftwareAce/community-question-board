import { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useSearchParams } from "react-router-dom";

export default function QuestionListPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState("");

  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const search = searchParams.get("search") || "";

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (search) params.search = search;

      const res = await api.get("/api/questions", { params });
      setQuestions(res.data.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, priority, search]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  return (
    <div className="container" style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Library Question Board</h1>
        <Link to="/ask" style={{ textDecoration: "none" }}>
          <button>Ask a question</button>
        </Link>
      </header>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
        <select value={status} onChange={(e) => handleFilterChange("status", e.target.value)}>
          <option value="">All statuses</option>
          <option value="open">Open / Unanswered</option>
          <option value="answered">Answered</option>
        </select>

        <select value={priority} onChange={(e) => handleFilterChange("priority", e.target.value)}>
          <option value="">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>

        <input
          type="text"
          placeholder="Search (e.g. harry potter)"
          value={search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && questions.length === 0 && <p>No questions found.</p>}

      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
        {questions.map((q) => (
          <li key={q._id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <div>
                <h3 style={{ marginBottom: "0.25rem" }}>
                  <Link to={`/questions/${q._id}`}>{q.title}</Link>
                </h3>
                {q.body ? <p style={{ marginTop: 0 }}>{q.body}</p> : null}
                <small>Asked by: {q.createdBy || "Anonymous"}</small>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    background: q.status === "answered" ? "#d1fae5" : "#fee2e2",
                    marginBottom: "0.5rem",
                  }}
                >
                  {q.status}
                </span>
                <br />
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    background:
                      q.priority === "urgent" ? "#fee2e2" : q.priority === "normal" ? "#e0f2fe" : "#fef9c3",
                  }}
                >
                  {q.priority}
                </span>
                <br />
                <small>{q.answers?.length || 0} answers</small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
