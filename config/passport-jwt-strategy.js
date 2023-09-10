//working with  passport then need to require passportJs
const passport = require("passport");

//setting Strategy of the passportJWT
const JWTStrategy = require("passport-jwt").Strategy;

//a modules which help extract jwt from the header
const ExtractJwt = require("passport-jwt").ExtractJwt;

//now need to fetch or UserSchema //taken userSchema
const User = require("../models/user");


const env = require('./environment');

// let make a details setting..
// header is list of keys inside....
// authentication this also have lot of keys
// this keys know as Bearer which store token
let opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),//making token
	secretOrKey:env.jwt_secret_key,
};

//now i need to tell passport to that i am using JWT Strategy
// passport.use(
// 	new JWTStrategy(opts, function (jwtPayload, done) {
// 		//find the user information base on the jwtPayload
// 		
// 		const user = User.findById(jwtPayload._id, function call(err, user) {
// 			// error got
// 			if (err) {
// 				console.log(err);
// 				return;
// 			}
// 		});
// 		//user found
// 		if (user) {
// 			return done(null, user);
// 		} else {
// 			return done(null.false);
// 		}

// 	})
// );

//using  middleware
//now i need to tell passport to that i am using JWT Strategy
passport.use(
	//find the user information base on the jwtPayload
	//we store all details in the jwtPayloads in encrypted form
	new JWTStrategy(opts, async function (jwtPayload, done) {
		try {
			const user = await User.findById(jwtPayload._id);
			if (user) {
				//user found
				return done(null, user);
			} else {
				//user not found
				return done(null, false);
			}
		} catch (err) {
			//getting error
			console.log(err);
			return done(err, false);
		}
	})
);

module.exports = passport;
