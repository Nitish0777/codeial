//import the nodemailer
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const env = require('./environment');

//define transporter
//this is then one who send the emails
//this is tha path who define how the communication going to happen
// let transporter = nodemailer.createTransport({
// 	service: "gmail",
// 	host: "smtp.gmail.com",
// 	port: 587,
// 	secure: false,
// 	auth: {
// 		user: "monkcoder08@gmail.com",
// 		pass: "fpotaofqmcvcymqr",
// 	},
// });


let transporter = nodemailer.createTransport(env.smtp);


//relativePath form where the mail is send..
//this define when ever i send HTML email where file in views mailer
let renderTemplate = (data, relativePath) => {
	let mailHTML; //this store what html where send
	//render and showing the result
	ejs.renderFile(
		//where i place the template
		//this relativePath from where mail is called
		path.join(__dirname, "../views/mailers", relativePath),
		data,
		function (err, template) {
			//template is the compose of above two line
			if (err) {
				console.log(err, `error in rendering template`);
				return;
			}
			mailHTML = template;
		}
	);
	return mailHTML;
};

module.exports = {
	transporter: transporter,
	renderTemplate: renderTemplate,
};
