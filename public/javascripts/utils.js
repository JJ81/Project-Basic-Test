/**
 * Created by yijaejun on 14/12/2016.
 */
'use strict';
import $ from '../components/jquery/dist/jquery.min';

let utils = {};

utils.preventEnterEvent = (target) => {
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

utils.numberFormatter = (num) => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

utils.dateFormatter = (date) => {
	var d = new Date(date);
	return d.getFullYear() + '-' +(d.getMonth() + 1) + '-' + d.getDate();
};

utils.isMobile = () => {
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

(function (){
	// left nav controller

	var
		leftNavClose = $('.btnCloseNav'),
		sub_nav = $('.sub_nav'),
		nav_list = $('.nav_list');

	nav_list.bind('mouseenter', () => {
		sub_nav.removeClass('blind');
		return false;
	});


	leftNavClose.bind('click', () => {
		sub_nav.addClass('blind');
		return false;
	});


}());

export default utils;