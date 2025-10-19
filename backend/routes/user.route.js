import { getUserProfile, updateUserProfile, updateAvatar, getPublicProfile, followUser } from "../controllers/user.controller.js";

import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/:id", verifyToken, getUserProfile);
userRouter.put("/update", verifyToken, updateUserProfile);
userRouter.put("/update-avatar", verifyToken, updateAvatar);
userRouter.get("/public/:username", verifyToken, getPublicProfile);
userRouter.post("/follow/:id", verifyToken, followUser);


export default userRouter;

