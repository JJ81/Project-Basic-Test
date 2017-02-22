/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	eval("/**\n * Created by yijaejun on 01/02/2017.\n */\n'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Login = function () {\n\tfunction Login(name) {\n\t\t_classCallCheck(this, Login);\n\n\t\tthis._name = name;\n\t}\n\n\t_createClass(Login, [{\n\t\tkey: 'doLogin',\n\t\tvalue: function doLogin() {\n\t\t\tconsole.log('login by ' + this._name);\n\t\t}\n\t}]);\n\n\treturn Login;\n}();\n\nexports.default = Login;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvdGVzdC1lczYuanM/ZjVlOCJdLCJuYW1lcyI6WyJMb2dpbiIsIm5hbWUiLCJfbmFtZSIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFHQTs7Ozs7Ozs7OztJQUVNQSxLO0FBQ0wsZ0JBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDakIsT0FBS0MsS0FBTCxHQUFhRCxJQUFiO0FBQ0E7Ozs7NEJBQ1M7QUFDVEUsV0FBUUMsR0FBUixDQUFZLGNBQWMsS0FBS0YsS0FBL0I7QUFDQTs7Ozs7O2tCQUdhRixLIiwiZmlsZSI6IjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgeWlqYWVqdW4gb24gMDEvMDIvMjAxNy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBMb2dpbiB7XG5cdGNvbnN0cnVjdG9yKG5hbWUpIHtcblx0XHR0aGlzLl9uYW1lID0gbmFtZTtcblx0fVxuXHRkb0xvZ2luICgpe1xuXHRcdGNvbnNvbGUubG9nKCdsb2dpbiBieSAnICsgdGhpcy5fbmFtZSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9naW47XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvdGVzdC1lczYuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }
/******/ ]);