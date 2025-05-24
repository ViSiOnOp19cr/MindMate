import express from "express";
import { generateSummary, generateQuiz, getSummaries, getQuizzes, deleteSummary, deleteQuiz, chatWithAI } from '../controllers/aiController';
import { auth } from '../middleware/auth';

const aiRouter: express.Router = express.Router();

aiRouter.post("/summary", auth, generateSummary);
aiRouter.post("/quiz", auth, generateQuiz);
aiRouter.post("/chat", auth, chatWithAI);
aiRouter.get("/summaries", auth, getSummaries);
aiRouter.get("/quizzes", auth, getQuizzes);
aiRouter.delete("/summary/:id", auth, deleteSummary);
aiRouter.delete("/quiz/:id", auth, deleteQuiz);

export default aiRouter;