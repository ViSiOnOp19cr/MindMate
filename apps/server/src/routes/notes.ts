import express from "express";
import { createNote, getNotes, getNote, updateNote, deleteNote } from '../controllers/noteController';
import { auth } from '../middleware/auth';
import { validateNote } from '../middleware/validation';

const noteRouter: express.Router = express.Router();

noteRouter.post("/", auth, validateNote, createNote);
noteRouter.get("/", auth, getNotes);
noteRouter.get("/:id", auth, getNote);
noteRouter.put("/:id", auth, updateNote);
noteRouter.delete("/:id", auth, deleteNote);

export default noteRouter;