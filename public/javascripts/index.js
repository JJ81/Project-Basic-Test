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


	$(function(){
		var timer = !1;
		_Ticker = $("#T1").newsTicker();
		_Ticker.on("mouseenter",function(){
			var __self = this;
			timer = setTimeout(function(){
				__self.pauseTicker();
			}, 300);
		});
		_Ticker.on("mouseleave",function(){
			clearTimeout(timer);
			if(!timer) return !1;
			this.startTicker();
		});
	});

}());



