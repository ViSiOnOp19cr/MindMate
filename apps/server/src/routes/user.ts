import express from "express";
import { signup, signin, getMe } from '../controllers/userController';
import { auth } from '../middleware/auth';
import { validateSignup, validateSignin } from '../middleware/validation';

const userRouter: express.Router = express.Router();

userRouter.post("/signup", validateSignup, signup);
userRouter.post("/signin", validateSignin, signin);
userRouter.get("/me", auth, getMe);

export default userRouter;
