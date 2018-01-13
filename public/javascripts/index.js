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


	// 정회원 무료체험 및 결제문의
	var btnFreeExp = $('.btn-free-exp');
	btnFreeExp.bind('click', function (e) {
		e.preventDefault();
		alert('준비중입니다. 빠른 상담을 위해서 고객센터 1522-6619로 연락주시기 바랍니다.');
	});



	// vip 후기 작성
	var btn_write_review = $('.btn_write_review');
	btn_write_review.bind('click', function (e) {
		e.preventDefault();
		alert('준비중입니다.');
	});


	// 공증서 확인 팝업 준비중
	var btnViewApprovalDoc = $('.btn-view-approval-doc');
	btnViewApprovalDoc.bind('click', function (e) {
		e.preventDefault();
		alert('준비중입니다.');
	});
	
	
	
	
}());



