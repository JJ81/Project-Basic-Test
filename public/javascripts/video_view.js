/**
 * Created by yijaejun on 30/03/2017.
 */
/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';

import $ from '../components/jquery/dist/jquery.min';

// todo [bug] 아래 두 파일은 compile & uglify에서 제외시킨다.
//import videojs from './vendor/videojs';
//import youtubejs from './vendor/youtube.min';

// import utils from './utils';


var clearVideoId = null; // 비디오가 시작된 시간으로부터 카운트 ID
var clearAdId = null; // 배너노출이 시작된 시간으로부터 카운트 ID
var adBanStartTime = null; // 배너 노출 시작 시간 => 앞뒤로 30초간은 보여주지 않고 시간을 랜덤으로 찾아온다.
var viewedAd = false; // 광고가 노출되었는지 여부
var adTimeCount = 1; // 광고를 시작한 시간으로부터 몇 초가 지났는가
var first_ad_timer = $('.first_ad_timer');

var adPlayer = videojs('really-cool-video', {/* Options */}, function () {
	this.volume(0.2);

	this.on('error', () => {
		console.log('error');
	});

	this.on('ready', function () {
		// 모바일의 경우만 이 버튼을 노출시킬 수 있도록 한다 그리고 poster 기능을 사용할 경우에만 해당한다.
		$('.btn-ad-play').bind('click', function () {
			adPlayer.play();
		});

	});

	this.on('play', function () {
		$('.btn_timer_on_the_screen').removeClass('blind');
		insertSecondTimer($('.timer_first_ad'), 10);
		// 영상이 재생된 지 10초가 지난 후에 건너뛰기 버튼이 나타난다.
		setTimeout(function () {
			$('.btn_ad_skip_a').removeClass('blind');
			first_ad_timer.addClass('blind');
		}, 10000);

	});

	this.on('ended', function () {
		$('.btn_ad_skip_a').click();
	});
});

$('.btn_ad_skip_a').bind('click', function () {
	adPlayer.pause();
	$('.ad_video').remove();
	$('.video_view').removeClass('blind');
	player.play();

	return false;
});

var player = videojs('main-video', {}, function () {
	this.volume(0.5);

	this.on('ready', function () {
		// console.log('main contents ready');
	});

	this.on('play', function () {
		clearInterval(clearVideoId);
		clearVideoId = getReelCount();

		if (adBanStartTime == null) {
			setTimeout(function () {
				adBanStartTime = getAdExposeRandomTime();
				console.log('ad start time : ' + adBanStartTime); // adBanStartTime 시간이 결정되면, ...
			}, 3000); // 재생이 된 시점에서 3초 후에 광고 노출시간을 계산한다.
		}
	});

	this.on('seeking', function () {
		clearInterval(clearVideoId);
	});

	this.on('seeked', function () {
		clearInterval(clearVideoId);
		clearVideoId = getReelCount();
	});

	this.on('pause', function () {
		clearInterval(clearVideoId);
	});

	this.on('ended', function () {
		clearInterval(clearVideoId);

		// remove Ad;
		displayAdBan(false);

		var _videoId  = getNextVideoId();
		if(_videoId !== null){
			// go next url automatically.
			goActionUrl(getNextVideoId());
		}
	});
});

var ad_timer = null;
function insertSecondTimer(target, duration) {
	if (duration < 1) {
		clearInterval(ad_timer);
		//console.log('finished');
		return;
	}

	ad_timer = setTimeout(function () {
		duration--;
		insertSecondTimer(target, duration);
	}, 1000);

	target.text(duration);
}

/**
 * 비디오 시작으로부터 카운트 시작
 * @returns {number}
 */
function getReelCount() {
	return setInterval(function () {
		var curr = Math.round(player.currentTime());

		// 현재 릴타임을 기준으로 배너를 노출할 것인지 여부를 결정해야 한다.
		//console.log('current time : ' + curr);

		if (!viewedAd && adBanStartTime != null && curr >= adBanStartTime) {
			console.log('광고를 보기 시작해야 한다.');
			displayAdBan(true);
			// 광고 출력이 되면 카운트 시
			clearAdId = getCountForAd(); // 20초 카운트
			viewedAd = true;
		}

		// 끝나는 시간은 광고가 시작되고 나서의 카운트에 의존해야 한다
		if (adTimeCount >= 20 && viewedAd) { // 광고가 출력된 상태에서 종료시간이 오면 끝낸다.
			displayAdBan(false);
			clearInterval(clearAdId);
		}
	}, 1000);
}


/**
 * 배너가 노출된 후로부터 카운트와 ID리턴
 * @returns {number}
 */
function getCountForAd() {
	adTimeCount = 0;
	return setInterval(function () {
		adTimeCount++;
		//console.log('ad : ' + adTimeCount);
	}, 1000);
}



function getAdExposeRandomTime() {
	return parseInt((Math.random() * (player.duration() - 30) ));
}


/**
 * 배너의 출력을 컨트롤한다.
 * @param bool
 */
var ban_in_video = $('.ban_in_video');
function displayAdBan(bool) {
	if (bool) {
		ban_in_video.removeClass('blind');
	} else {
		ban_in_video.addClass('blind');
	}
}

var video_list = JSON.parse($('#videos').val());

function getPrevVideoId(){
	var _prev = $('#prevVideo').val().trim();
	if(_prev !== '' && _prev !== null){
		return video_list[_prev].video_id;
	}
	return null;
}

function getNextVideoId() {
	var _next = $('#nextVideo').val().trim();
	if(_next !== '' && _next !== null){
		return video_list[_next].video_id;
	}
	return null;
}

// get next video and move to its url
function goActionUrl(video_id){
	var videos = video_list, size = video_list.length, i=0;
	for(;i<size;i++) {
		if(videos[i].video_id === video_id){
			window.location.href = '/channel/' + videos[i].channel_id + '/video/' + videos[i].video_id;
			break;
		}
	}
	return;
}

var btn_ban_in_video = $('.btn_ban_in_video');
btn_ban_in_video.bind('click', function () {
	displayAdBan(false);
	return false;
});