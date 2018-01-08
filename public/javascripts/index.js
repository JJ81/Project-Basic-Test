(function () {

	// 상단 슬라이더
	new Swiper('.spot_top_banner', {
		pagination: '.swiper-pagination',
		// nextButton: '.swiper-button-next',
		// prevButton: '.swiper-button-prev',
		slidesPerView: 1,
		paginationClickable: true,
		spaceBetween: 0,
		loop: true,
		centeredSlides: true,
		autoplay: 6000,
		autoplayDisableOnInteraction: false
	});


	// 하단 슬라이더
	new Swiper('.bottom-ban-review', {
		nextButton: '.post-button-next',
		prevButton: '.post-button-prev',
		slidesPerView: 1,
		paginationClickable: true,
		spaceBetween: 0,
		loop: true,
		centeredSlides: true,
		autoplay: 6000,
		autoplayDisableOnInteraction: false
	});

	// move text like marquee action
	$(function(){
		var timer = !1;
		var _Ticker = $('#T1').newsTicker();
		_Ticker.on('mouseenter',function(){
			var __self = this;
			timer = setTimeout(function(){
				__self.pauseTicker();
			}, 300);
		});
		_Ticker.on('mouseleave',function(){
			clearTimeout(timer);
			if(!timer) return !1;
			this.startTicker();
		});
	});

	// about wing banner
	var
		_win = $(window),
		tp_wing_left = $('.tp_wing_left'),
		tp_wing_right = $('.tp_wing_right'),
		gapToTop = $('.tp_wing_left').offset().top - 20, // 20 is proper space for user
		duration = 200;

	/**
	 * Get scroll's position
	 * @returns {*}
	 */
	function getScrollPos(){
		return _win.scrollTop();
	}

	_win.bind('scroll', function (e) {
		var pos = getScrollPos();

		if(pos >= gapToTop){
			setTimeout(function () {
				tp_wing_left.css({
					top : pos - gapToTop
				});
				tp_wing_right.css({
					top : pos - gapToTop
				});
			}, duration);
		}else{
			setTimeout(function (){
				tp_wing_left.css({
					top : 0
				});
				tp_wing_right.css({
					top : 0
				});
			}, duration);
		}
	});






}());



