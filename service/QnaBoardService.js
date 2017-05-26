const
	mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	QUERY = require('../database/query'),
	NoticeBoard = {};


NoticeBoard.List = (info, cb) => {
	'use strict';

	var size = parseInt(info.size);
	var offset = parseInt(size*(info.page-1));
	var end = offset + size;

	connection.query(QUERY.NOTICE.LIST,
		[
			offset, end
		], (err, rows) =>{
			if(!err) {
				console.info(rows);
				cb(null, rows);
			}else{
				console.error(err);
				cb(err, null);
			}
		});
};

NoticeBoard.GetTotalCount = (cb) => {
	connection.query(QUERY.NOTICE.getTotalPage, (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			cb(err, null);
			console.error(err);
		}
	});
};


// NoticeBoard.CreateBoard = (info, cb) => {
// 	connection.query(QUERY.FREEBOARD.createContent, [
// 		info.title,
// 		info.user_id,
// 		info.content
// 	], (err, rows) => {
// 		if(!err){
// 			cb(null, rows);
// 		}else{
// 			cb(err, null);
// 			console.error(err);
// 		}
// 	});
// };
//
// NoticeBoard.UpdateBoard = (info, cb) => {
// 	connection.query(QUERY.FREEBOARD.updateContent, [
// 		info.title,
// 		info.content,
// 		info.id,
// 		info.user_id,
// 	], (err, rows) => {
// 		if(!err){
// 			cb(null, rows);
// 		}else{
// 			cb(err, null);
// 			console.error(err);
// 		}
// 	});
// };

NoticeBoard.GetContent = (info, cb) => {
	connection.query(QUERY.NOTICE.GetContent,[info], (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			cb(err, null);
			console.error(err);
		}
	});
};

NoticeBoard.GetCountById = (info, cb) => {
	connection.query(QUERY.FREEBOARD.GetCountById,
		[
			info.id,
			info.user_id
		], (err, rows) => {
			if(!err){
				cb(null, rows);
			}else{
				cb(err, null);
				console.error(err);
			}
		});
};

// NoticeBoard.DeleteBoardById = (info, cb) => {
// 	connection.query(QUERY.FREEBOARD.deleteContent,
// 		[
// 			info.id,
// 			info.user_id
// 		],
// 		(err, rows) => {
// 			if(!err){
// 				cb(null, rows);
// 			}else{
// 				cb(err, null);
// 				console.error(err);
// 			}
// 		});
// };


NoticeBoard.GetInfoById = (info, cb) => {
	connection.query(QUERY.FREEBOARD.GetInfoById,
		[
			info.id,
			info.user_id
		], (err, rows) => {
			if(!err){
				cb(null, rows);
			}else{
				cb(err, null);
				console.error(err);
			}
		});
};



module.exports = NoticeBoard;