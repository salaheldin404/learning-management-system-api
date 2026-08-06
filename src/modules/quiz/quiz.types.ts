import { Types } from "mongoose";


interface QuizOption {
  id: string;
  text: string;
}

interface Answer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}


export interface QuizQuestion {
  id: string;
  question: string;
  explanation: string;
  points: number;
  order: number;
  options: QuizOption[];
  correctOptionId: string;
}


export interface Quiz {
  id: string;
  lesson: Types.ObjectId;
  title: string;
  description: string;
  passingScore: number;
  questions: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: string;
  quiz: Types.ObjectId;
  lesson: Types.ObjectId;
  student: Types.ObjectId;
  answers: Answer[];

  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  percentage: number;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
