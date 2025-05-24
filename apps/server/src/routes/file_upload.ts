import express from "express";
import { uploadFile, getFileInfo, deleteFile } from '../controllers/fileUploadController';
import { auth } from '../middleware/auth';

const fileUploadRouter: express.Router = express.Router();

fileUploadRouter.post("/", auth, uploadFile);
fileUploadRouter.get("/:filename", auth, getFileInfo);
fileUploadRouter.delete("/:filename", auth, deleteFile);

export default fileUploadRouter;