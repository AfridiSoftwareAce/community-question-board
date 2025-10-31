import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    answeredBy: { type: String, default: "Librarian" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String },
    priority: {
      type: String,
      enum: ["urgent", "normal", "low"],
      default: "normal",
    },
    status: {
      type: String,
      enum: ["open", "answered"],
      default: "open",
    },
    tags: [{ type: String }],
    createdBy: { type: String, default: "Anonymous" },
    answers: [answerSchema],
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
