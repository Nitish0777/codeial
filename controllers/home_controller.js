//finding post we need to import post schema
const Post = require("../models/post");

//we fetch user bcz we want to show all the list of user into the screen
const User = require("../models/user");

// the homepage logic where export to the router
module.exports.home = async (req, res) => {
	//cookies work
	// console.log(req.cookies);
	// // return res.end('<h1>Express is ready for codeTalk!!</h1>');
	// //i will change the cookies
	// res.cookie('user_id',22);

	//find all the post
	try {
		// const posts = await Post.find({});
		// if(posts){
		// 	return res.render("home", {
		// 		title: "CodeTalk | Home",
		// 		posts:posts,
		// 	});
		// }
		// return res.redirect('back');

		//find all post using populating the user in all post
		//populate the user document of each post
		//populate() is a method that allows you to load referenced
		// documents from other collections(userSchema)
		//exec() method to actually retrieve the documents
		// const newPost = await Post.find({}).populate('user').exec();
		//we are using the sort function here for sorting the post
		//.sort('-createdAt') this is sorting in queue form
		let newPost = await Post.find({})
			.sort("-createdAt")
			.populate("user")
			.populate({
				path: "comments",
				populate: {
					path: "user",
				},
				//now populate the likes
				populate:{
					path:'likes'
				}
			}).populate('likes');
			// .exec();
		// console.log(newPost);
		if (newPost) {
			//fetch all the User id from here...
			const allUserId = await User.find({});

			if (allUserId) {
				//we want to show all user list into the post so we written the logic here...
				return res.render("home", {
					title: "codeTalk | Home",
					posts: newPost,
					all_users: allUserId,
				});
			}
			// return res.redirect('back');
		}
		return res.redirect("back");
	} catch (err) {
		console.log(err);
		return res.redirect("back");
	}
};

//export the actionName page logic here
