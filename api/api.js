/**
 * Created by cheese on 2017. 1. 23..
 */

const
	express = require('express'),
	router = express.Router(),
	bcrypt = require('bcrypt'),
	async = require('async'),
	UserService = require('../service/UserService'),
	sanitize = require('sanitize-html');


/**
 * @ 임시로 기존의 로그인 API를 업그레이드 하여 지원한다.
 *
 */
const LOGIN_ERROR_RESULT = require('../commons/error_interface');

router.post('/login', (req, res) => {
	'use strict';

	let
		user_id = sanitize(req.body.user_id.trim()),
		password = sanitize(req.body.password.trim());

	// 입력값에 대한 검사
	if(user_id === '' || password === ''){
		console.error(`[input error] user_id : ${user_id}`);
		res.status(400);
		res.json({
			status : res.statusCode,
			success: false,
			msg : '잘못된 접근입니다.',
			result : LOGIN_ERROR_RESULT.WRONG_ACCESS
		});
	}else{
		UserService.DoLogin(user_id, (err, data) => {
			if (err) {
				console.error(`[User : ${user_id}]' + ${err}`);
				res.status(500);
				res.json({
					'status': res.statusCode,
					'success': false,
					'msg': '내부 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.',
					'result': LOGIN_ERROR_RESULT.INTERNAL_ERROR
				});
			} else {
				// 검색결과 등록된 계정이 없을 경우
				if (data.length == 0) {
					console.info(`[User : ${user_id}] this account does not exist.`);
					res.status(401);
					res.json({
						'status': res.statusCode,
						'success': false,
						'msg': '등록된 계정이 없습니다.',
						'result': LOGIN_ERROR_RESULT.NO_ACCOUNT
					});
				}else if(data.length > 1){
					// 중복된 디비결과가 출력되었을 경우
					console.error(`[${user_id}] : this account might be duplicated`);
					res.status(401);
					res.json({
						'status': res.statusCode,
						'success': false,
						'msg': '알 수 없는 에러입니다.',
						'result': LOGIN_ERROR_RESULT.UNKNOWN_ERROR
					});
					// 검색 결과가 하나만 일치하는 경우
				} else {
					// 이용정지된 계정일 경우
					if(data[0].banned || data[0].login_fail_count >= 10){
						res.status(401);
						console.info(`[User : ${user_id}] This account is banned temporarily`);
						res.json({
							'status': 401,
							'success': false,
							'msg': '이용 정지된 계정입니다.',
							'result': LOGIN_ERROR_RESULT.BANNED
						});
					}else{ // 이용가능한 계정일 경우
						// 암호 일치 여부를 확인한다
						if (!bcrypt.compareSync(password, data[0].password)) {
							// 암호가 일치하지 않을 경우
							if(data[0].login_fail_count < 10){
								console.info(`[User : ${user_id}] Password does not match.`);

								// todo 로그인 실패 계산 수치 확인할 것
								UserService.AddLoginFailedCount(user_id, (err, result) => {
									if(err){
										console.error(`[${user_id}] : failed to add login failure`);
									}else{
										console.info(`[${user_id}] : completed to add login failure`);
									}
								});

								res.status(401);
								res.json({
									'status': res.statusCode,
									'success': false,
									'msg': '비밀번호가 맞지 않습니다. 로그인에 10번 이상 실패하면 계정이 정지될 수 있습니다. [현재실패횟수 : ' + parseInt(data[0].login_fail_count + 1) + ']',
									'result': LOGIN_ERROR_RESULT.LOGIN_FAILED_WARNING
								});
							}else{ // 10번 이상 실패한 경우
								console.info(`[User : ${user_id}] This account is banned because of login failure.`);
								res.status(401);
								res.json({
									'status': res.statusCode,
									'success': false,
									'msg': '로그인 10회 이상 실패로 인해서 정지된 계정입니다. ',
									'result': LOGIN_ERROR_RESULT.LOGIN_FAILED_EXCEED
								});
							}
						}else{
							// 암호가 일치할 경우
							async.parallel(
								[
									// // 로그인 실패 횟수를 0로 변경한다.
									function (cb) {
										UserService.ClearFailedCount(user_id, (err, rows) => {
											if(!err){
												cb(null, rows);
											}else{
												console.error(err);
												cb(err, null);
											}
										});
									},
									// // 이곳에서 로그인을 한 시간을 기록할 수 있도록 한다.
									function (cb) {
										UserService.UpdateGameLog(user_id, (err, rows) => {
											if(!err){
												cb(null, rows);
											}else{
												console.error(err);
												cb(err, null);
											}
										});
									},

									function (cb) {
										UserService.UpdateLoginDate(user_id, (err, rows) => {
											if(!err){
												cb(null, rows);
											}else{
												console.error(err);
												cb(err, null);
											}
										});
									}
								], (err, result) => {
								if(err){
									console.error(`[${user_id} / error on the result] ${result} (login part)`);
									console.error('[ERROR] 로그인 실패 횟수를 0으로 변경하고, 게임에 로그인을 한 시간을 기록하고, user테이블에도 마지막 로그인 시간을 기록한다. ');

									// send msg to email
									const mailer = require('./commons/mail_agent');
									mailer('[ERROR] 로그인 실패 횟수를 0으로 변경하고, 게임에 로그인을 한 시간을 기록하고, user테이블에도 마지막 로그인 시간을 기록한다. => ' + err);
								}

								console.info(`[User : ${user_id}] This account is loggined successfully.`);

								res.status(200);
								res.json({
									'status': res.statusCode,
									'success': true,
									'msg': '로그인에 성공했습니다.',
									'result': LOGIN_ERROR_RESULT.LOGIN_SUCCESS,
									'data': data
								});
							});
						}
					}
				}
			}
		});
	}
});



module.exports = router;