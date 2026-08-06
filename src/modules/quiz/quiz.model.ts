import mongoose, { Model } from "mongoose";
import { Quiz, QuizAttempt, QuizQuestion } from "./quiz.types";

const { Schema, model, models } = mongoose;

const quizOptionSchema = new Schema({
  text: { type: String, required: true },
});

const quizQuestionSchema = new Schema<QuizQuestion>({
  question: { type: String, required: true },
  explanation: { type: String, required: true },
  points: { type: Number, required: true },
  order: { type: Number, required: true },
  options: { type: [quizOptionSchema], required: true },
  correctOptionId: { type: String, required: true },
});

const quizSchema = new Schema<Quiz>({
  lesson: { type: Schema.Types.ObjectId, unique: true, ref: "Lesson", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  passingScore: { type: Number, required: true },
  questions: { type: [quizQuestionSchema], required: true },
}, { timestamps: true });

const quizAttemptSchema = new Schema<QuizAttempt>({
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  answers: [
    {
      questionId: { type: String, required: true },
      selectedOptionId: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    }
  ],
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  percentage: { type: Number, required: true },
  submittedAt: { type: Date, required: true },
}, { timestamps: true });

export const QuizModel = models.Quiz as Model<Quiz> || model<Quiz>("Quiz", quizSchema);

export const QuizAttemptModel = models.QuizAttempt as Model<QuizAttempt> || model<QuizAttempt>("QuizAttempt", quizAttemptSchema); 
