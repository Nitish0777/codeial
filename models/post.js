//how to established a relationship in dataBase
// user and post

const mongoose = require("mongoose");

//import like
// const like = require("like");

//creating the schema
const postSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		//this will be prePopulating through the userSchema there data..
		//In mongoose, the ObjectId type is used not to create a new uuid,
		//rather it is mostly used to reference other documents(user.js models Schema)
		//This is a powerful feature of Mongoose that allows you to create
		// relationships between documents in different collections,making it easier to model complex MdB
		user: {
			//taking reference of userSchema
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},

		//include the id of all the comment into the post as an array
		//include the array of ids of all the comments in this postSchema itself
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
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

const Post = mongoose.model("Post", postSchema);
// console.log(Post);
module.exports = Post;
