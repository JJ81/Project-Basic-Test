/**
 * Created by cheese on 2017. 1. 23..
 */

const
	express = require('express'),
	router = express.Router(),
	bcrypt = require('bcrypt'),
	async = require('async'),
	CommonDAO = require('../RedisDAO/RedisDAO'),
	UTIL = require('../util/util'),
	UserService = require('../service/UserService'),
	Reply = require('../service/ReplyService'),
	ReReply = require('../service/ReRelyService');


/**
 * 회원가입
 * todo 테스트 코드 미작성
 */
router.post('/signup', (req, res) => {
	'use strict';

	let _obj = {
		user_id: req.body.user_id,
		nickname: req.body.nickname,
		password: req.body.password,
		email: req.body.email,
		market_code: req.body.market_code
	};

	if(_obj.password !== req.body.re_password) {
		res.json({
			success : false,
			msg : 'Password is not matched each other.'
		});
	}

	_obj.password = bcrypt.hashSync(req.body.password, 10);

	UserService.SignUp(_obj, (err, result) => {
		if (!err) {
			res.json({
				success : true,
				result : result
			});
		} else {
			res.json({
				success : false,
				msg : err
			});
		}
	});
});

/**
 * TODO 개발 진행중...
 * 회원가입시 유저 아이디 중복 검사
 *
 */
router.get('/users/duplication/user_id', (req, res) => {
	const user_id = req.query.user_id;

	UserService.DuplicateByUserId(user_id, (err, result) => {
		if (!err) {
			res.json(result);
		} else {
			res.json(result);
		}
	});
});

/**
 * 회원가입시 닉네임 중복 검사
 */
router.get('/users/duplication/nickname', (req, res) => {
	const nickname = req.query.nickname;

	UserService.duplicateByNickname(nickname, (err, result) => {
		if (!err) {
			res.json(result);
		} else {
			res.json(result);
		}
	});
});

/**
 * 회원가입시 이메일 중복 검사
 */
router.get('/users/duplication/email', (req, res) => {
	const email = req.query.email;

	UserService.duplicateByEmail(email, (err, result) => {
		if (!err) {
			res.json(result);
		} else {
			res.json(result);
		}
	});
});


/**
 * TODO 댓글과 덧글을 어떻게 구분할 것인가
 * TODO 댓글을 가져올 때 덧글을 어떻게 가져와서 보여줄 것인가? -> 일단 숨겨두고 버튼을 누르면 보일 수 있도록 하자.
 * TODO 덧글이 쓰여진 댓글을 지울 수 없도록 한다. 만약 지워야 한다면 그 내용이 출력만 되지 않도록 한다.
 * TODO 로그인을 할 후에 댓글에 대한 권한이 생긴다 로그인 처리에 대한 정보는 어떻게 할 것인가????
 * TODO API서버 세션에 가지고 있는 방법과 API를 라우팅하는 곳에서 처리하는 방법이 있다 이 둘중에 하나를 선택하여 처리할 수 있도록 한다.
 * TODO 혹은 항상 첫번쩨 리퀘스트 파라미터를 통해서 항상 로그인을 거처갈 수 있는 로직을 만들어서 구현하는 방법도 있겠다
 */


/**
 * 댓글 : 비디오에 대한 유저들의 반응을 적는 글
 * 덧글 : 댓글에 대한 반응
 * return
 * {
  "success": true,
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 264,
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 0
  }
}
 */
router.post('/reply/create', (req, res) => {
	const _obj = {
		video_id: req.body.video_id,
		user_id: req.body.user_id,
		comment: req.body.comment
	};

	Reply.Write(_obj, (err, rows) => {
		if (!err) {
			res.json({
				success : true,
				result : rows
			});
		} else {
			console.error(err);
			res.json({
				success : false,
				msg : err
			});
		}
	});
});

/**
 * 비디오 아이디로 댓글 가져오기
 */
router.get('/reply/list', (req, res) => {
	'use strict';

	let info = {
		video_id : req.query.video_id,
		offset : parseInt(req.query.offset),
		size : parseInt(req.query.size)
	};

	Reply.GetList(info, (err, rows) => {
		if(!err){
			res.json({
				success: true,
				result : rows
			});
		}else{
			console.error(err);
			res.json({
				success: false,
				msg : err
			});
		}
	});
});

/**
 * 개별 댓글 읽어오기
 */
router.get('/reply/:user_id/:reply_id', (req, res) => {
	'use strict';
	let info = {
		user_id : req.params.user_id,
		reply_id : req.params.reply_id
	};

	Reply.ReadById(info, (err, rows) => {
		if(!err){
			res.json({
				success: true,
				result : rows
			});
		}else{
			console.error(err);
			res.json({
				success: false,
				msg : err
			});
		}
	});
});

