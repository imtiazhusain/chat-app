import express from "express";
const router = express.Router();

import authMiddleware from "../middlewares/auth.js";
import MessageController from "../controllers/message.controller.js";
import upload from "../middlewares/multer.js";

// chat
router.post(
  "/send_message",
  authMiddleware,
  [upload],
  MessageController.sendMessage
);

export default router;
