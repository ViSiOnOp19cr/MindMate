import express from "express";
import { createFolder, getFolders, getFolder, updateFolder, deleteFolder } from '../controllers/folderController';
import { auth } from '../middleware/auth';
import { validateFolder } from '../middleware/validation';

const folderRouter: express.Router = express.Router();

folderRouter.post("/", auth, validateFolder, createFolder);
folderRouter.get("/", auth, getFolders);
folderRouter.get("/:id", auth, getFolder);
folderRouter.put("/:id", auth, updateFolder);
folderRouter.delete("/:id", auth, deleteFolder);

export default folderRouter;