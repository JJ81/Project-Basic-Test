/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(['jquery', 'common'], function ($, utils) {
	utils.preventEnterEvent.call(null, [
		$('input[name="usename"]'),
		$('input[name="nickname"]'),
		$('input[name="password"]'),
		$('input[name="re_password"]'),
		$('input[name="email"]'),
		$('input[name="market_code"]')
	]);
}); // end of func