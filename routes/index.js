const express = require('express');
const router = express.Router();
const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const async = require('async');
const QUERY = require('../database/query');
const JSON = require('JSON');

require('../database/redis')(router, 'local'); // redis
require('../helpers/helpers');

const axios = require('axios');
const request = require('request');
const STATIC_URL = 'http://static.holdemclub.tv/';

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({extended:false});


passport.serializeUser((user, done) => {
	console.log('Serialize');
	console.log(user);
	done(null, user);
});

passport.deserializeUser((user, done) => {
	console.log('De-serialize');
	console.log(user);
	done(null, user);
});

var isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
};

passport.use(new LocalStrategy({
	usernameField: 'user_id',
	passwordField: 'password',
	passReqToCallback: true
}, (req, user, password, done) => {
	connection.query(QUERY.USER.Login, [user], (err, data) => {
		if (err) {
			console.error(err);
			return done(null, false);
		} else {

			if(data.length === 0){
				console.log('username is not exist.');
				return done(null, null, {'message' : 'Username is not exist.'});
			}

			if (data.length === 1) {
				if (!bcrypt.compareSync(password, data[0].password)) {
					console.log('password is not matched.');
					return done(null, false, {'message' : 'Password is not matched.'});
				} else {

					return done(null, {
						'username' : data[0].user_id,
						'nickname' : data[0].nickname,
						'market_code' : data[0].market_code
					});
				}
			} else {
				console.log('Account is duplicated.');
				return done(null, false, {message : 'Your account is duplicated.'});
			}
		}
	});
}
));

router.get('/login', function (req, res) {
	'use strict';

	let
		msg = '',
		flash_msg = req.flash(); // 캐싱을 해두지 않으면 조건에 따라서 플래시 모듈에 저장된 메시지가 사라진다.

	try{
		if(flash_msg.error.length > 0){
			console.log('message');
			console.log(flash_msg);
			msg = flash_msg.error.pop();
		}
	}catch(e){
		console.error(e);
	}

	if (req.user == null) {
		res.render('login', {
			current_path: 'login',
			title: PROJ_TITLE + ', 로그인',
			msg
		});
	} else {
		res.redirect('/');
	}
});

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: true
}), function (req, res) {
	res.redirect('/');
});

router.get('/logout', isAuthenticated, (req, res) => {
	req.logout();
	res.redirect('/');
});


/**
 * 메인 페이지
 */

// todo config 파일로 이동시키고 서버실행시 변경이 될 수 있도록 설정한다.
const HOST_INFO = {
	LOCAL : 'http://localhost:3002/api/',
	DEV : 'http://beta.holdemclub.tv/api/',
	REAL : 'http://holdemclub.tv/api/',
	VERSION : 'v2'
};

const HOST = `${HOST_INFO.LOCAL}${HOST_INFO.VERSION}`;
// console.log(HOST);

router.get('/', (req, res) => {
	'use strict';

	async.parallel(
		[
			(cb) => { // 방송중
				request.get(`${HOST}/broadcast/live`, (err, res, body) => {
					if(!err && res.statusCode == 200){
						// console.log(typeof body);
						// console.log(body);
						// console.log(body.success);

						let _body = JSON.parse(body);

						if(_body.success){
							cb(null, _body);
						}else{
							console.error('[live] success status is false');
							cb(null, null);
						}
					}else{
						cb(err, null);
						console.error(err);
					}
				});
			},
			(cb) => { // 좌측 채널 리스트
				request.get(`${HOST}/navigation/channel/list`, (err, res, body)=>{
					let _body = JSON.parse(body);
					if(!err && res.statusCode == 200){
						if(_body.success){
							cb(null, _body);
						}else{
							console.error('[navi] success status is false');
							cb('Navigation', null);
						}
					}else{
						cb(err, null);
						console.error(err);
					}
				});
			},
			(cb) => { // 최신 업데이트 비디오
				request.get(`${HOST}/video/recent/list?size=3&offset=0`, (err, res, body)  => {
					let _body  = JSON.parse(body);
					if(!err && res.statusCode == 200){
						if(_body.success){
							cb(null, _body);
						}else{
							cb('Video', null);
						}
					}else{
						console.error('[video] recent 3 videos');
						cb(err, null);
					}
				});
			},
			(cb) => { // 추천 채널 리스트
				request.get(`${HOST}/navigation/recommend/list`, (err, res, body) => {
					let _body  = JSON.parse(body);
					if(!err && res.statusCode == 200){
						if(_body.success){
							cb(null, _body);
						}else{
							cb('Recom', null);
						}
					}else{
						console.error('[Recom] ');
						cb(err, null);
					}
				});
			},
			(cb) => { // 뉴스 가져오기
				request.get(`${HOST}/news/list`, (err, res, body) => {
					let _body  = JSON.parse(body);
					if(!err && res.statusCode == 200){
						if(_body.success){
							cb(null, _body);
						}else{
							cb('News', null);
						}
					}else{
						console.error('[Recom] ');
						cb(err, null);
					}
				});
			}
		], (err, result) => {
		if (!err) {
			res.render('index', {
				current_path: 'INDEX',
				static : STATIC_URL,
				title: PROJ_TITLE,
				loggedIn: req.user,
				live : result[0].result,
				channels : result[1].result,
				videos : result[2].result,
				recom : result[3].result,
				news : result[4].result
			});
		} else {
			console.error(err);
			throw new Error(err);
		}
	});
});

