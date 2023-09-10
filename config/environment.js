const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

//this is the variable where the log will store
//E:/CODETALK/config/environment/
//E:/CODETALK/production_log.js
const logDirectory = path.join(__dirname, "../production_log");
//i have to find is production_log exist or not,not then create it
fs.existsSync(logDirectory || fs.mkdirSync(logDirectory));

const accessLogStream = rfs.createStream("access.log", {
	interval: "1d",
	path: logDirectory,
});

//i need to import them in environmental as well

const development = {
	name: "development",
	asset_path: "/assets",
	session_cookie_key: "anything",
	db: "codeTalk",
	smtp: {
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: "monkcoder08@gmail.com",
			pass: "fpotaofqmcvcymqr",
		},
	},
	google_client_id:
		"905541119790-8okqj9v9k8f4a2f3dvg81g16t14f4o3c.apps.googleusercontent.com",
	google_client_secret: "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",
	google_call_back_URL: "http://localhost:8000/users/auth/google/callback",
	jwt_secret_key: "CodeTalk",
	morgan:{
		mode:'dev',
		options:{stream: accessLogStream}
	}
};

//this is the one which as we can see that the key value store hidden in the development
//environment as we do store all this in different file and that file will be access to
//by this code so that no new developer has access to the key value as
// this is only access by production level
const production = {
	name: "production",
	asset_path: process.env.ASSET_PATH,
	session_cookie_key: process.env.SESSION_COOKIE_KEY,
	db: process.env.DB,
	smtp: {
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	},
	google_client_id: process.env.GOOGLE_CLIENT_ID,
	google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
	google_call_back_URL: process.env.GOOGLE_CALLBACK_URL,
	jwt_secret_key: process.env.JWT_SECRET,
	morgan:{
		mode:'combined',
		options:{stream: accessLogStream}
	}
};

module.exports =
	eval(process.env.NODE_ENV) == undefined
		? production
		: eval(process.env.NODE_ENV);

// if (process.env.NODE_ENV == "production") {
// 	module.exports = production;
// } else {
// 	module.exports = development;
// }
