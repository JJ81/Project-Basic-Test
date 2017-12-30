module.exports = (function () {
	return {
		'local': {
			host: '127.0.0.1',
			port: '3306',
			user: 'root',
			password: '',
			database: ''
		},
		// 'dev': {
		// 	host: 'dev-holdemclub.ccchnydnz10o.ap-northeast-2.rds.amazonaws.com',
		// 	port: '3306',
		// 	user: 'devholdemclub',
		// 	password: 'ghfejazmffjqdlwhgdk',
		// 	database: 'dev_holdemclub'
		// },
		// 'real': {
		// 	host: 'dev-holdemclub.ccchnydnz10o.ap-northeast-2.rds.amazonaws.com',
		// 	port: '3306',
		// 	user: 'devholdemclub',
		// 	password: 'ghfejazmffjqdlwhgdk',
		// 	database: 'dev_holdemclub'
		// },
		redis: {
			local: {
				host: '127.0.0.1',
				port: '6379'
			},
			// dev: {
			// 	host: 'holdemclub.coq3ns.ng.0001.apn2.cache.amazonaws.com',
			// 	port: '6379'
			// },
			// real: {
			// 	host: 'holdemclub.coq3ns.ng.0001.apn2.cache.amazonaws.com',
			// 	port: '6379'
			// }
		}
	}
})();