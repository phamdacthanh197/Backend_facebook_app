import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema(
  { 
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    postId: { type: mongoose.Types.ObjectId, ref: "post" },
    reply: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    description: String,
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("comment", commentSchema);
export default Comment