/**
 * Created by yijaejun on 01/12/2016.
 */
'use strict';
require.config({
	map: {},
	paths: {
		jquery: ['/components/jquery/dist/jquery.min'],
		bootstrap : ['/components/bootstrap/dist/js/bootstrap.min'],
		jqueryCookie : ['/components/jquery.cookie/jquery.cookie'],
		jqueryValidate : ['/components/jquery-validation/dist/jquery.validate.min'],
		// lodash : ['/components/lodash/dist/lodash.min'],
		// fastclick : ['/components/fastclick/lib/fastclick'],
		// swiper : ['/components/swiper/dist/js/swiper.jquery'],
		common : ['/static/javascripts/common'],
		vue : ['/static//javascripts/vendor/vue.min'],
		//vue : ['https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.6/vue.min'],
		//videojs : ['http://vjs.zencdn.net/5.19.0/video'],
		videojs : ['/static/javascripts/vendor/videojs'],
		youtubejs : ['/static/javascripts/vendor/youtube.min']
	},
	shim: {
		jqueryValidate : ['jquery'],
		jqueryCookie : ['jquery'],
		//swiper : ['jquery'],
		videojs : ['jquery']
	}
});
