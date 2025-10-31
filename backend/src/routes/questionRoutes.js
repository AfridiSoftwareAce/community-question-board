import { Router } from "express";
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  addAnswer,
  updateQuestionStatus,
} from "../controllers/questionController.js";

const router = Router();

// GET /api/questions?status=open&priority=urgent&search=harry
router.get("/", getQuestions);

router.get("/:id", getQuestionById);

// POST /api/questions
router.post("/", createQuestion);

// POST /api/questions/:id/answers
router.post("/:id/answers", addAnswer);

// PATCH /api/questions/:id/status
router.patch("/:id/status", updateQuestionStatus);

export default router;
