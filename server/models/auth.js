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
  points: { type: Number, default: 0 },
  badges: [
    {
      name: { type: String },
      description: { type: String },
      achievedOn: { type: Date, default: Date.now },
      icon: { type: String },
    },
  ],
  pointsHistory: [
    {
      action: { type: String },
      points: { type: Number },
      description: { type: String },
      timestamp: { type: Date, default: Date.now },
      relatedId: { type: String },
    },
  ],
});

export default mongoose.model("User", userschema);
