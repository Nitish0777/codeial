const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
	{
		user: {
			//store the id of the user who perform
			//the like action
			type: mongoose.Schema.ObjectId,
		},
		//this defines the object id of the liked object
		likeable: {
			//The likeable field is also an ObjectId type field 
			//that stores the ID of the object that was liked. 
			//This field is required and it references another field named onModel.
			//The refPath option in this field is used to dynamically reference
			//the type of the object that was liked.
			type: mongoose.Schema.ObjectId,
			required: true,
			refPath: "onModel",
		},
		//this field is used for defining the type of the liked object
		//since this is a dynamic reference
		onModel: {
			//The onModel field is a string type field that stores 
			//the type of the object that was liked.
			//It is required and it can only have
			// two possible values: "Post" or "Comment".
			type: String,
			required: true,
			enum: ["Post", "Comment"],//only this models contains in dB
		},
	},
	{
		timestamps: true,
	}
);


const Like = mongoose.model('Like',likeSchema);
module.exports = Like;