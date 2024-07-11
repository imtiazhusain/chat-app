import userModel from "../models/User.model.js";

import CustomErrorHandler from "../middlewares/errors/customErrorHandler.js";
import bcrypt from "bcrypt";

import joiValidation from "../utils/joiValidation.js";
import generateJwtTokens from "../utils/generateJwtTokens.js";
import chatModel from "../models/Chat.model.js";
import mongoose from "mongoose";
class User {
  static registerUser = async (req, res, next) => {
    try {
      // here i also coment 2 lines bcz i am not using multer here
      req.body.profile_pic = req?.file?.filename;
      const profile_pic = req.body.profile_pic;

      const { name, email, password } = req.body;
      // validation

      const { error } = joiValidation.registerUserValidation(req.body);

      if (error) {
        console.log(error.message);
        return next(error);
      }

      const exist = await userModel.exists({ email: email });

      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already taken")
        );
      }

      // hashing password
      const hashedPassword = await bcrypt.hash(password, 10);

      const registerUser = new userModel({
        name,
        email,
        profile_pic,
        password: hashedPassword,
      });

      const result = await registerUser.save();

      return res.status(201).json({
        status: "success",
        message: "User created successfully",
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static login = async (req, res, next) => {
    try {
      // validation
      const { error } = joiValidation.logInBodyValidation(req.body);

      if (error) {
        return next(error);
      }

      const user = await userModel
        .findOne({ email: req.body.email })
        .select("-__v");
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      //   compare password
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      //   token

      const accessToken = await generateJwtTokens(user);

      user.profile_pic = `${
        process.env.SERVER_URL ? process.env.SERVER_URL : ""
      }/public/uploads/${user.profile_pic}`;

      let userData = {
        _id: user._id,
        email: user.email,
        name: user.name,
        profile_pic: user.profile_pic,

        access_token: accessToken,
      };
      res.status(200).json({
        status: "success",
        data: userData,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  // SEARCH USER
  static searchUsers = async (req, res, next) => {
    try {
      let userName = req.query.username;

      if (userName) {
        userModel
          .find({
            name: { $regex: new RegExp("^" + userName + ".*", "i") },

            _id: { $ne: req.user._id },
          })
          // .find({ _id: { $ne: req.user._id } })
          .then((users) => {
            if (users.length > 0) {
              res.status(200).json({
                status: "success",
                users: users,
              });
            } else {
              res.status(404).json({
                status: "error",
                message: "no user found",
              });
            }
          })
          .catch((err) => {
            return next(err);
          });
      } else {
        res.status(422).json({
          status: "error",
          message: "Please provide username",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "something went wrong while searching user",
      });
    }
  };

  static getAllUsers = async (req, res, next) => {
    try {
      let chats = await chatModel.find({
        participants: { $elemMatch: { $eq: req.user._id } },
      });

      // Extract all participant IDs and remove duplicates
      // Step 1: flatMap combines all participant arrays into one array: [1, 2, 3, 3, 4, 5, 1, 6]
      // Step 2: new Set([1, 2, 3, 3, 4, 5, 1, 6]) reduces it to unique values: Set(1, 2, 3, 4, 5, 6)
      // Step 3: Array.from converts the Set back to an array: [1, 2, 3, 4, 5, 6]

      // .toString Convert each ObjectId to a string to enable correct duplicate removal becuase if you don't do that it will consider new objectid and make them all unique so you need to convert into string
      const uniqueIds = Array.from(
        new Set(
          chats.flatMap((obj) => obj.participants.map((id) => id.toString()))
        )
      );

      // ignore single user
      // const users = await userModel
      //   .find({ _id: { $ne: req.user._id } })
      //   .select("-password");

      // ignore multiple users by giving array of id's
      const users = await userModel
        .find({ _id: { $nin: uniqueIds } })
        .select("-password");

      users.map((user) => {
        user.profile_pic = `${
          process.env.SERVER_URL ? process.env.SERVER_URL : ""
        }/public/uploads/${user.profile_pic}`;
      });

      res.status(200).json({
        status: "success",
        data: users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "something went wrong while searching user",
      });
    }
  };

  static logout = async (req, res, next) => {
    // validation

    // const { error } = joiValidation.refreshTokenValidation(req.body);
    // if (error) {
    //   return next(error);
    // }
    try {
      // let isdeleted = await refreshTokenModel.deleteOne({
      //   refresh_token: req.body.refresh_token,
      // });
      // console.log(isdeleted);
    } catch (error) {
      return next(new Error("somthing went wrong in database"));
    }
    res.status(200).json({ status: "success", message: "successfully logout" });
  };

  static editUser = async (req, res, next) => {
    try {
      // here i also coment 2 lines bcz i am not using multer here
      // req.body.profile_pic = req?.file?.filename;
      const profile_pic = req?.file?.filename;

      const { name, email, user_id } = req.body;
      console.log(req.body);

      if (req?.body?.profile_pic) {
        delete req.body.profile_pic;
      }
      console.log(profile_pic);
      console.log(req.body);
      // validation
      const isValidID = mongoose.Types.ObjectId.isValid(user_id);

      if (!isValidID) {
        return next(CustomErrorHandler.invalidId("Invalid user ID"));
      }
      const { error } = joiValidation.editUser(req.body);

      if (error) {
        console.log(error.message);
        return next(error);
      }

      const exist = await userModel.exists({
        email: email,
        _id: { $ne: user_id },
      });

      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already taken")
        );
      }

      let userUpdatedData = {
        name: name,
        email: email,
        profile_pic: profile_pic ? profile_pic : null,
      };

      if (!userUpdatedData?.profile_pic) {
        console.log("profile not found");
        delete userUpdatedData.profile_pic;
      }

      console.log(userUpdatedData);
      const updatedUser = await userModel.findByIdAndUpdate(
        user_id,
        userUpdatedData,
        { new: true } // Return the updated document
      );

      updatedUser.profile_pic = `${
        process.env.SERVER_URL ? process.env.SERVER_URL : ""
      }/public/uploads/${updatedUser.profile_pic}`;

      let userData = {
        email: updatedUser.email,
        name: updatedUser.name,
        profile_pic: updatedUser.profile_pic,
      };

      return res.status(201).json({
        status: "success",
        message: "User updated successfully",
        data: userData,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}

export default User;
