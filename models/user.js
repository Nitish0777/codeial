// const mongoose = require("mongoose");
const mongoose = require("mongoose");
//schema of the user

//import the multer here
const multer = require("multer");

const path = require("path"); //define path

//need to check which path we need to upload the
//here we store all the avatars
// this path -> /uploads/users/avatars is now converted into string using path modules
//define the variable in the folder not in the schema
const AVATAR_PATH = path.join("/uploads/users/avatars");
// console.log(AVATAR_PATH, "what is avaterrr");

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true, //without having an email value user won't able to create the account
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			//now need to link avatar/multer/AVATAR_PATH
			//so that when ever when we save a file it should
			//store in the ('/uploads/users/avatars') this link...
			//which mean it store the path of the file
			//this is dB which store the link of the file path
		},
		friendships:[
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "FriendShip",
			},
		],
	},
	{
		//this is handle when update data and delete data
		timestamp: true,
	}
);
//local storage that file is uploaded and the link of the file send to DB..
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		//CODETALK uploads users avatars
		cb(null, path.join(__dirname, "..", AVATAR_PATH));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

//static methods
//THIS mean that only one file can be uploaded
//for the fieldname avatar
//it use for this storage
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
	"avatar"
);
//we define so that AVATAR_PATH is publicly for the user models
userSchema.statics.avatarPath = AVATAR_PATH;

// const upload = multer({ storage: storage });

//we tell mongoose to that this is the model which we created
const User = mongoose.model("User", userSchema);

module.exports = User;
