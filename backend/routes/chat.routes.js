import express from "express";
const router = express.Router();

import authMiddleware from "../middlewares/auth.js";
import ChatController from "../controllers/Chat.controller.js";
// chat
router.post(
  "/create_new_chat/:receiver_id",
  authMiddleware,
  ChatController.createNewChat
);
router.get("/get_all_chats", authMiddleware, ChatController.fetchChats);
router.get("/get_chat/:chat_id", authMiddleware, ChatController.fetchChat);
router.delete("/delete_chat/:chat_id", ChatController.deleteChat);
// router.post(
//   "/create_group_chat",
//   authMiddleware,
//   ChatController.createGroupChat
// );
// router.post(
//   "/rename_group_chat",
//   authMiddleware,
//   ChatController.renameGroupChat
// );
// router.post(
//   "/add_user_in_group_chat",
//   authMiddleware,
//   ChatController.addUserInGroupChat
// );

// router.post(
//   "/remove_user_in_group_chat",
//   authMiddleware,
//   ChatController.removeUserInGroupChat
// );

export default router;
