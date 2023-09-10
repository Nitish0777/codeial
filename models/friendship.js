const mongoose = require("mongoose");

const friendshipSchema = new mongoose.Schema(
	{
		//the user who want to send request
		from_user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		//the user who accepted the request,
		//the naming is just to understand,
		//otherwise the users won't see a difference
		to_user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const FriendShip = mongoose.model('Friendship',friendshipSchema);
module.exports = FriendShip;