//this will basically just like post controller
//now it basic api

//finding from the post schema so need to import it
const Post = require('../../../models/post');

//define the comments schema to for populating work
const Comment = require('../../../models/comment');

module.exports.indexApiData = async function (req, res) {


	
	let newPost = await Post.find({})
			.sort("-createdAt")
			.populate("user")
			.populate({
				path: "comments",
				populate: {
					path: "user",
				},
	});

	//send the data from the database to the API
	//so that we can fetch the data from the API
	// and we can show in the website....
	return res.json(200, {
		message: "List of posts",
		posts: newPost,
	});
};


//deleting the post into the api

module.exports.destroyPostApi = async (req, res) => {
	try {
		//before deleting we need to check is it present in dB or not
		const postD = await Post.findById(req.params.id);
		//i need to check is the post created by the user is he is only deleting then allow only
		//ideally we do like this _id but mongoose give to do like id
		//.id means converting the object id into string
		// user which fetch from the request

		//now checking and verify the authorization
		if (postD.user == req.user.id) {
			//if i am getting the post
			// await postD.remove();
			await postD.deleteOne();

			//delete the comment also
			const commentD = await Comment.deleteMany({ postD: req.params.id });

			//deleting the post form the post using ajax jquery
		

			if (commentD) {
				//if deleted
				// req.flash("success", `Post and associated comments deleted! `);
				return res.json(200,{
					message:'Post associated Deleted..'
				});
			}
		} else {
			//if not match
			// req.flash("error", `You can't delete this post....`);
			// return res.redirect("back");

			//user not matching
			return res.json(401,{
				message:"you can not delete this post !",
			});
		}
	} catch (err) {
		// console.log(err);
		// req.flash("error", `check the error ${err} `);
		// return res.redirect("back");
		//token get expire
		return res.json(500,{
			message:'Internal server Error'
		})
	}
};