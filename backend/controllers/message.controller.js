import chatModel from "../models/Chat.js";
import messageModel from "../models/Message.js";
import CustomErrorHandler from "../middlewares/errors/customErrorHandler.js";

import JoiValidation from "../utils/joiValidation.js";
import mongoose from "mongoose";
class Message {
  static sendMessage = async (req, res, next) => {
    try {
      const { message, receiver_id } = req.body;

      // validation
      const { error } = JoiValidation.sendMessageValidation(req.body);

      if (error) {
        console.log(error.message);
        return next(error);
      }

      const isValidID = mongoose.Types.ObjectId.isValid(receiver_id);

      if (!isValidID) {
        return next(CustomErrorHandler.invalidId("Invalid receiver ID"));
      }

      let chat = await chatModel.findOne({
        participants: {
          $all: [receiver_id, req.user._id],
        },
      });
      if (!chat) {
        return res.status(404).json({
          status: "error",
          message: "chat Not Found",
        });
      }

      const createMessage = new messageModel({
        sender: req.user._id,
        message: message,
        receiver: receiver_id,
      });
      let result = await createMessage.save();
      console.log(result);

      chat.latestMessage = result._id;
      chat.messages.push(result._id);
      console.log(chat);
      await chat.save();

      return res
        .status(201)
        .json({ status: "success", data: result, message: "message sent" });
    } catch (error) {
      console.log(error);

      return next(error);
    }
  };

  static fetchMessages = async (req, res, next) => {
    try {
      const chatId = req.params.chatId;

      const isValidID = mongoose.Types.ObjectId.isValid(chatId);

      if (!isValidID) {
        return next(CustomErrorHandler.invalidId("Invalid chat ID"));
      }

      const messages = await messageModel
        .find({ chat: chatId })
        .populate("sender", "name profilePic email")
        .populate("chat");

      if (messages.length > 0) {
        res.status(200).json({
          status: "success",
          messages: messages,
        });
      } else {
        // return next(CustomErrorHandler.NotFound("No Chats found with given chat ID"));

        res.status(200).json({
          status: "error",
          messages: messages,
        });
      }
    } catch (error) {
      console.log(error);

      return next(error);
    }
  };
}
export default Message;
