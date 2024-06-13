import userModel from "../models/User.model.js";
import chatModel from "../models/Chat.js";
import messageModel from "../models/Message.js";
import CustomErrorHandler from "../middlewares/errors/customErrorHandler.js";

import joiValidation from "../utils/joiValidation.js";
import generateJwtTokens from "../utils/generateJwtTokens.js";
import mongoose from "mongoose";
class Chat {
  static createOrAccessChat = async (req, res, next) => {
    console.log(req.params);
    const { receiver_id } = req.params;

    if (!receiver_id) {
      return res.status(422).json({
        status: "error",
        message: "Please provide receiver_id",
      });
    }

    const isValidID = mongoose.Types.ObjectId.isValid(receiver_id);

    console.log(isValidID);
    if (!isValidID) {
      return next(CustomErrorHandler.invalidId("Invalid receiver ID"));
    }

    try {
      let chat = await chatModel
        .find({
          $and: [
            { participants: { $elemMatch: { $eq: req.user._id } } },
            { participants: { $elemMatch: { $eq: receiver_id } } },
          ],
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
        .populate("messages", "-password");

      if (chat.length > 0) {
        let selectedChat = chat[0];

        selectedChat?.participants.map((user) => {
          user.profile_pic = `${
            process.env.SERVER_URL ? process.env.SERVER_URL : ""
          }/public/uploads/${user.profile_pic}`;
        });
        return res.status(200).json({
          status: "success",
          chat: selectedChat,
        });
      } else {
        console.log("new chat is going to create");
        const registerNewChat = new chatModel({
          participants: [req.user._id, receiver_id],
        });

        const result = await registerNewChat.save();

        console.log(result);
        let selectedChat = await chatModel
          .findOne({ _id: result._id })
          .populate("participants", "-password")
          .populate("messages", "-password");

        selectedChat?.participants.map((user) => {
          user.profile_pic = `${
            process.env.SERVER_URL ? process.env.SERVER_URL : ""
          }/public/uploads/${user.profile_pic}`;
        });

        return res.status(200).json({
          status: "success",
          chat: selectedChat,
        });
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static fetchChats = async (req, res, next) => {
    try {
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

      console.log(chats);
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

      return res.status(200).json({ status: "success", data: chat });
    } catch (error) {
      console.log(error);

      return next(error);
    }
  };
}

export default Chat;
