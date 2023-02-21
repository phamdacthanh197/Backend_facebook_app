import mongoose from "mongoose";
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    recipients: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    text: String,
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("conversation", conversationSchema);
export default Conversation
