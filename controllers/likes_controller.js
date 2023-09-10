//import the 3 models
const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");
/* /likes/toggle/likes_controller */
module.exports.toggleLike = async (req, res) => {
	try {
		//likes/toggle/?id=abcdef&type=Post
		let likeable;
		//so that when u received json data back base on that
		//you can increment and decrement the count of the like
		//which is display on the screen
		let deleted = false;

		//why we use query?

		/*In Express.js, the req.params object is used to retrieve parameters
        from the URL path. For example, if the URL path is /users/:userId, 
        the userId parameter can be accessed using req.params.userId.*/

		/*On the other hand, the req.query object is used to retrieve query parameters
         from the URL query string. Query parameters are typically used to
         filter or sort data, and they appear at the end of the URL
         after a question mark ?. For example, in the URL /users?sort=name&limit=10,
         the sort and limit parameters can be accessed using req.query.sort
         and req.query.limit, respectively.*/

		//finding likeable
		if (req.query.type == "Post") {
			//The populates() method is used to fill the likes array
			// with the actual Like objects, instead of just their IDs.
			likeable = await Post.findById(req.query.id).populate("likes");
		} else {
			likeable = await Comment.findById(req.query.id).populate("likes");
		}

		//i need to check likes already present/exits
		let existingLike = await Like.findOne({
			likeable: req.query.id,
			onModel: req.query.type,
			user: req.user._id, //a user can not like without authentication
		});

		//if like already exists then delete it
		if (existingLike) {
			//1 remove the like from likeable
			likeable.likes.pull(existingLike._id);
			likeable.save();

			existingLike.deleteOne();
			deleted = true;
		} else {
			//else make a new like

			let newLike = await Like.create({
				user: req.user._id,
				likeable: req.query.id,
				onModel: req.query.type,
			});

			//now put this newLike into the array likes of post and comment
			likeable.likes.push(newLike._id);
			likeable.save();
		}
		return res.json(200, {
			message: "Request Successfully",
			data: {
				deleted: deleted,
			},
		});
	} catch (err) {
		console.log(`err getting in Like button ${err}`);
		return res.json(500, {
			message: "Internal Server Error",
		});
	}
};
