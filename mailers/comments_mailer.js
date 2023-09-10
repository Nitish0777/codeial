//import the nodemailer
const nodeMailer = require("../config/nodemailer");

//need to create a function that send mail
//this is another way of exporting
exports.newComment = (comment) => {
	// console.log(`inside the newComment mailer`, comment);

	//define mailer Template
	let htmlString = nodeMailer.renderTemplate(
		{ comment: comment },
		"/comments/new_comment.ejs"
	);

	//need to send the email
	nodeMailer.transporter.sendMail(
		{
			from: "monkcoder08@gmail.com",
			to: comment.user.email,
			subject: "New comment publish!",
			// html: "<h1>yes,you done it...comment now publish!</h1>",
			html: htmlString,
		},
		async (err, info) => {
			//info carry the information about the request that has been send
			if (err) {
				console.log(`error occurs in sending mail ${err}`);
				return;
			}
			// console.log(`mail deliver ${info}`);
			return;
		}
	);
};
