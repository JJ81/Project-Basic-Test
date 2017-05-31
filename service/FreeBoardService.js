const
	mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	QUERY = require('../database/query'),
	FreeBoard = {};


FreeBoard.List = (info, cb) => {
	'use strict';

	var size = parseInt(info.size);
	var offset = parseInt(size*(info.page-1));
	var end = offset + size;

	connection.query(QUERY.FREEBOARD.LIST,
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

FreeBoard.GetTotalCount = (cb) => {
	connection.query(QUERY.FREEBOARD.getTotalPage, (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			cb(err, null);
			console.error(err);
		}
	});
};

FreeBoard.CreateBoard = (info, cb) => {
	connection.query(QUERY.FREEBOARD.createContent, [
		info.title,
		info.user_id,
		info.content
	], (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			cb(err, null);
			console.error(err);
		}
	});
};

FreeBoard.UpdateBoard = (info, cb) => {
	connection.query(QUERY.FREEBOARD.updateContent, [
		info.title,
		info.content,
		info.id,
		info.user_id,
	], (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			cb(err, null);
			console.error(err);
		}
	});
};

FreeBoard.GetContent = (info, cb) => {
	connection.query(QUERY.FREEBOARD.GetContent,[info], (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			cb(err, null);
			console.error(err);
		}
	});
};

FreeBoard.GetCountById = (info, cb) => {
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

FreeBoard.DeleteBoardById = (info, cb) => {
	connection.query(QUERY.FREEBOARD.deleteContent,
		[
			info.id,
			info.user_id
		],
		(err, rows) => {
			if(!err){
				cb(null, rows);
			}else{
				cb(err, null);
				console.error(err);
			}
		});
};


FreeBoard.GetInfoById = (info, cb) => {
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

FreeBoard.GetReplyById = (info, cb) => {
	connection.query(QUERY.FREEBOARD.GetReplyById,
		[
			info.reply_id,
			info.parent_id,
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

FreeBoard.GetReplyListById = (info, cb) => {
	connection.query(QUERY.FREEBOARD.GetReplyListById,
		[info],
		(err, rows) => {
			if(!err){
				cb(null, rows);
			}else{
				cb(err, null);
				console.error(err);
			}
		});
};


FreeBoard.CreateReply = (info, cb) => {
	connection.query(QUERY.FREEBOARD.CreateReply,
		[
			info.content,
			info.user_id,
			info.reply_id
		],
		(err, rows) => {
			if(!err){
				cb(null, rows);
			}else{
				cb(err, null);
				console.error(err);
			}
		});
};

FreeBoard.DeleteReplyById = (info, cb) => {
	connection.query(QUERY.FREEBOARD.DeleteReplyById,
		[
			info.reply_id,
			info.parent_id,
			info.user_id
		],
		(err, rows) => {
			if(!err){
				cb(null, rows);
			}else{
				cb(err, null);
				console.error(err);
			}
		});
};

FreeBoard.UpdateReply = (info, cb) => {
	connection.query(QUERY.FREEBOARD.UpdateReply,
		[
			info.content,
			info.user_id,
			info.reply_id,
			info.parent_id
		],
		(err, rows) => {
			if(!err){
				cb(null, rows);
			}else{
				cb(err, null);
				console.error(err);
			}
		});
};

module.exports = FreeBoard;