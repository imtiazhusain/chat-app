import chatModel from "../models/Chat.model.js";
import messageModel from "../models/Message.js";
import CustomErrorHandler from "../middlewares/errors/customErrorHandler.js";

import JoiValidation from "../utils/joiValidation.js";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../socket/socket.js";
class Message {
  static sendMessage = async (req, res, next) => {
    try {
      req.body.file = req?.file?.filename;
      const { message, receiver_id, file } = req.body;

      if (!file && message.length == 0) {
        return res.status(403).json({
          status: "error",
          message: "Empty message is not allowed",
        });
      }

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

        ...(file && { attachedFile: file }),
      });
      let newMessage = await createMessage.save();

      chat.latestMessage = newMessage._id;
      chat.messages.push(newMessage._id);
      await chat.save();
      if (newMessage.attachedFile) {
        newMessage.attachedFile = `${
          process.env.SERVER_URL ? process.env.SERVER_URL : ""
        }/public/uploads/${newMessage.attachedFile}`;
      }
      // SOCKET IO FUNCTIONALITY WILL GO HERE
      const receiverSocketId = getReceiverSocketId(receiver_id);
      if (receiverSocketId) {
        // io.to(<socket_id>).emit () used to send events to specific client
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      return res
        .status(201)
        .json({ status: "success", data: newMessage, message: "message sent" });
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
        messages.map((message) => {
          if (message?.attachedFile.startsWith("http")) return;
          message.attachedFile = `${
            process.env.SERVER_URL ? process.env.SERVER_URL : ""
          }/public/uploads/${message.attachedFile}`;
        });
      }

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