// TODO 모든 라우터에서 항상 추춴방송, 전체 채널, 방송 여부에 대한 데이터를 항상 데이터를 가져와야 한다


router.get('/event', (req, res) => {
	'use strict';

	// 임시로 100개의 이벤트 리스트를 가져온다.
	request.get(`${HOST}/event/list?offset=0&size=100`, (err, response, body) => {
		let _body  = JSON.parse(body);
		if(!err && response.statusCode == 200){
			if(_body.success){
				res.render('event', {
					current_path: 'EVENT',
					static : STATIC_URL,
					title: PROJ_TITLE,
					loggedIn: req.user,
					list : _body.result
				});
			}else{
				console.error(err);
				throw new Error(err);
			}
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

// 이벤트 결과 페이지
router.get('/event/:id/result', (req, res) => {
	'use strict';

	request.get(`${HOST}/event/result/${req.params.id}`, (err, response, body) => {
		let _body  = JSON.parse(body);
		if(!err && response.statusCode == 200){
			if(_body.success){
				res.render('event_result', {
					current_path: 'EVENT',
					static : STATIC_URL,
					title: PROJ_TITLE,
					loggedIn: req.user,
					result : _body.result
				});
			}else{
				console.error(err);
				throw new Error(err);
			}
		}else{
			console.error(err);
			throw new Error(err);
		}
	});
});

/**
 * 진행중인 혹은 진행이 되기 전 이벤트에 대한 정보 페이지
 */
router.get('/event/:ref_id/information', (req, res) => {
	'use strict';

	async.parallel(
		[
			(cb) => {
				request.get(`${HOST}/event/vote/question/${req.params.ref_id}`, (err, response, body) => {
					if(!err && response.statusCode == 200){
						let _body = JSON.parse(body);
						if(_body.success){
							cb(null, _body);
						}else{
							console.error('[vote | question] success status is false');
							cb(null, null);
						}
					}else{
						cb(err, null);
						console.error(err);
					}
				});
			},
			(cb) => {
				request.get(`${HOST}/event/vote/answer/${req.params.ref_id}`, (err, response, body) => {
					if(!err && response.statusCode == 200){
						let _body = JSON.parse(body);
						if(_body.success){
							cb(null, _body);
						}else{
							console.error('[vote | answer] success status is false');
							cb(null, null);
						}
					}else{
						cb(err, null);
						console.error(err);
					}
				});
			}
		],
		(err, result) => {
			if (!err) {
				res.render('event_details', {
					current_path: 'EVENT',
					static : STATIC_URL,
					title: PROJ_TITLE,
					loggedIn: req.user,
					question : result[0].result,
					answer : result[1].result
				});
			} else {
				console.error(err);
				throw new Error(err);
			}
		});
});

/**
 * 비디오 리스트 뷰
 */
router.get('/channel/:channel_id', (req, res) => {
	async.parallel(
		[
			// todo 네비게이션 데이터 가져오기

			// todo 비디오 리스트 가져오기
			(cb) => {
				axios.get(`${HOST}/video/list/${req.params.channel_id}`)
					.then((response)=>{
						cb(null, response);
						console.log(response);

					}).catch((error)=>{
						console.error(error);
						cb(error, null);
					});
			}
		],
		(err, result) => {
			if(!err){

				res.render('video_list', {
					current_path: 'VIDEOLIST',
					static : STATIC_URL,
					title: PROJ_TITLE,
					loggedIn: req.user,
					videos : result[0].data.result
				});
			}else{
				console.error(err);
				throw new Error(err);
			}
		});
});


/**
 * 비디오 뷰
 */
router.get('/channel/:channel_id/video/:video_id', (req, res) => {
	async.parallel(
		[
			(cb) => { // 비디오 리스트 가져오기
				axios.get(`${HOST}/video/list/${req.params.channel_id}`)
					.then((response)=>{
						cb(null, response);
						console.log(response);
					}).catch((error)=>{
						console.error(error);
						cb(error, null);
					});
			},
			(cb) => { // 비디오 가져오기
				axios.get(`${HOST}/video/${req.params.video_id}/information`)
					.then((response)=>{
						cb(null, response);
						console.log(response);
					}).catch((error)=>{
						console.error(error);
						cb(error, null);
					});
			}
		],
		(err, result) => {
			if(!err){
				res.render('video_view', {
					current_path: 'VIDEOVIEW',
					static : STATIC_URL,
					title: PROJ_TITLE,
					loggedIn: req.user,
					video : result[1].data.result,
					videos : result[0].data.result
				});
			}else{
				console.error(err);
				throw new Error(err);
			}
		});
});




// router.get('/test', (req, res) => {
// 	res.json({result: 'Hello World'});
// });

// router.get('/test/form', csrfProtection, (req, res) => {
// 	res.render('form', {
// 		title : PROJ_TITLE
// 		,csrfToken : req.csrfToken()
// 		// test : mysql_location // this is working!!
// 	});
// });

// router.post('/test/form/submit', parseForm, csrfProtection, (req, res) => {
// 	res.send('data is being processed');
// });

module.exports = router;