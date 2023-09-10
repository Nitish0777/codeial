const User = require("../models/user");


const fs = require("fs");
const path = require("path");

module.exports.profile = async (req, res) => {
	console.log(req.params.id);
	try {
		let Users = await User.findById(req.params.id);
		// console.log("this is the profile user_controller");
		if (Users) {
			return res.render("user_profile", {
				title: "User_Profile",
				profile_user: Users,
			});
		}
	} catch (err) {
		console.log(err);
		return;
	}

	// return res.end(`<h1>Yeah this  is the profile work shown here now </h1>`);
};

//now we create a controller so that u can
//update you name and email of the sign in profile...
module.exports.update = async (req, res) => {
	// try {
	//first check the update request is valid or not
	// if (req.user.id == req.params.id) {
	// 	//now allow to edits or update if user found..
	// 	const updateData = await User.findById(req.params.id); //, {
	// 	name: req.body.name,
	// 	email: req.body.email,
	// });

	// User.uploadedAvatar(req, res, function (err) {
	// 	//go and analyzes the req part here...
	// 	//and send something back along side response
	// 	//when i save the user..
	// 	if (err) {
	// 		console.log("********multer Error:" + err);
	// 	}
	// 	//if no error
	// 	//bcz req contains the file
	// 	// console.log(req.file);
	// 	// i did not able to read body without this multer things
	// 	//bcz my form is multipart
	// 	 updateData.name = req.body.name;
	// 	 updateData.email = req.body.email;

	// 	 if(req.file){
	// 		//not every time someone upload file
	// 		//so for that case
	// 		//i make a check for it and if there file then only i send it
	// 		//just saving the path of the uploaded the file into the avatar
	// 		//field in the user
	// 		updateData.avatar = User.avatarPath + '/' + req.file.filename;

	// 	 }
	// 	 //save the user
	// 	 updateData.save();
	// 	 return res.redirect('back');
	// });

	// 		await User.uploadedAvatar(req, res, async function (err) {
	// 			try {
	// 				if (err) {
	// 					console.log("********multer Error:" + err);
	// 				}

	// 				console.log(req.file);

	// 				updateData.name = req.body.name;
	// 				updateData.email = req.body.email;

	// 				if (req.file) {
	// 					updateData.avatar = User.avatarPath + "/" + req.file.filename;
	// 				}

	// 				await updateData.save();
	// 				return res.redirect("back");
	// 			} catch (err) {
	// 				req.flash("error", "Unauthorized");
	// 				//   return res.redirect("back");
	// 			}
	// 		});

	// 		if (updateData) {
	// 			return res.redirect("back");
	// 		}
	// 	} // else {
	// 	// 	req.flash("error", "Unauthorized");
	// 	// 	return await res.status(401).send("unauthorized");
	// 	// }
	// } catch (err) {
	// 	req.flash("error", "Unauthorized");
	// 	// return await res.status(401).send("unauthorized");
	// 	return res.redirect("back");
	// }

	//###########################################################################################

	if (req.user.id == req.params.id) {
		try {
			let userUpdate = await User.findById(req.params.id);
			User.uploadedAvatar(req, res, function (err) {
				if (err) {
					console.log("******Multer" + err);
				}
				// console.log(req.file);
				userUpdate.name = req.body.name;
				userUpdate.email = req.body.email;

				if (req.file) {
					//check if user already have the avatar with then or not
					//if present then i remove avatar and uploaded a new one
					if(user.avatar){
						//true then delete the avatar
						//for deleting we need fs and path modules
						fs.unlinkSync(path.join(__dirname,'..',user.avatar));
					}

					userUpdate.avatar = User.avatarPath + "/" + req.file.filename;
				}
				userUpdate.save();
				return res.redirect("back");
			});
		} catch (e) {
			req.flash("err", e);
			return res.redirect("back");
		}
	} else {
		req.flash("err", "Unauthorized");
		return res.status(401).send("Unauthorized");
	}
};

// Sign Up render
//for the render from backend we fetching
//the data from the view file through the ejs
module.exports.signUp = async function (req, res) {
	// if they already signUP so go to profile page
	if (req.isAuthenticated()) {
		return await res.redirect("/users/profile");
	}

	return await res.render("user_sign_up", {
		title: "CodeTalk || Sign Up",
	});
};

// Sign In render
module.exports.signIn = async function (req, res) {
	// if they already sign in so go to profile page
	if (req.isAuthenticated()) {
		return await res.redirect("/users/profile");
	}

	return await res.render("user_sign_in", {
		title: "Code Talk | Sign In",
	});
};

//get the signUp data create for playing with signIn data
// module.exports.create = function (req, res) {
//     //todo later
// 	//1 check is password and confirm password is equal or not
// 	if(req.body.password != req.body.confirmPassword){
// 		return res.redirect('back');//form where it came
// 	}

// 	User.findOne({email:req.body.email},function(err, user){
// 		try{

// 			if(err){
// 				console.log(`error in finding the user signing up`);
// 				return;
// 			}

// 			//if user is not found then create user
// 			 if(!user){
// 				 User.create(req.body,function(err,user){
// 					if(err){
// 						console.log(`creating user while signIN up`);
// 						return;
// 					}
// 					return res.redirect('/users/sign-in');///users/sign-in this is going the router
// 				})
// 			 }else{
// 				return res.redirect('back')
// 			 }

// 			 //now if user is already present

// 		}catch(err){
// 			console.log(err);
// 		}
// 	})
// }

module.exports.create = async function (req, res) {
	try {
		//sign up page
		// 1. Check if password and confirmPassword are equal
		if (req.body.password != req.body.confirm_password) {
			return res.redirect("back");
		}

		// 2. Check if the user already exists
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			// 3. Create the user
			const createdUser = await User.create(req.body);
			return res.redirect("/users/sign-in");
		} else {
			return res.redirect("back");
		}
	} catch (error) {
		console.log(error);
		return res.redirect("back");
	}
};

//now we well deal with create-session playing with signUp data
//sign in and create a session for the user
module.exports.createSession = async function (req, res) {
	//todo Later
	try {
		await req.flash("success", "Logged in Successfully");
		return await res.redirect("/");
	} catch (error) {
		console.log(error);
	}
};

//
// module.exports.destroySession = function (req, res) {
// 	//before redirecting we need to signOut
// 	 req.logout();
// 	 req.flash('success','Yor are LogOut Successfully');
// 	return res.redirect("/");

// };
// module.exports.destroySession = async function (req, res, next) {
// 	try {
// 	  await new Promise(req.logout);
// 	  req.flash('success', 'You are LogOut Successfully');
// 	  res.redirect("/");
// 	} catch (err) {
// 	  next(err);
// 	}
//   };

// module.exports.logoutUser = async function (req, res, next) {
// 	try {
// 		await req.logout();
// 		req.flash("success", "You have been logged out successfully");
// 	} catch (err) {
// 		console.error(err);
// 		req.flash("error", "An error occurred while logging out");
// 		return next();
// 	} finally {
// 		res.redirect("/");
// 	}
// };

// module.exports.destroySession = async function (req, res) {
// 	try {
// 		// before redirecting we need to signOut
// 		await req.logout();
// 		req.flash('success', 'You are LogOut Successfully');
// 		return res.redirect("/");
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

module.exports.destroySession = function (req, res) {
	// before redirecting we need to signOut
	req.logout(function (err) {
		if (err) {
			console.error(err);
			return;
		}
		req.flash("success", "You are LogOut Successfully");
		return res.redirect("/");
	});
};
