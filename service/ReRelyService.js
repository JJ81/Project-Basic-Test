/**
 * Created by cheese on 2017. 1. 24..
 */
const
	mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	QUERY = require('../database/query'),
	ReReply = {};

ReReply.Create = (info, callback) => {
	connection.query(QUERY.ReReply.Create,
		[
			info.video_id,
			info.comment,
			info.comment_id,
			info.layer,
			info.user_id
		],
		(err, rows) => {
			if(!err){
				callback(null, rows);
			}else{
				callback(err, null);
				console.error(err);
			}
		});
};

ReReply.ReadById = (info, callback) => {
	connection.query(QUERY.ReReply.ReadById,
		[info.user_id, info.re_reply_id],
		(err, rows) => {
			if(!err){
				callback(null, rows);
			}else{
				callback(err, null);
				console.error(err);
			}
		});
};

ReReply.UpdateById = (info, callback) => {
	connection.query(QUERY.ReReply.UpdateById,
		[
			info.comment,
			info.re_reply_id,
			info.user_id
		],
		(err, rows) => {
			if(!err){
				callback(null, rows);
			}else{
				callback(err, null);
				console.error(err);
			}
		});
};

ReReply.DeleteById = (info, callback) => {
	connection.query(QUERY.ReReply.DeleteById,
		[
			info.re_reply_id,
			info.user_id
		],
		(err, rows) => {
			if(!err){
				callback(null, rows);
			}else{
				callback(err, null);
				console.error(err);
			}
		});
};

ReReply.GetList = (info, callback) => {
	connection.query(QUERY.ReReply.GetListByVideoID,
		[
			info.video_id,
			info.offset,
			info.size
		],
		(err, rows) => {
			if(!err){
				callback(null, rows);
			}else{
				callback(err, null);
			}
		});
};

module.exports = ReReply;
