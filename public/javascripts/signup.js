'use strict';

import $ from '../components/jquery/dist/jquery.min';
import utils from './utils';

utils.preventEnterEvent.call(null, [
	$('input[name="usename"]'),
	$('input[name="nickname"]'),
	$('input[name="password"]'),
	$('input[name="re_password"]'),
	$('input[name="email"]'),
	$('input[name="market_code"]')
]);