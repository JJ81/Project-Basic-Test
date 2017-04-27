import $ from '../components/jquery/dist/jquery.min';

const
	_right_nav = $('.btn-nav-list'),
  _left_nav = $('.btn-channel-list'),
 _right_nav_body = $('.right_menu_m'),
 _left_nav_body = $('.left_menu_m');


_right_nav.bind('click', (e) => {
	e.preventDefault();
	e.stopPropagation();

	if(!_left_nav_body.hasClass('blind')){
		_left_nav_body.addClass('blind');
	}

	if(_right_nav_body.hasClass('blind')){
		_right_nav_body.removeClass('blind');
	}else{
		_right_nav_body.addClass('blind');
	}

	return;
});


// hide all menu
$('body').bind('click', () => {
	if(!_right_nav_body.hasClass('blind')){
		_right_nav_body.addClass('blind');
	}

	if(!_left_nav_body.hasClass('blind')){
		_left_nav_body.addClass('blind');
	}
});


_left_nav.bind('click', (e) => {
	e.preventDefault();
	e.stopPropagation();

	if(!_right_nav_body.hasClass('blind')){
		_right_nav_body.addClass('blind');
	}

	if(_left_nav_body.hasClass('blind')){
		_left_nav_body.removeClass('blind');
	}else{
		_left_nav_body.addClass('blind');
	}

	return;
});
