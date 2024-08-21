import CustomErrorHandler from "./errors/customErrorHandler.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/index.js";
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!(authHeader && authHeader.startsWith("Bearer"))) {
      return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(CustomErrorHandler.unAuthorized());
    }

    const { _id } = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = {
      _id: _id,
    };

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export default auth;
