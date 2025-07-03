import mongoose from "mongoose";
const userschema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  phone: { type: String },
  lastPasswordResetRequest: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  joinedon: { type: Date, default: Date.now },
});

export default mongoose.model("User", userschema);
