import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    source: String,
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "user"
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "comment"
    }],
    description: String,
}, { timestamps: true});

const Post = mongoose.model("post", postSchema);
export default Post;


