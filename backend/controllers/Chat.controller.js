import userModel from "../models/User.model.js";
import chatModel from "../models/Chat.model.js";
import messageModel from "../models/Message.js";
import CustomErrorHandler from "../middlewares/errors/customErrorHandler.js";

import joiValidation from "../utils/joiValidation.js";
import generateJwtTokens from "../utils/generateJwtTokens.js";
import mongoose from "mongoose";
import HelperMethods from "../utils/helper.js";
class Chat {
  static createNewChat = async (req, res, next) => {
    const { receiver_id } = req.params;

    if (!receiver_id) {
      return res.status(422).json({
        status: "error",
        message: "Please provide receiver_id",
      });
    }

    const isValidID = mongoose.Types.ObjectId.isValid(receiver_id);

    if (!isValidID) {
      return next(CustomErrorHandler.invalidId("Invalid receiver ID"));
    }

    try {
      let chat = await chatModel.find({
        $and: [
          { participants: { $elemMatch: { $eq: req.user._id } } },
          { participants: { $elemMatch: { $eq: receiver_id } } },
        ],
      });

      if (chat.length > 0) {
        return res.status(403).json({
          status: "error",
          message: "Chat Already exists",
        });
      } else {
        const registerNewChat = new chatModel({
          participants: [req.user._id, receiver_id],
        });

        const result = await registerNewChat.save();

        let selectedChat = await chatModel
          .findOne({ _id: result._id })
          // .populate("participants", "-password")
          .populate({
            path: "participants",
            match: { _id: { $ne: req.user._id } }, // Exclude specific participants
            select: "-password", // Exclude password field
          })
          .populate("messages")
          .populate({
            path: "latestMessage",
            populate: {
              path: "sender",
              model: "User",
              select: "name email profile_pic",
            },
          });

        selectedChat?.participants.map((user) => {
          user.profile_pic = `${
            process.env.SERVER_URL ? process.env.SERVER_URL : ""
          }/public/uploads/${user.profile_pic}`;
        });

        let processedChat = {
          latestMessage: selectedChat.latestMessage,
          user: selectedChat.participants[0],
          chat_id: selectedChat._id,
        };
        return res.status(201).json({
          status: "success",
          chat: processedChat,
        });
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static fetchChats = async (req, res, next) => {
    try {
      console.log(req.user._id);
      let chats = await chatModel
        .find({
          participants: { $elemMatch: { $eq: req.user._id } },
        })
        .populate("participants", "-password")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
            model: "User",
            select: "name email profile_pic",
          },
        })

        .sort({ updatedAt: -1 });

      if (chats.length > 0) {
        chats.map((chat) => {
          chat?.participants.map((user) => {
            if (user?.profile_pic.startsWith("http")) return;
            user.profile_pic = `${
              process.env.SERVER_URL ? process.env.SERVER_URL : ""
            }/public/uploads/${user.profile_pic}`;
          });
        });
      }
      return res.status(200).json({
        status: "status",
        chats: chats,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static fetchChat = async (req, res, next) => {
    try {
      const { chat_id } = req.params;

      const isValidID = mongoose.Types.ObjectId.isValid(chat_id);

      if (!isValidID) {
        return next(CustomErrorHandler.invalidId("Invalid chat ID"));
      }

      let chat = await chatModel.findById(chat_id).populate("messages");
      if (!chat) {
        return res.status(404).json({
          status: "error",
          message: "Chat Not Found",
        });
      }

      if (chat.messages.length > 0) {
        chat.messages = chat.messages.map((message) => {
          // Modify the attachedFile property of each message
          // Set it to whatever you need to add
          if (message?.attachedFile) {
            if (message?.attachedFile?.startsWith("http")) return message;
            message.attachedFile = `${
              process.env.SERVER_URL ? process.env.SERVER_URL : ""
            }/public/uploads/${message.attachedFile}`;
          }

          return message;
        });
      }

      return res.status(200).json({ status: "success", data: chat });
    } catch (error) {
      console.log(error);

      return next(error);
    }
  };

  static deleteChat = async (req, res, next) => {
    try {
      const { chat_id } = req.params;

      const isValidID = mongoose.Types.ObjectId.isValid(chat_id);

      if (!isValidID) {
        return next(CustomErrorHandler.invalidId("Invalid chat ID"));
      }

      let chat = await chatModel.findById(chat_id).populate("messages");
      if (!chat) {
        return res.status(404).json({
          status: "error",
          message: "Chat Not Found",
        });
      }

      if (chat.messages.length > 0) {
        let result = chat.messages.map((message) => {
          if (message?.attachedFile) {
            let fileName = message?.attachedFile;
            HelperMethods.deleteFileIfExists(fileName);
          }
        });

        await messageModel.deleteMany({
          _id: { $in: chat.messages.map((message) => message._id) },
        });
      }

      await chatModel.findByIdAndDelete(chat_id);
      return res
        .status(200)
        .json({ status: "success", message: "Chat deleted successfully" });
    } catch (error) {
      console.log(error);

      return next(error);
    }
  };
}

export default Chat;
