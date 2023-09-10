const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		//comment belong to the user through populating
		//user Schema
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		post: {
			//fetching form the postSchema
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Like",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
