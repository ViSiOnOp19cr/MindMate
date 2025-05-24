import express from "express";
import { createChatMessage, getChatHistory, deleteChatMessage, clearChatHistory } from '../controllers/chatController';
import { auth } from '../middleware/auth';

const chatRouter: express.Router = express.Router();

chatRouter.post("/", auth, createChatMessage);
chatRouter.get("/", auth, getChatHistory);
chatRouter.delete("/:id", auth, deleteChatMessage);
chatRouter.delete("/", auth, clearChatHistory);

export default chatRouter;