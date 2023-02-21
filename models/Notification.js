import mongoose from "mongoose";
const { Schema } = mongoose;

const notifySchema = new Schema(
  {
    id: mongoose.Types.ObjectId,
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    url: String,
    text: String,
    recipients: [mongoose.Types.ObjectId],
    isRead: {type:Boolean, default: false},
    content: String
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("notify", notifySchema);
export default Notification
