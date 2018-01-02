(function () {
	new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		nextButton: '.swiper-button-next',
		prevButton: '.swiper-button-prev',
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



