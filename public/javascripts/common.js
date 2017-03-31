/**
 * Created by yijaejun on 14/12/2016.
 */

'use strict';

define(
	[

	], function () {

	var utils = utils || {};

	utils.isMobile = function () {
		if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) {
			return true;
		} else {
			return false;
		}
	};


	utils.dateFormatter = function(date){
		var d = new Date(date);
		return d.getFullYear() + '-' +(d.getMonth() + 1) + '-' + d.getDate();
	};

	utils.numberFormatter = function(num){
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	utils.preventEnterEvent = function (target) {
		for(var i=0,size=target.length;i<size;i++){
			(function (_target) {
				_target.bind('keydown', function (e) {
					if(e.keyCode === 13){
						return;
					}
				});
			}(target[i]));
		}
	};

	return utils;
});