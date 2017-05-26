const
	mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	QUERY = require('../database/query'),
	QnaBoardService = {};


QnaBoardService.List = (info, cb) => {
	var size = parseInt(info.size);
	var offset = parseInt(size*(info.page-1));
	var end = offset + size;

	connection.query(QUERY.QNA.LIST,
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


QnaBoardService.GetTotalCount = (cb) => {
	connection.query(QUERY.QNA.getTotalPage, (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			cb(err, null);
			console.error(err);
		}
	});
};


module.exports = QnaBoardService;