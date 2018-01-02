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
}());

