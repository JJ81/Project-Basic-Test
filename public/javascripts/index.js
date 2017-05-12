'use strict';
import $ from '../components/jquery/dist/jquery.min';
import ps from './vendor/ps.estate';
import util from './utils';
import Swiper from './vendor/swiper.min';


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
