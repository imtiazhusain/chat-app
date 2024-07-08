import CustomErrorHandler from "./errors/customErrorHandler.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/index.js";
const auth = async (req, res, next) => {
  try {
    // yhan hm wo token get kr rhy
    const authHeader = req.headers.authorization;

    if (!(authHeader && authHeader.startsWith("Bearer"))) {
      return next(CustomErrorHandler.unAuthorized());
    }
    // if(!authHeader){
    // }

    // ye token say Bearer hta dey ga or hmein token dey ga
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(CustomErrorHandler.unAuthorized());
    }

    // console.log(token)

    const { _id } = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = {
      _id: _id,
    };
    // hm yhan khud say ak variable bna rhy req.user ka or is ko phir
    // hm agy controller may acces kr skty
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export default auth;
