import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  media: [
    {
      type: { type: String, enum: ["image", "video"], required: true },
      url: { type: String, required: true },
      filename: { type: String, required: true },
      public_id: { type: String }, // Cloudinary public_id for deletion
    },
  ],
  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      likedAt: { type: Date, default: Date.now },
    },
  ],
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: { type: String, required: true },
      commentedAt: { type: Date, default: Date.now },
    },
  ],
  shares: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      sharedAt: { type: Date, default: Date.now },
    },
  ],
  visibility: { type: String, enum: ["public", "friends"], default: "public" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
