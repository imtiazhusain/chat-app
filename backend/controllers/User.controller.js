import userModel from "../models/User.model.js";

import CustomErrorHandler from "../middlewares/errors/customErrorHandler.js";
import bcrypt from "bcrypt";

import joiValidation from "../utils/joiValidation.js";
import generateJwtTokens from "../utils/generateJwtTokens.js";
class User {
  static registerUser = async (req, res, next) => {
    try {
      console.log("hello");
      console.log(req.body);

      // here i also coment 2 lines bcz i am not using multer here
      req.body.profile_pic = req?.file?.filename;
      const profile_pic = req.body.profile_pic;

      console.log(req.body);
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

      console.log(hashedPassword);

      // console.log(req.body)

      const registerUser = new userModel({
        name,
        email,
        profile_pic,
        password: hashedPassword,
      });

      console.log("register user is");
      console.log(registerUser);

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
      console.log(req.body);
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
      const users = await userModel
        .find({ _id: { $ne: req.user._id } })
        .select("-password");

      users.map((user) => {
        user.profile_pic = `${
          process.env.SERVER_URL ? process.env.SERVER_URL : ""
        }/public/uploads/${user.profile_pic}`;
      });

      console.log(users);
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
    console.log(req.body);
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
}

export default User;
