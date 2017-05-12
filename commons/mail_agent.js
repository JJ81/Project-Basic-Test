const nodemailer = require('nodemailer');
const config = require('../secret/config');

module.exports = (msg) => { //  msg는 에러와 관련된 문구를 받는다.
	const user_name     = config.email.devops.user_name;
	const refresh_token = config.email.devops.refresh_token;
	const access_token  = config.email.devops.access_token;
	const client_id     = config.email.devops.client_id;
	const client_secret = config.email.devops.client_secret;
	const email_to = config.email.devops.user_name;



	let transporter = nodemailer
		.createTransport({
			service: 'Gmail',
			auth: {
				type: 'OAuth2',
				clientId: client_id,
				clientSecret: client_secret
			}
		});
	transporter.on('token', token => {
		console.log('A new access token was generated');
		console.log('User: %s', token.user);
		console.log('Access Token: %s', token.accessToken);
		console.log('Expires: %s', new Date(token.expires));
	});
	// setup e-mail data with unicode symbols
	let mailOptions = {
		from    : user_name, // sender address
		to      : email_to, // list of receivers
		subject : 'Game Login API Server Error Logs', // Subject line
		//text    : 'Warning!!', // plaintext body
		html    : `<h3>API server has 500 errors </h3><br /><p>${msg}</p> `, // html body

		auth : {
			user         : user_name,
			refreshToken : refresh_token,
			accessToken  : access_token,
			expires      : 0
		}
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
};