/**
 * 댓글 업데이트
 * @result
 * {
  "success": true,
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 0,
    "serverStatus": 2,
    "warningCount": 0,
    "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
    "protocol41": true,
    "changedRows": 1
  }
}
 */
router.put('/reply/update', (req, res) => {
	const _obj = {
		comment: req.body.comment,
		reply_id: req.body.reply_id,
		user_id: req.body.user_id
	};

	Reply.UpdateById(_obj, (err, rows) => {
		if(!err){
			res.json({
				success: true,
				result : rows
			});
		}else{
			console.error(err);
			res.json({
				success: false,
				msg : err
			});
		}
	});
});

/**
 * 댓글 지우기
 */
router.delete('/reply/delete', (req, res) => {
	const info = {
		reply_id : req.body.reply_id,
		user_id : req.body.user_id
	};

	Reply.DeleteById(info, (err, rows) => {
		if(!err){
			res.json({
				success: true,
				result : rows
			});
		}else{
			console.error(err);
			res.json({
				success: false,
				msg : err
			});
		}
	});
});

/**
 * 답글 생성
 */
router.post('/re-reply/create', (req, res) => {
	const _obj = {
		video_id: req.body.video_id,
		comment: req.body.comment,
		comment_id: req.body.comment_id,
		layer: req.body.layer,
		user_id: req.body.user_id
	};

	ReReply.Create(_obj, (err, rows) => {
		if (!err) {
			res.json({
				success : true,
				result : rows
			});
		} else {
			console.error(err);
			res.json({
				success : false,
				msg : err
			});
		}
	});
});

router.get('/re-reply/:user_id/:re_reply_id', (req, res) => {
	'use strict';

	let info = {
		user_id : req.params.user_id,
		re_reply_id : req.params.re_reply_id
	};

	ReReply.ReadById(info, (err, rows) => {
		if (!err) {
			res.json({
				success : true,
				result : rows
			});
		} else {
			console.error(err);
			res.json({
				success : false,
				msg : err
			});
		}
	});
});


router.put('/re-reply/update', (req, res) => {
	'use strict';

	let info = {
		comment: req.body.comment,
		re_reply_id: req.body.re_reply_id,
		user_id: req.body.user_id
	};

	console.log(info);

	ReReply.UpdateById(info, (err, rows) => {
		if(!err){
			res.json({
				success: true,
				result : rows
			});
		}else{
			console.error(err);
			res.json({
				success: false,
				msg : err
			});
		}
	});
});


router.delete('/re-reply/delete', (req, res) => {
	'use strict';

	let info = {
		re_reply_id : req.body.re_reply_id,
		user_id : req.body.user_id
	};

	ReReply.DeleteById(info, (err, rows) => {
		if(!err){
			res.json({
				success: true,
				result : rows
			});
		}else{
			console.error(err);
			res.json({
				success: false,
				msg : err
			});
		}
	});
});

router.get('/reply/list', (req, res) => {
	'use strict';

	let info = {
		video_id : req.query.video_id,
		offset : parseInt(req.query.offset),
		size : parseInt(req.query.size)
	};

	ReReply.GetList(info, (err, rows) => {
		if(!err){
			res.json({
				success: true,
				result : rows
			});
		}else{
			console.error(err);
			res.json({
				success: false,
				msg : err
			});
		}
	});
});



// TODO API_KEY를 제공할 수 있도록 한다?
// TODO 허용된 도메인에서만 호출이 될 수 있도록 설정한다.

const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');
const RedisDAO = require('../RedisDAO/RedisDAO');

/**
 * 라이브 방송 여부 체크
 */
router.get('/broadcast/live', (req, res) => {
	connection.query(QUERY.BROADCAST.GET, (err, rows) => {
		if(!err){
			res.json({
				success : true,
				result : rows
			});
		}else{
			res.json({
				success : false,
				error : err
			});
		}
	});
});


/**
 * 캐시한 데이터를 찾는 로직
 * 키 규칙 HC:NAVIGATION{API}
 * @param req
 * @param res
 * @param next
 */
const getCacheInRedis = (req, res, next) => {
	'use strict';
	let _REDIS_KEY = `HC:${req.originalUrl}`;

	console.info('Redis key : ' + _REDIS_KEY);
	RedisDAO.QueryDataByKeyName(req.cache, _REDIS_KEY, (err, cached) => {
		if(!err){
			if(cached !== null){
				res.json({
					success : true,
					result : JSON.parse(cached)
				});
			}else{
				next();
			}
		}else{
			next();
		}
	});
};

/**
 * 조회한 데이터 캐시하고 리턴
 * @param req
 * @param res
 * @param data
 */
