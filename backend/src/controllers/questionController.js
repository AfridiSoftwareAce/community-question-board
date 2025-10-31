import { Question } from "../models/Question.js";


/**
 * GET /api/questions/:id
 * Fetch a single question by ID
 */
export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    return res.json({ message: "Question fetched", data: question });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/questions
 * Create a new question
 */
export const createQuestion = async (req, res, next) => {
  try {
    const { title, body, priority, tags, createdBy } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const question = await Question.create({
      title: title.trim(),
      body: body || "",
      priority: priority || "normal",
      tags: Array.isArray(tags) ? tags : [],
      createdBy: createdBy?.trim() || "Anonymous",
    });

    return res.status(201).json({
      message: "Question created successfully",
      data: question,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/questions
 * Filters:
 *  - ?status=open | answered
 *  - ?priority=urgent | normal | low
 *  - ?search=harry
 */
export const getQuestions = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      // match title or body
      filter.$or = [{ title: regex }, { body: regex }];
    }

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      message: "Questions fetched",
      count: questions.length,
      data: questions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/questions/:id/answers
 * Add an answer to a question
 */
export const addAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, answeredBy } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.answers.push({
      text: text.trim(),
      answeredBy: answeredBy?.trim() || "Librarian",
    });

    // if it has at least 1 answer, mark as answered
    if (question.answers.length > 0) {
      question.status = "answered";
    }

    await question.save();

    return res.status(201).json({
      message: "Answer added",
      data: question,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/questions/:id/status
 * Manually change status (for librarian)
 * body: { status: "open" | "answered" }
 */
export const updateQuestionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "answered"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'open' or 'answered'" });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.json({
      message: "Status updated",
      data: question,
    });
  } catch (err) {
    next(err);
  }
};
