import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import folderRouter from "./routes/folders";
import noteRouter from "./routes/notes";
import chatRouter from "./routes/chat";
import aiRouter from "./routes/ai";
import fileUploadRouter from "./routes/file_upload";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api/users", userRouter);
app.use("/api/folders", folderRouter);
app.use("/api/notes", noteRouter);
app.use("/api/chat", chatRouter);
app.use("/api/ai", aiRouter);
app.use("/api/upload", fileUploadRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "AI Study Assistant API is running" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});