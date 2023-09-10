const User = require("../../../models/user");
const jwt = require("jsonwebtoken");

const env = require('../../../config/environment');


//to run this we need route that is store in routers/api/v1/users.js
module.exports.createSession = async function (req, res) {
	//what we have to do when ever user name and password we receive
	//we need to find that user and generate json webToken corresponding to that user

	try {
		
		let user = await User.findOne({ email: req.body.email });

        //if user not found or not match the password
		if (!user || user.password != req.body.password) {
			//if password not match
			return await res.json(422, {
                message:'Invalid username or password!'
            });
		}
        //if we found the user
        return  await res.json(200,{
            message:'Sign in Successfully,here is your token,please keep it safe',
            data:{
                //Converting the user into the json
                //user.toJSON() this part get encrypted.. then header and signature
				//every time when i create a token it expire in 10sec..
                token:jwt.sign(user.toJSON(),env.jwt_secret_key,{expiresIn:'100000'})
            }
        });

	} catch (error) {
		console.log(error);
		return await res.json(500, {
			message: "Internal server Error",
		});
	}
};
