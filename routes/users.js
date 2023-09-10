const express = require("express");

const router = express.Router();
//require the passportJs
const passport = require("passport");

const usersController = require("../controllers/users_controller");

// //map the usersController with users Router
// router.get("/profile",passport.checkAuthentication, usersController.profile);

//map the usersController with users Router with passport js
//we update this :id bcz we want to show all User list
// home/users/profile:id
router.get(
	"/profile/:id",
	passport.checkAuthentication,
	usersController.profile
);

//this is the update part
//here we update the user name and email if he want...
router.post(
	"/update/:id",
	passport.checkAuthentication,
	usersController.update
);

//show if the user sign-up notification coming from views
router.get("/sign-up", usersController.signUp);

//show if the user sign-in
router.get("/sign-in", usersController.signIn);

//need to track for the ejs form files
router.post("/create", usersController.create); //this is fetching from the user_controller.js

//this will be handle by the passportJS so middleware is in middle added as passport.authentication function
router.post(
	"/create-session",
	//if it true then goes to usersController otherwise redirect
	passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
	usersController.createSession
);

router.get("/sign-out", usersController.destroySession);

//here we define two routes
//for third party oauth using google oauth
//'/auth/google' this is given by the passportJS
//passport.authenticate('google',{}) first argument is Strategy & second one is Scope
//scope is the information which we are fetching
router.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

//2nd route
router.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
	usersController.createSession //this is redirecting to the home page..
);
//now finally we need to create a button for signIn

module.exports = router;
