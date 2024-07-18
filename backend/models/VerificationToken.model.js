import mongoose from "mongoose";
import bcrypt from "bcrypt";

const tokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  OTP: { type: String, required: true },

  expiresAt: { type: Date, default: Date.now, expires: 1800 },
});

tokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    const hash = await bcrypt.hash(this.OTP, 8);
    this.OTP = hash;
  }
  next();
});

tokenSchema.methods.compareToken = async function (token) {
  console.log(token);
  console.log(this.OTP);
  const result = await bcrypt.compare(token, this.OTP);
  return result;
};

const tokenModel = mongoose.model("verification_Token", tokenSchema);

export default tokenModel;
