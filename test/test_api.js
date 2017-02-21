'use strict';

// todo 모카 실행시 파라미터를 받아서 실행을 진행될 수 있도록 할 것 (영상 참고)
// todo --target=mobile (mobile, pc, api, admin) -> 예시

const assert = require('assert');
const request = require('request');
const expect = require('chai').expect;
const JSON = require('JSON');
const should = require('should');
const HOST = 'http://localhost:3002/';
const HOST_API = `${HOST}api/v2/`;

describe('[API 2.0] API CHECK LIST', () => {

	describe('Broadcast Signal', () => {
		it('/broadcast/live', (done) =>{
			request.get(`${HOST_API}broadcast/live`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});

	describe('[Navigation] channel list', () => {
		it('/navigation/channel/list', (done) => {
			request.get(`${HOST_API}navigation/channel/list`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});
	});


	describe('Navigation Recommend list', () => {
		it('/navigation/recommend/list', (done) => {
			request.get(`${HOST_API}navigation/recommend/list`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});
	});


	describe('Event', () => {
		it('/event/list', (done) => {
			request.get(`${HOST_API}event/list?offset=0&size=100`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Event Result', () => {
		it('/event/result/3', (done) => {
			request.get(`${HOST_API}event/result/3`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				expect(res.statusCode).to.equal(200);
				let _body = JSON.parse(body);
				expect(_body.result.length).to.not.equal(0);
				expect(_body.success).to.be.true;
				// console.log(body);
				done();
			});
		});
	});


	describe('Event on Vote Question', () => {
		it('/event/vote/question/:id', (done) => {
			request.get(`${HOST_API}event/vote/question/13`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				expect(res.statusCode).to.equal(200);
				let _body = JSON.parse(body);
				expect(_body.result.length).to.not.equal(0);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});

	describe('Event on Vote Answer', () => {
		it('/event/vote/answer/:id', (done) => {
			request.get(`${HOST_API}event/vote/answer/14`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				expect(res.statusCode).to.equal(200);
				let _body = JSON.parse(body);
				expect(_body.result.length).to.not.equal(0);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});
	});


	describe('Recent updated Video', () => {
		it('/video/recent/list?offset=0&size=4', (done) => {
			request.get(`${HOST_API}video/recent/list?offset=0&size=4`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});
	});


	describe('Representative Channel List', () => {
		it('/contents/representative/list?offset=0&size=4', (done) => {
			request.get(`${HOST_API}contents/representative/list?offset=0&size=4`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Education Video List', () => {
		it('/contents/education/list?offset=0&size=4', (done) => {
			request.get(`${HOST_API}contents/education/list?offset=0&size=4`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Summary Video List', () => {
		it('/contents/summary/list?offset=0&size=4', (done) => {
			request.get(`${HOST_API}contents/summary/list?offset=0&size=4`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Get Video List by Channel_id', () => {
		it('/video/list/:channel_id', (done) => {
			request.get(`${HOST_API}video/list/385bc900-90f7-11e6-876f-719554daeebf`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Get Channel info by its ID', () => {
		it('/channel/:channel_id/information', (done) => {
			request.get(`${HOST_API}channel/385bc900-90f7-11e6-876f-719554daeebf/information`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});


	describe('Get Video info by its ID', () => {
		it('/video/:video_id/information', (done) => {
			request.get(`${HOST_API}video/7475dfb0-90f8-11e6-8318-35085802b5fe/information`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				//console.info(body);
				done();
			});
		});
	});

	describe('Get News List', () => {
		it('/news/list', (done) => {
			request.get(`${HOST_API}news/list`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				expect(_body.result.length).to.not.equal(0);
				expect(_body.result.length).to.equal(4);
				//console.info(body);
				done();
			});
		});
	});


	describe('Get Reply List', () => {
		it('/reply/list/:video_id', (done) => {
			request.get(`${HOST_API}reply/list?video_id=297043e0-86d8-11e6-b591-0108467f781a&offset=0&size=1000`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				// console.info(body);
				done();
			});
		});
	});


	// 여기서부터 댓글관련 테스트 시작
	let reply_id = null;

	describe('Reply Test serialized', () => {
		let mockup_data = {
			video_id : '297043e0-86d8-11e6-b591-0108467f781a',
			user_id : 'player001',
			comment : 'REPLY TEST COMMENT'
		};
		// Create
		it('Create Reply Test', (done) => {
			request.post(`${HOST_API}reply/create`, {json : mockup_data}, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				expect(body).to.be.json;
				expect(res.statusCode).to.equal(200);
				expect(body.success).to.be.true;
				reply_id = body.result.insertId;
				console.log(`Created Reply : ${reply_id}`);
				done();
			});
		});

		it('Read Reply Test', (done) => {
			request.get(`${HOST_API}reply/${mockup_data.user_id}/${reply_id}`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(_body).to.be.json;
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				expect(_body.result[0].id).to.equal(reply_id);
				done();
			});
		});

		// Update
		it('Update Reply Test', (done) => {
			let update_data = {
				comment : 'REPLY TEST COMMENT is updated',
				reply_id : reply_id,
				user_id : 'player001'
			};
			request.put(`${HOST_API}reply/update`, {json : update_data}, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				expect(body).to.be.json;
				expect(res.statusCode).to.equal(200);
				expect(body.success).to.be.true;
				done();
			});
		});

		// Delete
		it('Delete Reply Test', (done) => {
			let delete_data = {
				reply_id,
				user_id : 'player001'
			};
			request.delete(`${HOST_API}reply/delete`, {json : delete_data}, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				expect(body).to.be.json;
				expect(res.statusCode).to.equal(200);
				expect(body.success).to.be.true;
				expect(body.result.affectedRows).to.equal(1);
				done();
			});
		});
	});

	// -- 댓글관련 테스트 종료


	// 덧글 혹은 답글 관련 테스트 시작
	let re_reply_id = null;
	// 덧글 혹은 답글 관련 테스트 시작
	describe('Re-Reply Test serialized', () => {
		let mockup_data = {
			video_id : '297043e0-86d8-11e6-b591-0108467f781a',
			comment : 'Re-reply create test',
			comment_id : '285', // id 참조값
			layer : '1', // 레이어를 순서대로 어디까지 입력을 해볼 수 있을까? 레이어 5까지?
			user_id : 'player001'
		};

		// Create
		it('Create ReReply Test', (done) => {
			request.post(`${HOST_API}re-reply/create`, {json : mockup_data}, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				expect(body).to.be.json; // 이 코드가 실제 json 형식을 검사하고 있는게 맞는가???
				expect(res.statusCode).to.equal(200);
				expect(body.success).to.be.true;
				re_reply_id = body.result.insertId;
				console.log(`Created Re-Reply : ${re_reply_id}`);
				done();
			});
		});

		// Read by Id
		it('Read ReReply Test by Id', (done) => {
			request.get(`${HOST_API}re-reply/${mockup_data.user_id}/${re_reply_id}`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(_body).to.be.json;
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				expect(_body.result[0].id).to.equal(re_reply_id);
				done();
			});
		});

		// Update by Id
		it('Update Re-Reply Test', (done) => {
			let update_data = {
				comment : 'Update Re-REPLY TEST. COMMENT is updated',
				re_reply_id : re_reply_id,
				user_id : 'player001'
			};
			request.put(`${HOST_API}re-reply/update`, {json : update_data}, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				expect(body).to.be.json;
				expect(res.statusCode).to.equal(200);
				expect(body.success).to.be.true;
				done();
			});
		});

		// Delete
		it('Delete Reply Test', (done) => {
			let delete_data = {
				re_reply_id,
				user_id : 'player001'
			};
			request.delete(`${HOST_API}re-reply/delete`, {json : delete_data}, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				expect(body).to.be.json;
				expect(res.statusCode).to.equal(200);
				expect(body.success).to.be.true;
				expect(body.result.affectedRows).to.equal(1);
				done();
			});
		});
	});

	describe('Get ReReply List', () => {
		it('/re-reply/list/:video_id', (done) => {
			request.get(`${HOST_API}reply/list?video_id=297043e0-86d8-11e6-b591-0108467f781a&offset=0&size=1000`, (err, res, body) => {
				if(err){
					console.error(err);
					throw err;
				}
				let _body = JSON.parse(body);
				expect(res.statusCode).to.equal(200);
				expect(_body.success).to.be.true;
				done();
			});
		});
	});

	// -- 덧글 혹은 답글 관련 테스트 종료



	
	// todo get으로 데이터가 리턴되는 형태는 스트링이기 때문에 json으로 파싱을 해줘야 한다 파싱을 하지 않아도 자동으로 처리되는 옵션이 있는지 확인해보자.




});