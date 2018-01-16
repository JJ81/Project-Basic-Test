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
		// 	host: '',
		// 	port: '3306',
		// 	user: '',
		// 	password: '',
		// 	database: ''
		// },
		'real': {
			host: 'topsstock.co.kr',
			port: '3306',
			user: 'tops77',
			password: 'qwer3377!',
			database: 'tops77'
		},
		redis: {
			local: {
				host: '127.0.0.1',
				port: '6379'
			},
			// dev: {
			// 	host: '',
			// 	port: '6379'
			// },
			// real: {
			// 	host: '',
			// 	port: '6379'
			// }
		}
	}
})();