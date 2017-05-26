const
  mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	bcrypt = require('bcrypt'),
	QUERY = require('../database/query');

const UserService = {};

/**
 *
 * @param user_info
 * @param callback
 */
UserService.SignUp = (user_info, cb) => {
	connection.query(QUERY.USER.SignUp, user_info, (err, result) => {
		if(!err){
			cb(null, result);
		}else{
			cb(err, null);
			console.error(err);
		}
	});
};

/**
 * 최종 로그인 시간을 기록한다.
 * @param user_id
 * @param cb
 * @constructor
 */
UserService.RecordLoginTime = (user_id, cb) => {
	connection.query(QUERY.USER.RecordLoginTime, user_id, (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			cb(err, null);
			console.error(err);
		}
	});
};

// username 중복 검사
UserService.DuplicateByUserId= (user_id, callback) => {
	connection.query(QUERY.USER.DuplicateByUserId, user_id, (err, result)=>{
		if(!err){
			if(result.length === 0){ // 중복이 아닌 경우
				result.valid = true;
				callback(null, result);
			}else{ // 중복일 경우
				result.valid = false;
				callback(null, result);
			}
		}else{
			console.error(err);
			callback(err, null);
		}
	});
};

// nickname 중복 검사
UserService.duplicateByNickname = (nickname, callback) => {
	connection.query(QUERY.USER.DuplicateByNickname, nickname, (err, result)=>{
		if(!err){
			if(result.length === 0){
				result.valid = true;
				callback(null, result);
			}else{
				result.valid = false;
				callback(null, result);
			}
		}else{
			console.error(err);
			callback(err, null);
		}
	});
};

// 이메일 중복 검사
UserService.duplicateByEmail = (email, callback) => {
	connection.query(QUERY.USER.DuplicateByEmail, email, (err, result)=>{
		if(!err){
			if(result.length === 0){
				result.valid = true;
				callback(null, result);
			}else{
				result.valid = false;
				callback(null, result);
			}
		}else{
			console.error(err);
			callback(err, null);
		}
	});
};

UserService.getUserInfo = (user_info, callback) => {

	console.log(user_info);

	connection.query(QUERY.USER.GetInfo, [
		user_info.user_id,
		user_info.nickname
	], (err, result) => {
		if(!err){
			callback(null, result);
		}else{
			console.error(err);
			callback(err, null);
		}
	});
};


UserService.CheckPassword = (user_info, callback) => {
	connection.query(QUERY.USER.GetInfo,
		[
			user_info.user_id, user_info.nickname
		],
		(err, result) => {
			if(!err){
				if(result.length === 1){
					if(!bcrypt.compareSync(user_info.password, result[0].password)){
						result.valid = false;
					}else{
						result.valid = true;
					}
					callback(null, result);
				}else{
					callback('who are you?', null);
				}
			}else{
				callback(err, null);
			}
		});
};

UserService.ChangeEmail = (user_info, callback) => {
	connection.query(QUERY.USER.ChangeEmail,
		[
			user_info.email,
			user_info.user_id,
			user_info.nickname
		],
		(err, result) => {
			if(!err){
				callback(null, result);
			}else{
				callback(err, null);
			}
		});
};

UserService.ExistsMarketCode = (user_info, callback) => {
	connection.query(QUERY.USER.QueryMarketCode,
		[
			user_info.user_id,
			user_info.nickname
		],
		(err, result) => {
			if(!err){
				callback(null, result);
			}else{
				console.error(err);
				callback(err, null);
			}
		});
};

UserService.InsertMarketCode = (user_info, callback) => {
	connection.query(QUERY.USER.InsertMarketCode,
		[
			user_info.market_code,
			user_info.user_id,
			user_info.nickname
		],
		(err, result) => {
			if(!err){
				callback(null, result);
			}else{
				console.error(err);
				callback(err, null);
			}
		});
};

/**
 *
 * @param user_info
 * @param callback
 * @constructor
 */
UserService.UpdatePassword = (user_info, callback) => {
	connection.query(QUERY.USER.UpdatePassword,
		[
			bcrypt.hashSync(user_info.password, 10),
			user_info.user_id,
			user_info.nickname
		],
		(err, result) => {
			if(!err){
				callback(null, result);
			}else{
				console.error(err);
				callback(err, null);
			}
		});
};

/**
 * 닉네임과 이메일 정보를 통해서 유저의 아이디를 전달한다.
 * @param user_info
 * @param callback
 * @constructor
 */
UserService.UserWithNicknameAndEmail = (user_info, callback) => {
	connection.query(QUERY.USER.UserWithNicknameAndEmail,
		[
			user_info.nickname,
			user_info.email
		],
		(err, result) => {
			if(!err){
				callback(null, result);
			}else{
				console.error(err);
				callback(err, null);
			}
		});
};

UserService.UserWithUserIdAndEmail = (user_info, callback) => {
	connection.query(QUERY.USER.UserWithUserIdAndEmail,
		[
			user_info.user_id,
			user_info.email
		],
		(err, result) => {
			if(!err){
				callback(null, result);
			}else{
				console.error(err);
				callback(err, null);
			}
		});
};


UserService.StoreNewPassword= (user_info, callback) => {
	console.log('store to db');
	console.log(user_info);

	var _pass = bcrypt.hashSync(user_info.password, 10);
	connection.query(QUERY.USER.UpdateNewPassword,
		[ _pass, user_info.user_id ],
		(err, result) => {
			if(!err){
				callback(null, result);
			}else{
				callback(err, null);
			}
		});
};

/////////////////////////////////////
//////// 여기서부터 로그인 API관련 ////////
/////////////////////////////////////

/**
 *
 * @param connection
 * @param user_id
 * @param callback
 * @constructor
 */
UserService.DoLogin = (user_id, callback) => {
	connection.query(QUERY.USER.Login, [user_id], (err, result) => {
		if (!err) {
			callback(null, result);
		}else{
			console.error(err);
			callback(err, null);
		}
	});
};

/**
 *
 * @param user_id
 * @param callback
 * @constructor
 */
UserService.AddLoginFailedCount = (user_id, callback) => {
	connection.query(QUERY.USER.FailToLogin, [user_id], (err, result) => {
		if (!err) {
			callback(null, result);
		}else{
			console.error(err);
			callback(err, null);
		}
	});
};

/**
 *
 * @param connection
 * @param user_id
 * @param callback
 */
UserService.ClearFailedCount = (user_id, callback) => {
	connection.query(QUERY.USER.ClearFailedCount, [user_id], (err, result) => {
		if (!err) {
			callback(null, result);
		} else {
			console.error(err);
			callback(err, null);
		}
	});
};

/**
 *
 * @param connection
 * @param user_id
 * @param callback
 */
UserService.UpdateGameLog = (user_id, callback) => {
	connection.query(QUERY.USER.UpdateGameLog, [user_id], (err, result) => {
		if (!err) {
			callback(null, result);
		} else {
			console.error(err);
			callback(err, null);
		}
	});
};

UserService.UpdateLoginDate = (user_id, callback) => {
	connection.query(QUERY.USER.UpdateLoginDate, [user_id], (err, result) => {
		if (!err) {
			callback(null, result);
		} else {
			console.error(err);
			callback(err, null);
		}
	});
};

module.exports = UserService;