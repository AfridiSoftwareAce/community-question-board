import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionListPage from "./pages/QuestionListPage.jsx";
import AskQuestionPage from "./pages/AskQuestionPage.jsx";
import QuestionDetailPage from "./pages/QuestionDetailPage.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestionListPage />} />
        <Route path="/ask" element={<AskQuestionPage />} />
        <Route path="/questions/:id" element={<QuestionDetailPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
// import React from "react";
// import ReactDOM from "react-dom/client";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <h1 style={{ textAlign: "center", marginTop: "3rem" }}>
//     ✅ React + Vite is Working
//   </h1>
// );
