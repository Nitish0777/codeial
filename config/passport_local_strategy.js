// const passport = require("passport");

// const LocalStrategy = require("passport-local").Strategy;

// //import User
// const User = require("../models/user");
// // const

// //authentication using passport js
// passport.use(
// new LocalStrategy(
// 	{
// 		usernameField: "email",
// 	},
// 	function (email, password, done) {
// 		//all three are passed on email password done
// 		//by the done req res all are handle
// 		User.findOne({ email: email }, function (err, user) {
// 			if (err) {
// 				console.log("this is the Error--> in passportJS");
// 				return done(err);
// 			}

// 			if (!user || user.password != password) {
// 				console.log(`Invalid Password`);
// 				return done(null, false);
// 			}
// 			return done(null, user);
// 		});
// 	}
// )
// );

// //serializing the user to decide which key is to be  kept in the cookies
// passport.serializeUser(function(user,done){
//     //we want to store user id in encrypted formate
//     //this will do it automatically into the cookies
//     done(null,user.id);
// })

// //deserializing the user from the key in the cookies
// passport.deserializeUser(function(id,done){
//     //find the user is present in the db
//     User.findById(id,function(err,user){
//         if (err) {
//             console.log("this is the Error--> in passportJS");
//             return done(err);
//         }

//         return done(null,user);
//     })
// })

// module.exports = passport;

const passport = require("passport");
//passport-local is a module for the passport authentication middleware in Node.js.
//It provides a strategy for authenticating users based on a username and password
//stored locally, typically in a database.
const LocalStrategy = require("passport-local").Strategy;

//import User
const User = require("../models/user");

//authentication using passport js
//To use passport-local, you need to create an instance of the LocalStrategy class
//and configure it with the necessary options, such as
//the field names for the username and password in the request body,
// and a callback function to verify the credentials.
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      //this allow us to first argument as req function call
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      try {
        const user = await User.findOne({ email: email });

        if (!user || user.password != password) {
          // console.log(`Invalid Password`);
          req.flash("error", `Invalid Username OR Password`);
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        // console.log("Error in passportJS", err);
        req.flash("error", `Error you got ${err}`);
        return done(err);
      }
    }
  )
);

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  //we want to store user id in encrypted format
  //this will do it automatically into the cookies
  done(null, user.id);
});

//deserializing the user from the key in the cookies
// passport.deserializeUser(function (id, done) {
// 	//find the user is present in the db
// 	User.findById(id, function (err, user) {
// 		if (err) {
// 			console.log("Error in passportJS", err);
// 			return done(err);
// 		}

// 		return done(null, user);
// 	});
// });

//deserializing the user from the key in the cookies
//taking information of the key from the cookies is deserialize
passport.deserializeUser(async function (id, done) {
  try {
    //find the user is present in the db
    const user = await User.findById(id);

    return done(null, user);
  } catch (err) {
    console.log("Error in passportJS", err);
    return done(err);
  }
});

//sending data to the current user to the view
//check user authentication
passport.checkAuthentication = (req, res, next) => {
  //first user sign-in then pass on the next() function->>>controller
  if (req.isAuthenticated()) {
    console.log("inside if");

    return next();
  }

  //if user is not sign in
  return res.redirect("/users/sign-in");
};

//set the user for views
passport.setAuthenticatedUser = async (req, res, next) => {
  if (req.isAuthenticated()) {
    //req.user contains the current signed in user from the session cookies
    //and we are sending this to the locals for the views
    //if user-sign-in then information of user store in cookies
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
