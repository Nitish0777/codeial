//need postSchema to create post
//fetch the postSchema
const Post = require("../models/post");

//importing the comment for deleting
const Comment = require("../models/comment");

//import the like
const Like = require("../models/like");

// module.exports.createPost =function(req,res){
//     Post.create({
//         content:req.body.content,
//         user:req.user._id,
//     }, function (err ,post){
//         if(err){
//             console.log(` err in creating post `);
//             return;
//         }
//          return res.redirect('back');

//     });
// }

//we are just making views update by just putting the data information fetch by schemaPost
module.exports.createPost = async function (req, res) {
	try {
		let post = await Post.create({
			//taken the details form the post schema
			content: req.body.content,
			user: req.user._id,
		});

		//need to check the ajax request
		//set the data to..
		if (req.xhr) {
			//if we want to populate just the name of the user
			//(we'all not want to send the password in the API),
			//THIS is how we do it!
			post = await post.populate({ path: "user", select: "name" });
			return res.status(200).json({
				data: {
					post: post,
				},
				message: "Post created!",
			});
		}

		// req.flash("success", `Post Published !`);
		// "back" --> this will go the homeController.home (home page)['/']..
		return res.redirect("back");
	} catch (err) {
		// console.error("Error in creating post", err);
		req.flash("error", `check the error ${err} `);
		return res.status(500).send("Error in creating post");
	}
};

//now need to delete the post and comment to which is associated with the post
module.exports.destroyPost = async (req, res) => {
	try {
		//before deleting we need to check is it present in dB or not
		const postD = await Post.findById(req.params.id);
		//i need to check is the post created by the user is he is only deleting then allow only
		//ideally we do like this _id but mongoose give to do like id
		//.id means converting the object id into string
		if (postD.user == req.user.id) {

			//CHANGE:delete the associated likes for the post  and all its comment like too
			await Like.deleteMany({ likeable: postD, onModel: "Post" });
			await Like.deleteMany({ _id: { $in: postD.comments } });

			//if i am getting the post
			//  await postD.remove();
			await postD.deleteOne();

			//delete the comment also
			const commentD = await Comment.deleteMany({ postD: req.params.id });

			//deleting the post form the post using ajax jquery
			if (req.xhr) {
				return res.status(200).json({
					data: {
						post_id: req.params.id,
					},
					message: "Post is deleted!",
				});
			}

			if (commentD) {
				//if deleted
				// req.flash("success", `Post and associated comments deleted! `);
				return res.redirect("back");
			}
		} else {
			//if not match
			req.flash("error", `You can't delete this post....`);
			return res.redirect("back");
		}
	} catch (err) {
		// console.log(err);
		req.flash("error", `check the error ${err} `);
		return res.redirect("back");
	}
};

// module.exports.destroyPost = async (req, res) => {
// 	try {
// 		// Find the post in the database
// 		const postD = await Post.findById(req.params.id);

// 		// Check if the logged-in user is the author of the post
// 		if (postD.user.toString() !== req.user.id) {
// 			return res.status(401).json({ msg: "User not authorized" });
// 		}

// 		// Delete the post
// 		await postD.deleteOne();

// 		// Delete all comments associated with the post
// 		await Comment.deleteMany({ post: req.params.id });

// 		// Redirect the user back to the previous page
// 		res.redirect("back");
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).json({ msg: "Server Error" });
// 	}
// };