var setCacheInRedis = (req, res, data) => {
	RedisDAO.CacheWithKeyName(req.cache, `HC:${req.originalUrl}`, // Key
		JSON.stringify(data), // Value
		(redis_err, redis_result) => { // callback
			if(!redis_err){
				console.info(redis_result);

				res.json({
					success : true,
					result : data
				});
			}else{
				console.error(redis_err);

				res.json({
					success : true,
					result : data
				});
			}
		});
};


/**
 * [Navigation] 채널 리스트
 */
router.get('/navigation/channel/list', getCacheInRedis, (req, res, next) => {
	connection.query(QUERY.NAVI.CHANNEL_ALL_ORDERED, (err, rows) => {
		if(!err){
			setCacheInRedis(req, res, rows);
		}else{
			res.json({
				success : false,
				msg : err
			});
		}
	});
});


/**
 * [Navigation] 추천 방송
 */
router.get('/navigation/recommend/list', getCacheInRedis, (req, res) => {
	connection.query(QUERY.NAVI.CHANNEL_RECOM, (err, rows) => {
		if(!err){
			setCacheInRedis(req, res, rows);
		}else{
			res.json({
				success : false,
				msg : err
			});
		}
	});
});


/**
 * 최근 업데이트된 비디오
 */
router.get('/video/recent/list', (req, res) => {
	'use strict';

	let _info = {
		offset : parseInt(req.query.offset),
		limit : parseInt(req.query.size)
	};

	connection.query(QUERY.CONTENTS.RECENT_VIDEO_LIST,
		[_info.offset, _info.limit],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success: false,
					msg : err
				});
			}
		});
});


/**
 * 홀클 대표 콘텐츠 가져오기
 */
router.get('/contents/representative/list', (req, res) => {
	connection.query(QUERY.CONTENTS.RepresentativeList,
		[parseInt(req.query.offset), parseInt(req.query.size)],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});


/**
 * 교육 콘텐츠 가져오기
 */
router.get('/contents/education/list', (req, res) => {
	connection.query(QUERY.CONTENTS.EducationList,
		[parseInt(req.query.offset), parseInt(req.query.size)],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});


/**
 * 요약 콘텐츠 가져오기
 */
router.get('/contents/summary/list', (req, res) => {
	connection.query(QUERY.CONTENTS.SummaryList,
		[parseInt(req.query.offset), parseInt(req.query.size)],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});


/**
 * 이벤트 리스트 가져오기
 */
router.get('/event/list', (req, res) => {
	'use strict';
	let _info = {
		offset : parseInt(req.query.offset),
		limit : parseInt(req.query.size)
	};
	connection.query(QUERY.EVENT.LIST, [_info.offset, _info.limit], (err, rows) => {
		if(!err){
			res.json({
				success : true,
				result : rows
			});
		}else{
			res.json({
				success : false,
				msg : err
			});
		}
	});
});

/**
 * 이벤트 결과 가져오기
 */
router.get('/event/result/:id', (req, res) => {
	console.log('!!## test');
	console.log(req.params.id);
	connection.query(QUERY.EVENT.RESULT, [req.params.id], (err, rows) => {
		if(!err){
			res.json({
				success : true,
				result : rows
			});
		}else{
			res.json({
				success : false,
				msg : err
			});
		}
	});
});

/**
 * 투표 질문 관련 데이터 출력
 */
router.get('/event/vote/question/:id', (req, res) => {
	'use strict';
	connection.query(QUERY.EVENT.VOTE_QUESTION,
		[req.params.id],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});

/**
 * 투표 결과에 대한 데이터 출력
 */
router.get('/event/vote/answer/:id', (req, res) => {
	'use strict';
	connection.query(QUERY.EVENT.VOTE_ANSWER,
		[req.params.id],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});

/**
 * 채널 아이디로 해당 채널 비디오 리스트 가져오기
 */
router.get('/video/list/:channel_id', (req, res) => {
	connection.query(QUERY.VIDEO.LIST,
		[
			req.params.channel_id
		],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});

/**
 * 각 채널에 대한 정보를 하나씩 가져온다.
 */
router.get('/channel/:channel_id/information', (req, res) => {
	connection.query(QUERY.CHANNEL.GetById,
		[req.params.channel_id],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});

/**
 * 비디오 아이디로 비디오 정보 가져오기
 */
router.get('/video/:video_id/information', (req, res) => {
	connection.query(QUERY.VIDEO.GetInfoByVideoId,
		[req.params.video_id],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});


/**
 * 최신 뉴스 {N}개 가져오기
 */
router.get('/news/list', (req, res) => {
	connection.query(QUERY.NEWS.LIST,
		[4],
		(err, rows) => {
			if(!err){
				res.json({
					success : true,
					result : rows
				});
			}else{
				res.json({
					success : false,
					msg : err
				});
			}
		});
});


module.exports = router;