/**
 * Created by cheese on 2017. 1. 23..
 */
const
	UserService = {},
	QUERY = require('../database/query'),
	mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init();

mysql_dbc.test_open(connection);

/**
 *
 * @param connection
 * @param user_id
 * @param callback
 * @constructor
 */
UserService.DoLogin = (user_id, callback) => {
	connection.query(QUERY.USER.Login, user_id, (err, result) => {
		if (!err) {
			callback(null, result);
		}else{
			console.error(err);
			callback(err, null);
		}
	});
};

UserService.AddLoginFailedCount = (user_id, callback) => {
	connection.query(QUERY.USER.FailToLogin, user_id, (err, result) => {
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
	connection.query(QUERY.USER.ClearFailedCount, user_id, (err, result) => {
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
	connection.query(QUERY.USER.UpdateGameLog, user_id, (err, result) => {
		if (!err) {
			callback(null, result);
		} else {
			console.error(err);
			callback(err, null);
		}
	});
};

module.exports = UserService;

//
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
//
//
// User.signUp = (user_info, callback) => {
//
//     connection.query(QUERY.USER.SignUp, user_info, (err, result)=>{
//         if(!err){
//             callback(null, {success:true, msg: '회원가입을 완료했습니다.'});
//         }else{
//             callback(err, {success:false, msg: '회원가입을 실패했습니다. 다시시도해주세요'});
//         }
//     });
// };
//
//
// User.duplicateByUserId= (user_id, callback) => {
//
//     connection.query(QUERY.USER.DuplicateByUserId, user_id, (err, result)=>{
//         if(!err){
//             if(result.length === 0){
//                 callback(null, {success: true, msg: '사용 가능합니다.'});
//             }else{
//                 callback(null, {success: false, msg: '이미 사용중입니다.'})
//             }
//         }else{
//             callback(err, {success: false, msg: '다시 시도해주세요'});
//         }
//     });
// };
//
// User.duplicateByNickname = (nickname, callback) => {
//
//     connection.query(QUERY.USER.DuplicateByNickname, nickname, (err, result)=>{
//         if(!err){
//             if(result.length === 0){
//                 callback(null, {success: true, msg: '사용 가능합니다.'});
//             }else{
//                 callback(null, {success: false, msg: '이미 사용중입니다.'})
//             }
//         }else{
//             callback(err, {success: false, msg: '다시 시도해주세요'});
//         }
//     });
// };
//
//
// User.duplicateByEmail = (email, callback) => {
//
//     connection.query(QUERY.USER.DuplicateByEmail, email, (err, result)=>{
//         if(!err){
//             if(result.length === 0){
//                 callback(null, {success: true, msg: '사용 가능합니다.'});
//             }else{
//                 callback(null, {success: false, msg: '이미 사용중입니다.'});
//             }
//         }else{
//             callback(err, {success: false, msg: '다시 시도해주세요'});
//         }
//     });
// };

