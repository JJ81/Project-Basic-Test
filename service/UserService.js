/**
 * Created by cheese on 2017. 1. 23..
 */
const
  mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	bcrypt = require('bcrypt'),
	QUERY = require('../database/query');

const UserService = {};

// /**
//  *로그인 실패시 로그인 실패 카운트 증가(10이상시 계정 정지)
//  * @param user_id
//  * @param callback
//  */
// User.failToLogin = (user_id, callback) => {
// 	connection.query(QUERY.USER.FailToLogin, user_id, (err, result) => {
// 		if (!err) {
// 			callback(null, result);
// 		}else{
// 			callback(err, null);
// 		}
// 	});
// };
//
// /**
//  *로그인 성공시 로그인 실패 카운트 0으로 초기화
//  * @param user_id
//  * @param callback
//  */
// User.clearFailedCount = (user_id, callback) => {
// 	connection.query(QUERY.USER.ClearFailedCount, user_id, (err, result) => {
// 		if (!err) {
// 			callback(null, result);
// 		} else {
// 			callback(err, null);
// 		}
// 	});
// };
//
// /**
//  *게임 로그인시 log_access_game  로그 기록
//  * @param user_id
//  * @param callback
//  */
// User.updateGameLog = (user_id, callback) => {
// 	connection.query(QUERY.USER.UpdateGameLog, user_id, (err, result) => {
// 		if (!err) {
// 			callback(null, result);
// 		} else {
// 			callback(err, null);
// 		}
// 	});
// };

// User.login = (user_id, password, callback) => {
//     connection.query(QUERY.USER.Login, [user_id], (err, result) => {
//         if (err) {
//             callback(err, {success: false, msg: '문제가 발생했습니다. 잠시 후에 다시 시도해주세요.'});
//         } else {
//             if (result.length === 0) {
//                 callback(null, {success: false, msg: '등록된 계정이 없습니다.'});
//             } else {
//                 if (!bcrypt.compareSync(password, result[0].password)) {
//                     // 패스워드가 맞지 않을 경우, 로그인 실패 카운트를 올려준다
//
//                     if (result[0].login_fail_count >= 5 && result[0].login_fail_count < 10) {
//                         User.clearFailedCount(result[0].user_id, (err, result) => {
//                         });
//
//                         callback(null, {
//                             success: false,
//                             msg: '비밀번호가 맞지 않습니다. 로그인에 10번 이상 실패하면 계정이 정지될 수 있습니다. [현재실패횟수 : ' + parseInt(result[0].login_fail_count + 1) + ']'
//                         });
//
//                     } else if (result[0].login_fail_count >= 10) {
//
//                         callback(null, {
//                             success: false,
//                             msg: '계정이 정지되었습니다. [로그인실패횟수초과] info@intertoday.com으로 문의해주세요.',
//                         });
//
//                     } else {
//                         User.failToLogin(result[0].user_id, (err, result) => {
//                         });
//                         callback(null, {
//                             success: false,
//                             msg: '비밀번호가 맞지 않습니다. 다시 시도해주세요.',
//                         });
//                     }
//                 } else {
//                     // banned를 체크해보고 계정이 정지당한 유저인지 판단하여 전달한다
//                     if (result[0].banned) {
//                         callback(null, {
//                             success: false,
//                             msg: '임시로 정지당한 계정입니다. info@intertoday.com으로 문의해주세요.',
//                         });
//                     } else {
//                         // login_fail_count가 10회 이상일 경우 로그인을 할 수 없다.
//                         if (result[0].login_fail_count >= 10) {
//                             callback(null, {
//                                 success: false,
//                                 msg: '로그인을 10회이상 실패하셨습니다. info@intertoday.com으로 문의해주세요.',
//                             });
//                         } else {
//                             // 패스워드가 맞을 경우
//                             // 로그인에 성공했을 경우 로그인 실패 횟수를 0으로 초기화한다.
//                             User.clearFailedCount(result[0].user_id, (err, result) => {
//                             });
//                             callback(null, {
//                                 success: true,
//                                 user_info: {user_id: result[0].user_id, nickname: result[0].nickname},
//                                 msg: '로그인에 성공했습니다.',
//                             });
//                         }
//                     }
//                 }
//             }
//         }
//     });
// };

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


UserService.DuplicateByUserId= (user_id, callback) => {
    
    connection.query(QUERY.USER.DuplicateByUserId, user_id, (err, result)=>{
        if(!err){
            if(result.length === 0){
                callback(null, {success: true, msg: '사용 가능합니다.'});
            }else{
                callback(null, {success: false, msg: '이미 사용중입니다.'});
            }
        }else{
            callback(err, {success: false, msg: '다시 시도해주세요'});
        }
    });
};

UserService.duplicateByNickname = (nickname, callback) => {
    
    connection.query(QUERY.USER.DuplicateByNickname, nickname, (err, result)=>{
        if(!err){
            if(result.length === 0){
                callback(null, {success: true, msg: '사용 가능합니다.'});
            }else{
                callback(null, {success: false, msg: '이미 사용중입니다.'})
            }
        }else{
            callback(err, {success: false, msg: '다시 시도해주세요'});
        }
    });
};


UserService.duplicateByEmail = (email, callback) => {
    
    connection.query(QUERY.USER.DuplicateByEmail, email, (err, result)=>{
        if(!err){
            if(result.length === 0){
                callback(null, {success: true, msg: '사용 가능합니다.'});
            }else{
                callback(null, {success: false, msg: '이미 사용중입니다.'});
            }
        }else{
            callback(err, {success: false, msg: '다시 시도해주세요'});
        }
    });
};

module.exports = UserService;