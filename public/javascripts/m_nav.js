import $ from '../components/jquery/dist/jquery.min';

const
	_right_nav = $('.btn-nav-list'),
  _left_nav = $('.btn-channel-list'),
 _right_nav_body = $('.right_menu_m'),
 _left_nav_body = $('.left_menu_m'),
 _body_content = $('.body_content');

_right_nav.bind('click', (e) => {
	e.preventDefault();
	e.stopPropagation();

	if(!_left_nav_body.hasClass('blind')){
		_left_nav_body.addClass('blind');
	}

	if(_right_nav_body.hasClass('blind')){
		_right_nav_body.removeClass('blind');
		_body_content.addClass('blind');
	}else{
		_right_nav_body.addClass('blind');
		_body_content.removeClass('blind');
	}

	return;
});

// hide all menu
// $('document').bind('click', () => {
// 	if(!_right_nav_body.hasClass('blind')){
// 		_right_nav_body.addClass('blind');
// 	}
//
// 	if(!_left_nav_body.hasClass('blind')){
// 		_left_nav_body.addClass('blind');
// 	}
//
// 	if(_body_content.hasClass('blind')) {
// 		_body_content.removeClass('blind');
// 	}
//
// 	alert('body or document');
//
// });


_left_nav.bind('click', (e) => {
	e.preventDefault();
	e.stopPropagation();

	if(!_right_nav_body.hasClass('blind')){
		_right_nav_body.addClass('blind');
	}

	if(_left_nav_body.hasClass('blind')){
		_left_nav_body.removeClass('blind');
		_body_content.addClass('blind');
	}else{
		_left_nav_body.addClass('blind');
		_body_content.removeClass('blind');
	}

	return;
});
