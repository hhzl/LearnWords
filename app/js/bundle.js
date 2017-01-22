var bundle =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**************************************************
	* Learn Words // main.js
	* coded by Anatol Marezhanyi aka e1r0nd//[CRG] - January 2017
	* http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
	* Placed in public domain.
	**************************************************/
	'use strict';
	
	var _LW = __webpack_require__(7);
	
	var _LW2 = _interopRequireDefault(_LW);
	
	var _utils = __webpack_require__(2);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	console.log(_LW2.default);
	var LWdb = new _LW2.default('LWdb');
	console.log(LWdb);
	console.log(LWdb.isLocalStorageAvailable());
	// let _LWdb = require('./utils/LWdb').LWdb;
	//let LW = new _LWdb('LWdb');
	
	// import Memorystore from './utils/memorystore';
	// import Navigation from './utils/navigation';
	// import Local from './local/local';
	// import Actions from './actions/actions';
	
	var a = void 0;
	if (true) {
	  console.log('development environment ' + ("development"));
	}
	// read settings
	Settings.getSettings();
	
	// set user saved local
	if (local.currentLocal !== $('[data-type=lang-select].selected').data('lang')) {
	  $('[data-lang=' + local.currentLocal + ']').click();
	};
	
	Vocabulary.viewWord();
	Learn.recountIndexLearn();
	Learn.showWord();
	Repeat.recountIndexRepeat();
	Repeat.showWord();
	_utils2.default.closeMobMenu();

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (dbName) {
	
	  this.isNumber = function (str, withDot) {
	    //validate filed for number value
	    var NumberReg = /^\d+$/,
	        NumberWithDotReg = /^[-+]?[0-9]*\.?[0-9]+$/;
	
	    return withDot ? NumberWithDotReg.test(str) : NumberReg.test(str);
	  };
	
	  this.clearFields = function () {
	    $('.form-group').each(function (i, node) {
	      //clear all error styles
	      $(node).removeClass('has-error');
	    });
	    $('#errorSettings').addClass('nodisplay');
	  };
	
	  this.setFieldError = function (self) {
	    //set the error style for the current input field
	    $(self).addClass('has-error');
	    return true;
	  };
	
	  this.getRandomInt = function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	  };
	
	  this.getToday = function (fullDate) {
	    var now = new Date();
	
	    if (fullDate) {
	      return new Date().valueOf();
	    } else {
	      return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
	    }
	  };
	
	  this.closeMobMenu = function () {
	    if ($('#bs-example-navbar-collapse-1').hasClass('in')) {
	      $('#navbarToggle').click();
	    }
	  };
	
	  this.shuffle = function (a) {
	    var j, x, i;
	    for (i = a.length; i; i--) {
	      j = Math.floor(Math.random() * i);
	      x = a[i - 1];
	      a[i - 1] = a[j];
	      a[j] = x;
	    }
	  };
	};
	
	;
	// }
	
	// if (typeof module !== 'undefined' && module.exports != null) {
	//     exports.Utils = Utils;
	// }
	/**************************************************
	 * Learn Words // utils.js
	 * coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
	 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	 * Placed in public domain.
	 **************************************************/
	// if (typeof (Utils) == 'undefined' || Utils == null || !Utils) {
	
	// Utils = {

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**************************************************
	 * Learn Words // localstorage.js
	 * coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
	 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	 *
	 * Updated by Hannes Hirzel, November 2016
	 *
	 * Placed in public domain.
	 **************************************************/
	
	// Define global LearnWords object
	// var LW = {};
	
	// Define database sub-object
	var LW = function () {
	  function LW(dbName) {
	    _classCallCheck(this, LW);
	
	    this.isOK = false;
	    this.name = dbName;
	  }
	
	  _createClass(LW, [{
	    key: "isLocalStorageAvailable",
	    value: function isLocalStorageAvailable() {
	      try {
	        return window && window.localStorage;
	      } catch (e) {
	        return false;
	      }
	    }
	    //
	    // readItem: function (key) {
	    //   if (LW.isOK) {
	    //     return JSON.parse(localStorage.getItem(key));
	    //   }
	    // },
	    //
	    // removeItem: function (key) {
	    //   if (LW.isOK) {
	    //     localStorage.removeItem(key);
	    //   }
	    // },
	    //
	    // storeItem: function (key, value) {
	    //   if (LW.isOK) {
	    //     try {
	    //       localStorage.setItem(key, JSON.stringify(value));
	    //     } catch (e) {
	    //       if (e === QUOTA_EXCEEDED_ERR) {
	    //         alert('Local Storage is full');
	    //       }
	    //       return false;
	    //     }
	    //   }
	    // },
	    //
	    // putSettings: function (theSettingsObj) {
	    //   LW.storeItem(LW.name + '-words-settings', theSettingsObj);
	    // },
	    //
	    // getSettings: function () {
	    //
	    //   var settings = LW.readItem(LW.name + '-words-settings');
	    //   if (!settings) {
	    //     // the app runs for the first time, thus
	    //     // initialize the setting object neeeds to be initialized
	    //     // with default values.
	    //
	    //     // first is for box (or step) 1 in the Leitner box;
	    //     //       ask the word again after 1 day
	    //     // second is for box 2 ; ask the word again after 3 days
	    //     // third is for box 3 ; ask the word again after 7 days
	    //
	    //     // Note: box 0 is for the Learn mode and it not set
	    //     // as the words are accessible all the time
	    //     console.log('initialize settings');
	    //     settings = {
	    //       first: 1,
	    //       second: 3,
	    //       third: 7
	    //     };
	    //     LW.storeItem(LW.name + '-settings', settings);
	    //     LW.storeItem(LW.name + '-language', 'en_GB');
	    //
	    //   };
	    //
	    //   return settings
	    // },
	    //
	    // loadWords: function (theWords) {
	    //   var i = 0;
	    //   var arrayOfKeys = [];
	    //
	    //   theWords.forEach(function (element) {
	    //     i = i + 1;
	    //     element.index = 'index' + i;
	    //     element.step = 0;
	    //     element.date = 0;
	    //     LW.storeItem(LW.name + '-' + element.index, element);
	    //     arrayOfKeys.push(element.index);
	    //   });
	    //
	    //   LW.storeItem(LW.name + '-words', arrayOfKeys.join());
	    //   LW.index = arrayOfKeys;
	    //
	    //   console.log(arrayOfKeys.length + ' words loaded');
	    //
	    // },
	    //
	    // isEmpty: function (key) {
	    //   if (LW.isOK) {
	    //     if (LW.index.length === 0) {
	    //       return true
	    //     } else {
	    //       return false
	    //     };
	    //   }
	    // },
	    //
	    // dumpWords: function (aKeyPrefix) {
	    //   if (LW.isOK) {
	    //     'use strict';
	    //     var key;
	    //     var strValue;
	    //     var result = [];
	    //
	    //     var prefixForNumber = LW.name + '-index';
	    //
	    //     // go through all keys starting with the name
	    //     // of the database, i.e 'learnWords-index14'
	    //     // collect the matching objects into arr
	    //     for (var i = 0; i < localStorage.length; i++) {
	    //       key = localStorage.key(i);
	    //       strValue = localStorage.getItem(key);
	    //
	    //       if (key.lastIndexOf(prefixForNumber, 0) === 0) {
	    //         result.push(JSON.parse(strValue));
	    //       };
	    //     };
	    //
	    //     // Dump the array as JSON code (for select all / copy)
	    //     console.log(JSON.stringify(result));
	    //   }
	    // },
	    //
	    // removeObjects: function (aKeyPrefix) {
	    //   if (LW.isOK) {
	    //     var key;
	    //     var st;
	    //     var keysToDelete = [];
	    //
	    //     // go through all keys starting with the name
	    //     // of the database, i.e 'learnWords-index14'
	    //     for (var i = 0; i < localStorage.length; i++) {
	    //       key = localStorage.key(i);
	    //       st = localStorage.getItem(key);
	    //
	    //       if (key.lastIndexOf(aKeyPrefix, 0) === 0) {
	    //         keysToDelete.push(key);
	    //       };
	    //     };
	    //     // now we have all the keys which should be deleted
	    //     // in the array keysToDelete.
	    //     console.log(keysToDelete);
	    //     keysToDelete.forEach(function (aKey) {
	    //       localStorage.removeItem(aKey);
	    //     });
	    //   }
	    // },
	    //
	    // removeWords: function () {
	    //
	    //   var aKeyPrefix = LW.name + '-index';
	    //   LW.removeObjects(aKeyPrefix);
	    //
	    //   // reset index
	    //   localStorage.setItem(LW.name + '-words', '');
	    //
	    //   // this one triggers that memorystore is executed
	    //   localStorage.removeItem(LW.name + '-settings');
	    //
	    // },
	    //
	    // destroy: function () {
	    //
	    //   var aKeyPrefix = LW.name;
	    //
	    //   LW.removeObjects(aKeyPrefix);
	    //
	    // },
	    //
	    // init: function (dbName) {
	    // this.isOK = false;
	    // if (!LW.isLocalStorageAvailable()) {
	    //   alert('Local Storage is not available.');
	    //   return false;
	    // };
	    // this.name = dbName;
	    // get index
	    // LW.index = [];
	    // var strIndex = localStorage.getItem(LW.name + '-words');
	    // if (strIndex) {
	    //   LW.index = strIndex.split(',')
	    // };
	    // LW.isOK = true;
	    // }
	
	  }]);
	
	  return LW;
	}();
	
	exports.default = LW;
	;
	
	// initialize database sub-object
	// LW.init('LWdb');

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map