import express from "express";
const router = express.Router();

import authMiddleware from "../middlewares/auth.js";
import MessageController from "../controllers/message.controller.js";
// chat
router.post("/send_message", authMiddleware, MessageController.sendMessage);

export default router;
