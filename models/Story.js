import mongoose from "mongoose";

const storySchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    source: { type: String},
    description: String,
    background: String,
}, { timestamps: true});

const Story = mongoose.model("story", storySchema);
export default Story;


