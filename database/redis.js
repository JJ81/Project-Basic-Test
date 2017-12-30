/**
 * Created by yijaejun on 07/12/2016.
 */
var redis = require('redis');
var db_info = require('../secret/db_info');

module.exports = function (router, server){
	var server = server || "local";

	if(server === 'local'){
	// 	global.client = redis.createClient(db_info.redis.local.port, db_info.redis.local.host);
	// }else if(server === 'real'){
	// 	global.client = redis.createClient(db_info.redis.real.port, db_info.redis.real.host);
	}

	client.on("connect", function () {
		//console.log("Redis is connected ");
	});

	client.on("ready", function () {
		//console.log("Redis is ready");
	});

	client.on("error", function (err) {
		console.log("Redis error encountered : ", err);
	});

	client.on("end", function() {
		console.log("Redis connection closed");
	});

	client.monitor(function (err, res) {
		//console.log("Entering monitoring mode.");
		if(err){
			console.error(err);
		}else{
			console.info(res);
		}
	});

	client.on("monitor", function (time, args, raw_reply) {
		console.log(time + ": " + args + ' | ' + raw_reply);
	});

	router.use(function(req,res,next){
		req.cache = client;
		next();
	});

/*
  TODO check this out for REDIS
	Calling unref() will allow this program to exit immediately after the get command finishes.
	Otherwise the client would hang as long as the client-server connection is alive.
*/
	client.unref();
};