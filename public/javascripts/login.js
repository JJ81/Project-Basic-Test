/**
 * Created by yijaejun on 01/12/2016.
 */
'use strict';
requirejs(
	[
		'jquery'
		,'jqueryCookie'
		,'jqueryValidate'
	],
  function (jQuery) {
    // var $ = jQuery;
    // var
    // remember = $('#remember'),
    // agent = $('#agent'),
    // password = $('#password'),
    // form_agent_login = $('#form-agent-login'),
    // btn_agent_login = $('#btn-agent-login');
    //
    // checkCookie();
    //
    // btn_agent_login.bind('click', function () {
    //   /* 쿠키 값이 없고, remember me checked 되있는 경우에 쿠키 값을 저장한다*/
    //   if ($.cookie('agent') === undefined && remember.prop('checked')) {
    //     setCookie(agent.val());
    //   }
    //   if ($.cookie('agent') !== undefined && $.cookie('agent') !== agent.val() && remember.prop('checked')) {
    //     setCookie(agent.val());
    //   }
    // });
    //
    // remember.change('click', function () {
    //   if (!$(this).prop('checked')) {
    //     if ($.cookie('agent') != undefined) { /*쿠키 값이 있고, remember가 체크 되있는 경우에 쿠키 삭제 가능*/
    //       removeCookie();
    //     }
    //   }
    // });
    //
    // function setCookie(agent) {
    //   $.cookie('agent', agent);
    // }
    //
    // function getCookie() {
    //   agent.val($.cookie('agent'));
    // }
    //
    // function checkCookie() {
    //   if ($.cookie('agent') === undefined) {
    //     remember.prop('checked', false);
    //   } else {
    //     remember.prop('checked', true);
    //     getCookie();
    //   }
    // }
    //
    // function removeCookie() {
    //   var removeCookie = confirm('저장된 아이디를 삭제하시겠습니까?');
    //   if (removeCookie) {
    //     $.removeCookie('agent');
    //   }
    // }
    //
    // /*Login */
    // form_agent_login.validate({
    //   onkeyup: false,
    //   submitHandler: function () {
    //     return true;
    //   },
    //   rules: {
    //     agent: {
    //       required: true,
    //       minlength: 3
    //     },
    //     password: {
    //       required: true,
    //       minlength: 4,
    //       remote: {
    //         async: false,
    //         url: '/api/v1/agent/login',
    //         type: 'post',
    //         data: {
    //           code: function () {
    //             return $('#agent').val();
    //           }
    //         },
    //         dataFilter: function (data) {
    //           var data = JSON.parse(data);
    //           if (data.success) {
    //             return true
    //           } else {
    //             return "\"" + data.msg + "\"";
    //           }
    //         }
    //       }
    //     }
    //   }
    // });
}); // end of function

