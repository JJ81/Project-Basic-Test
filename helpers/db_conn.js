const mysql = require('mysql');
const config = require('../secret/db_info').dev;


module.exports = function () {
	return {
		init: function () {
			return mysql.createConnection({
				host: config.host,
				port: config.port,
				user: config.user,
				password: config.password,
				database: config.database,
				connectionLimit: 20,
				waitForConnections: false,
				multipleStatements : true
			});
		},

		test_open: function (conn) {
			conn.connect(function (err) {
				if (err) {
					console.error('mysql connection error.');
					console.error(err);
					throw err;
				} else {
					console.info('mysql is connected successfully.');
				}
			});
		}
	};
};