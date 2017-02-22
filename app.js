const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

/*routes*/
const routes = require('./routes/index');
const api = require('./api/api');

const app = express();
const hbs = require('hbs');
const passport = require('passport');
const flash = require('connect-flash');
// 쿠키 기반 스토리지를 구현 하나의 세션키가 아닌 세션 전체를 쿠키에 직렬화한다
// 브라우저는 하나의 쿠키당 4096바이트 이상을 지원하도록 되어 있지만 한계를 초과하지 않도록 보장하려면 하나의 도메인당 4093바이트의 크기를 초과해서는 안된다
// 클라이언트에서 쿠키 데이터를 볼 수 있기 때문에 쿠키 데이터를 안전하게 모호하게 유지를 해야 할 경우 express-session을 선택하는 것이 더 나을 수 있다.
const cookieSession = require('cookie-session');
const helmet = require('helmet');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');
// hbs.registerPartials(__dirname + '/views/modal');
// hbs.registerPartials(__dirname + '/views/main');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'node_modules')));

// todo 무료 개방 TLS를 적용할 경우 아래 코드를 수정해야 한다
// var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour

// todo cookieSessio에서는 secret 설정은 어떻게 하는가?

app.use(cookieSession({
	name: 'holdemclubtv_session', // session
	keys: ['HC2.0', 'HoldemclubTV'],
	cookie: {
		secure: false // https를 통해서만 쿠키를 전송하도록 한다
		,httpOnly: false // 쿠키가 클라이언트 js가 아닌 httpd를 통해서만 전송이 되도록 하며 XSS 공격으로부터 보호할 수 있다
		,domain: 'holdemclub.tv' // 쿠키의 도메인 설정
		// expires: expiryDate // 지속적 쿠키에 대한 만기 일짜를 설정, 쿠키에 중요한 정보가 없으므로 로그인을 일단 유지하게 한다.
	}
}));

// helmet related configuration for security
app.use(helmet());
app.disable('x-powered-by'); // prevent from sending header info containing server's
app.use(flash());

// 정적 데이터를 받아올 때마다 세션을 뒤지는 현상(deserializeUser method is triggered multiple times by passport session )을 방지하기 위해서는 정적 데이터 로드를 먼저 해주는 편이 좋다.
app.use(passport.initialize());
app.use(passport.session()); // passport session is triggered, causing deserializeUser to be invoked
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


const allowCORS = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	(req.method === 'OPTIONS') ? res.send(200) : next();
};
app.use(allowCORS);



global.PROJ_TITLE = '홀덤클럽티비';

app.use('/', routes);
app.use('/api/v1/', api);
app.use('/api/v2/', api);


// 404응답은 오류로 인해 발생하는 것이 아니기에 오류 핸들러 미들웨어가 파악할 수 없다.
// catch 404 and forward to error handler
app.use((req, res, next) => {
	res.status(404);
	res.render('404', {
		current_path: '404 Error Page',
		title: PROJ_TITLE + 'ERROR PAGE',
		loggedIn: req.user
	});
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.render('500', {
			current_path: ' 500 Error Page',
			title: PROJ_TITLE + 'ERROR PAGE'
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.render('500', {
		current_path: '500 Error Page',
		title: PROJ_TITLE + 'ERROR PAGE'
	});
});

// Swifty Automatic Changing ENV.
// todo config 파일을 생성하여 아래의 설정을 공통으로 가져갈 수 있도록
if (app.get('env') === 'local'){
	global.mysql_location = 'local';
	global.redis_location = 'local';
}else if(app.get('env') === 'development'){
	global.redis_location = 'dev';
	global.mysql_location = 'dev';
}else if(app.get('env') === 'production'){
	global.mysql_location = 'real';
	global.redis_location = 'real';
}


module.exports = app;