const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const hbs = require('hbs');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');

// INFO
// 쿠키 기반 스토리지를 구현 하나의 세션키가 아닌 세션 전체를 쿠키에 직렬화한다
// 브라우저는 하나의 쿠키당 4096바이트 이상을 지원하도록 되어 있지만 한계를 초과하지 않도록 보장하려면 하나의 도메인당 4093바이트의 크기를 초과해서는 안된다
// 클라이언트에서 쿠키 데이터를 볼 수 있기 때문에 쿠키 데이터를 안전하게 모호하게 유지를 해야 할 경우 express-session을 선택하는 것이 더 나을 수 있다.
const cookieSession = require('cookie-session');
const helmet = require('helmet');
/*routes*/
// const routes = require('./routes/index');
const api = require('./api/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(__dirname + '/public'));

// var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(cookieSession({
	name: 'hc_session',
	keys: ['HC2.0', 'HoldemclubTV', 'ghfejazmffjqdlwhgdk'], // this is secret key
	cookie: {
		secure: true // https를 통해서만 쿠키를 전송하도록 한다
		,httpOnly: false // 쿠키가 클라이언트 js가 아닌 httpd를 통해서만 전송이 되도록 하며 XSS 공격으로부터 보호할 수 있다
		,domain: 'holdemclub.tv' // 쿠키의 도메인 설정
		// expires: expiryDate // 지속적 쿠키에 대한 만기 일짜를 설정, 쿠키에 중요한 정보가 없으므로 로그인을 일단 유지하게 한다.
	}
}));

// helmet related configuration for security
app.use(helmet());
app.disable('x-powered-by');

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('combined')); // 로그 시간을 기준으로 +9시간을 더하면 로컬시간이다.

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser(require('./secret/db_info').secret)); // ?쿠키를 이와 같이 secret 키로 복호화한다면 암호화는 어디서?
app.use(methodOverride());

const allowCORS = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, api_key');
	(req.method === 'OPTIONS') ? res.send(200) : next();
};
app.use(allowCORS);
app.enable('trust proxy');


global.PROJ_TITLE = '홀덤클럽티비';

// const isMobile = require('is-mobile');

// app.use((req, res, next) => {
// 	res.locals.version  = '2.0.0';
// 	res.locals.isMobile = (isMobile(req) == 1) ? 1 : 0;
// 	next();
// });

// app.use('/', routes);
// app.use('/api/v1/', api);
// app.use('/api/v2/', api);

// api
app.use('/v1', api);
app.use('/v2', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	res.status(404);
	res.send('Holdemclubtv v2.0 (404)');
	// res.render('404', {
	// 	current_path: '404 Error Page',
	// 	title: PROJ_TITLE + 'ERROR PAGE',
	// 	loggedIn: req.user
	// });
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') !== 'production') {
	// app.use((err, req, res, next) => {
	// 	res.status(err.status || 500);
	// 	res.render('500', {
	// 		current_path: ' 500 Error Page',
	// 		title: PROJ_TITLE + 'ERROR PAGE'
	// 	});
	// });

	app.use(errorHandler());
}

if(app.get('env') === 'production'){
	// todo production으로 띄울 경우 에러가 발생했을 때 메일을 받을 수 있도록 변경할 것

// production error handler
// no stacktraces leaked to user
	app.use((err, req, res, next) => {
		console.log('From production');

		if(err.code === 'EBADCSRFTOKEN'){
			console.error(`CSRFERR : ${err}`);
		}

		// todo log@holdemclub.tv로 받을 수 있도록 한다.
		console.error(err.stack);
		res.send('Holdemclubtv v2.0 (500)');
		// res.render('500', {
		// 	current_path: '500 Error Page',
		// 	title: PROJ_TITLE + 'ERROR PAGE'
		// });

	});
}

module.exports = app;