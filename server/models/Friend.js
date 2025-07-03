import mongoose from "mongoose";

const friendSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "blocked"],
    default: "pending",
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure no duplicate friend relationships
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

export default mongoose.model("Friend", friendSchema);
