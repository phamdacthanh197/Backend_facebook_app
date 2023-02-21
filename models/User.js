import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			min: 2,
			max: 50,
		},
		lastName: {
			type: String,
			required: true,
			min: 2,
			max: 50,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 5,
		},
		picturePath: {
			type: String,
			default: "",
		},
		friends: [
			{
				type: mongoose.Types.ObjectId,
				ref: "user",
			},
		],
		coverPhoto: {
			type:String,
			default: "coverPhoto.jpg"
		},
		location: String,
		ocupation: {
			type: String,
			default: "default"
		},
		viewedProfile: Number,
		impressions: Number,
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("user", UserSchema);
export default User;
