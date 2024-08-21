import Joi from "joi";
class JoiValidation {
  static logInBodyValidation(body) {
    const schema = Joi.object({
      email: Joi.string().email().required().label("email"),
      password: Joi.string().required().label("password"),
    });
    return schema.validate(body);
  }

  static sendMessageValidation(body) {
    const schema = Joi.object({
      // message: Joi.string().optional(),

      message: Joi.string()
        .allow("")
        .when("file", {
          is: Joi.string().min(1), // Checks that 'file' is a non-empty string
          then: Joi.optional(), // 'message' can be optional
          otherwise: Joi.string().required().messages({
            "string.empty": "Message cannot be empty if no file is provided",
          }), // 'message' must not be empty if 'file' is not provided
        }),
      receiver_id: Joi.string().required(),
      file: Joi.string().optional(),
    });

    return schema.validate(body);
  }

  // static createMovieRatingValidation(body) {
  //   const schema = Joi.object({
  //     name: Joi.string().required().label("Movie Name"),
  //     rating: Joi.number().required().label("Movie Rating"),
  //     description: Joi.string().required().label("Movie Description"),
  //     poster: Joi.string().required().label("Movie Poster"),
  //   });
  //   return schema.validate(body);
  // }

  // static updateMovieRatingValidation(body) {
  //   const schema = Joi.object({
  //     name: Joi.string().required().label("Movie Name"),
  //     rating: Joi.number().required().label("Movie Rating"),
  //     description: Joi.string().required().label("Movie Description"),
  //   });
  //   return schema.validate(body);
  // }

  static registerUserValidation(body) {
    const schema = Joi.object({
      name: Joi.string().min(2).max(30).required().label("Name"),
      email: Joi.string().email().required().label("Email"),
      profile_pic: Joi.string().required().label("Profile Picture"),
      password: Joi.string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()_+\\-=\\[\\]{};:'\"\\\\|,.<>\\/?]).{8,30}$"
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must have  7+ chars, 1 uppercase, 1 lowercase, 1 special char",
          "string.empty": "Please provide password",
          "string.length":
            "Password must have  7+ chars, 1 uppercase, 1 lowercase, 1 special char",
          "any.required":
            "Password must have  7+ chars, 1 uppercase, 1 lowercase, 1 special char",
        }),
    });

    return schema.validate(body);
  }

  static editUser(body) {
    const schema = Joi.object({
      name: Joi.string().min(2).max(30).required().label("Name"),
      email: Joi.string().email().required().label("Email"),
      user_id: Joi.string().required().label("User ID"),
    });

    return schema.validate(body);
  }

  static verifyEmailValidation(body) {
    const schema = Joi.object({
      userId: Joi.string().required(),
      OTP: Joi.string()
        .length(4)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
          "string.pattern.base": "Invalid OTP",
          "string.empty": "OTP field cannot be empty. Please provide OTP.",
          "string.length": "Invalid OTP.",
          "any.required": "Please provide the OTP to proceed",
        }),
    });

    return schema.validate(body);
  }

  static sendOTPValidation(body) {
    const schema = Joi.object({
      userEmail: Joi.string().email().required(),
      userId: Joi.string().required(),
    });

    return schema.validate(body);
  }
}

export default JoiValidation;
