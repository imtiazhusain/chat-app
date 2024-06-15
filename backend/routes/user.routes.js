import express from "express";
const router = express.Router();

import User from "../controllers/User.controller.js";
import upload from "../middlewares/multer.js";
import authMiddleware from "../middlewares/auth.js";

router.post("/register_user", [upload], User.registerUser);

router.post("/login", User.login);
router.post("/logout", authMiddleware, User.logout);
router.post("/search_users", authMiddleware, User.searchUsers);
router.get("/get_all_users", authMiddleware, User.getAllUsers);

export default router;
