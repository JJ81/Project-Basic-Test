const mysql = require('mysql');
const config = require('../secret/db_info').local;

module.exports = () => {
	return {
		init: () => {
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

		test_open: (conn) => {
			conn.connect((err) => {
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