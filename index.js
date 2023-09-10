const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const express = require("express");
const env = require("./config/environment");
const logger = require("morgan");


const path = require("path");
const cookieParser = require("cookie-parser"); //this is plug in for storing cookies
const app = express(); //for server start
require('./config/view-helpers')(app);//this is call for view-helper
//define port
const port = 8000;
//express-ejs-layouts is a middleware for the Express web application framework
//that allows you to use layouts in your views using the EJS template engine.
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");

//used for session cookies...................
// express-session is a popular middleware module for the Express web framework in Node.js.
// It provides session management capabilities to web applications by
// maintaining session state on the server-side and associating a unique session ID with each client.

const session = require("express-session");
const passport = require("passport"); //call passportJs
const passportLocal = require("./config/passport_local_strategy");

//making the passportJwt for authentication without cookies
//importing the config folder which handle the passportJWT
const passportJwt = require("./config/passport-jwt-strategy");

//google authentication
const passportGoogle = require("./config/passport-google-oauth2-strategy");

//this is for the setting for the page that after refresh then also we still in signIn out page
//using session cookies
const MongoStore = require("connect-mongo");

//SCSS/SASS FILE required
const sassMiddleware = require("node-sass-middleware");

//now need to show some notification the user connect-flash
const flash = require("connect-flash");

//now we need to require this FlashMsg so we use middleware
//flashMiddleware.js
const customMiddleware = require("./config/flashMiddleware");

//setup the chat server to be  used  with socket.io
const chatServer = require("http").createServer(app); //server create for socket
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log(`chat server is listing on the port 5000`);

// const path = require('path');

//need to put into some setting
// app.use(
// 	sassMiddleware({
// 		src: "./assets/scss",
// 		dest: "./assets/css",
// 		debug: true,
// 		outputStyle: "extended",
// 		prefix: "/css",
// 	})
// );
//deployment
//we don't want to run everyTime in production MODE,so we did...
if(env.name == 'development'){
	app.use(
		sassMiddleware({
			src: path.join(__dirname,env.asset_path,'scss'),
			dest: path.join(__dirname,env.asset_path,'css'),
			debug: true,
			outputStyle: "extended",
			prefix: "/css",
		})
	);
}


//middleWare
app.use(express.urlencoded({extended: false}));
//need to set cookieParser
app.use(cookieParser());

// app.use(express.static('./assets'));
app.use(express.static(path.join(__dirname, env.asset_path)));
// app.use(express.static(path.join(__dirname, "./assets")));

//we have use this for path should ce available for the browser
//find the folder using express.static
// index/codetalk.uploads
//make the uploaded path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));


//morgan and production logic
app.use(logger(env.morgan.mode,env.morgan.options));


app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// //use express router coming from router
// //fetching from router
// // "/" mean home page
// app.use("/", require("./routes/"));

//setup the view engines
//needs to install ejs for look
app.set("view engine", "ejs");
app.set("views", "./views");

const store = MongoStore.create(
	{
		mongoUrl: "mongodb://127.0.0.1:27017/tester",
		autoRemove: "disabled",
	},

	async (err) => {
		await console.log(err || "connection is connected in mongoes ok");
	}
);

//middleware for the  passportJs Encrypted file converted
app.use(
	session({
		name: "CodeTalk",
		//alter todo change
		secret: env.session_cookie_key,
		// secret: "anything",
		saveUninitialized: false,
		resave: false,
		cookies: {
			maxAge: 1000 * 60 * 100,
		},
		store: store,
	})
);

//middleware for passportJs initialization/session
app.use(passport.initialize());
app.use(passport.session());

//call the function as middleware
//and user where set in the locals
//user should access able in views
app.use(passport.setAuthenticatedUser);

//we use here of flash-notification
//it will store the flashMsg into the cookies so we write here ...
app.use(flash());
//use customMiddleware
app.use(customMiddleware.setFlash);

//use express router coming from router
//fetching from router
// "/" mean home page
app.use("/", require("./routes/"));

//start you server from here
app.listen(port, (err) => {
	if (err) {
		console.log("TRY again...", err);
		//interpolation learn
		console.log(`Error is running the server: ${err}`);
	}

	console.log(`${port} ${env.name} Server looking Cool...🦄 🐢 🙆...`);
});

// console.log(process.env.NAME);
