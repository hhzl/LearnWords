var main =
webpackJsonp_name_([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**************************************************
	* Learn Words // main.js
	* coded by Anatol Marezhanyi aka e1r0nd//[CRG] - January 2017
	* http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
	* Placed in public domain.
	**************************************************/
	'use strict';
	
	var _LW = __webpack_require__(1);
	
	var _LW2 = _interopRequireDefault(_LW);
	
	var _settings = __webpack_require__(2);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	var _utils = __webpack_require__(3);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	var _memorystore = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// console.log(LW);
	var LW = new _LW2.default('LWdb');
	// console.log(LW);
	console.log(LW.isLocalStorageAvailable());
	
	var Settings = new _settings2.default();
	
	// load the default words set if needed
	if (LW.isOK && LW.isEmpty) {
	  console.log('memorystore: start loading words');
	  LW.loadWords(_memorystore.Memorystore);
	  console.log('memorystore: words have been loaded');
	}
	
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
	//if (local.currentLocal !== $('[data-type=lang-//select].selected').data('lang')) {
	//	$('[data-lang=' + local.currentLocal + ']').click();
	//};
	
	// Vocabulary.viewWord();
	// Learn.recountIndexLearn();
	// Learn.showWord();
	// Repeat.recountIndexRepeat();
	// Repeat.showWord();
	// Utils.closeMobMenu();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**************************************************
	 * Learn Words // localstorage.js
	 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	 * http://linkedin.com/in/merezhany/ a.merezhany@gmail.com
	 *
	 * Updated by Hannes Hirzel, November 2016
	 *
	 * Placed in public domain.
	 **************************************************/
	var LWClass = function () {
	  function LWClass(dbName) {
	    _classCallCheck(this, LWClass);
	
	    this.isOK = false;
	    if (!this.isLocalStorageAvailable()) {
	      alert('Local Storage is not available.');
	      return false;
	    };
	    this.name = dbName;
	    // get index
	    this.index = [];
	    var strIndex = localStorage.getItem(this.name + '-words');
	    if (strIndex) {
	      this.index = strIndex.split(',');
	    };
	    this.isOK = true;
	  }
	
	  _createClass(LWClass, [{
	    key: 'isLocalStorageAvailable',
	    value: function isLocalStorageAvailable() {
	      try {
	        return window && window.localStorage;
	      } catch (e) {
	        return false;
	      }
	    }
	  }, {
	    key: 'readItem',
	    value: function readItem(key) {
	      if (this.isOK) {
	        return JSON.parse(localStorage.getItem(key));
	      }
	    }
	  }, {
	    key: 'removeItem',
	    value: function removeItem(key) {
	      if (this.isOK) {
	        localStorage.removeItem(key);
	      }
	    }
	  }, {
	    key: 'storeItem',
	    value: function storeItem(key, value) {
	      if (this.isOK) {
	        try {
	          localStorage.setItem(key, JSON.stringify(value));
	        } catch (e) {
	          if (e === QUOTA_EXCEEDED_ERR) {
	            alert('Local Storage is full');
	          }
	          return false;
	        }
	      }
	    }
	  }, {
	    key: 'putSettings',
	    value: function putSettings(theSettingsObj) {
	      this.storeItem(this.name + '-words-settings', theSettingsObj);
	    }
	  }, {
	    key: 'getSettings',
	    value: function getSettings() {
	
	      var settings = this.readItem(this.name + '-words-settings');
	      if (!settings) {
	        // the app runs for the first time, thus
	        // initialize the setting object neeeds to be initialized
	        // with default values.
	
	        // first is for box (or step) 1 in the Leitner box;
	        //       ask the word again after 1 day
	        // second is for box 2 ; ask the word again after 3 days
	        // third is for box 3 ; ask the word again after 7 days
	
	        // Note: box 0 is for the Learn mode and it not set
	        // as the words are accessible all the time
	        console.log('initialize settings');
	        settings = {
	          first: 1,
	          second: 3,
	          third: 7
	        };
	        this.storeItem(this.name + '-settings', settings);
	        this.storeItem(this.name + '-language', 'en_GB');
	      };
	
	      return settings;
	    }
	  }, {
	    key: 'loadWords',
	    value: function loadWords(theWords) {
	      var i = 0;
	      var arrayOfKeys = [];
	      var storeEachElement = function storeEachElement(element) {
	        element.index = 'index' + ++i;
	        element.step = element.date = 0;
	        this.storeItem(this.name + '-' + element.index, element);
	        arrayOfKeys.push(element.index);
	      };
	
	      theWords.forEach(storeEachElement.bind(this));
	
	      this.storeItem(this.name + '-words', arrayOfKeys.join());
	      this.index = arrayOfKeys;
	
	      console.log(arrayOfKeys.length + ' words have been loaded');
	    }
	  }, {
	    key: 'isEmpty',
	    value: function isEmpty() /*key*/{
	      if (this.isOK) {
	        return !this.index.length ? true : false;
	      }
	    }
	  }, {
	    key: 'dumpWords',
	    value: function dumpWords() /*aKeyPrefix*/{
	      if (this.isOK) {
	        'use strict';
	        var key;
	        var strValue;
	        var result = [];
	
	        var prefixForNumber = this.name + '-index';
	
	        // go through all keys starting with the name
	        // of the database, i.e 'learnWords-index14'
	        // collect the matching objects into arr
	        for (var i = 0; i < localStorage.length; i++) {
	          key = localStorage.key(i);
	          strValue = localStorage.getItem(key);
	
	          if (0 === key.lastIndexOf(prefixForNumber, 0)) {
	            result.push(JSON.parse(strValue));
	          };
	        };
	
	        // Dump the array as JSON code (for select all / copy)
	        console.log(JSON.stringify(result));
	      }
	    }
	  }, {
	    key: 'removeObjects',
	    value: function removeObjects(aKeyPrefix) {
	      if (this.isOK) {
	        var key;
	        // var st;
	        var keysToDelete = [];
	
	        // go through all keys starting with the name
	        // of the database, i.e 'learnWords-index14'
	        for (var i = 0; i < localStorage.length; i++) {
	          key = localStorage.key(i);
	          st = localStorage.getItem(key);
	
	          if (0 === key.lastIndexOf(aKeyPrefix, 0)) {
	            keysToDelete.push(key);
	          };
	        };
	        // now we have all the keys which should be deleted
	        // in the array keysToDelete.
	        console.log(keysToDelete);
	        keysToDelete.forEach(function (aKey) {
	          localStorage.removeItem(aKey);
	        });
	      }
	    }
	  }, {
	    key: 'removeWords',
	    value: function removeWords() {
	      var aKeyPrefix = this.name + '-index';
	
	      this.removeObjects(aKeyPrefix);
	      // reset index
	      localStorage.setItem(this.name + '-words', '');
	      // this one triggers that memorystore is executed
	      localStorage.removeItem(this.name + '-settings');
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      var aKeyPrefix = this.name;
	
	      this.removeObjects(aKeyPrefix);
	    }
	  }]);
	
	  return LWClass;
	}();
	
	exports.default = LWClass;
	;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**********************************************
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Learn Words // this.js
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Updated by Hannes Hirzel, November 2016
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Placed in public domain.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      **************************************************/
	
	
	var _LW = __webpack_require__(1);
	
	var _LW2 = _interopRequireDefault(_LW);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var LW = new _LW2.default('LWdb');
	
	var SettingsClass = function () {
	  function SettingsClass() {
	    _classCallCheck(this, SettingsClass);
	
	    this.inputFirstCheck = $('#inputFirstCheck');
	    this.inputSecondCheck = $('#inputSecondCheck');
	    this.inputThirdCheck = $('#inputThirdCheck');
	    this.settingFrom = $('#settingFrom');
	    this.errorSettings = $('#errorSettings');
	
	    this.params = {};
	
	    $(document).on('click touchstart', '#saveSettings', this.saveSetting);
	    $(document).on('click touchstart', '#cancelSettings', this.cancelSetting);
	  }
	
	  _createClass(SettingsClass, [{
	    key: 'getSettings',
	    value: function getSettings() {
	      //read setting's values
	      var storedSettings = LW.getSettings();
	
	      $(this.inputFirstCheck).val(storedSettings.first);
	      $(this.inputSecondCheck).val(storedSettings.second);
	      $(this.inputThirdCheck).val(storedSettings.third);
	
	      this.params = storedSettings; //store local
	    }
	  }, {
	    key: 'saveSetting',
	    value: function saveSetting() {
	      //save setting's values to DB
	      var first = $(this.inputFirstCheck).val().trim(),
	          second = $(this.inputSecondCheck).val().trim(),
	          third = $(this.inputThirdCheck).val().trim(),
	          form = $(this.settingFrom),
	          errorName = '',
	          error = false;
	
	      Utils.clearFields();
	      //check for empty fields
	      if (!first) {
	        error = Utils.setFieldError(form.children(':nth-child(1)'));
	        errorName = 'empty';
	      } else if (!second) {
	        error = Utils.setFieldError(form.children(':nth-child(2)'));
	        errorName = 'empty';
	      } else if (!third) {
	        error = Utils.setFieldError(form.children(':nth-child(3)'));
	        errorName = 'empty';
	      } else {
	        //only digits is valid
	        if (!Utils.isNumber(first)) {
	          error = Utils.setFieldError(form.children(':nth-child(1)'));
	          errorName = 'number';
	        };
	        if (!Utils.isNumber(second)) {
	          error = Utils.setFieldError(form.children(':nth-child(2)'));
	          errorName = 'number';
	        };
	        if (!Utils.isNumber(third)) {
	          error = Utils.setFieldError(form.children(':nth-child(3)'));
	          errorName = 'number';
	        };
	      }
	      if (error) {
	        //show error if any
	        var errorTxt = 'empty' === errorName ? local[local.currentLocal].errorEmpty : local[local.currentLocal].errorValid;
	        $(this.errorSettings).removeClass('nodisplay').text(errorTxt);
	      } else {
	        //otherwise save new settings
	        settings = {
	          first: first,
	          second: second,
	          third: third
	        };
	        LW.putSettings(settings);
	        $(this.errorSettings).removeClass('nodisplay').text(local[local.currentLocal].errorNo);
	
	        this.params = settings; //store local
	      };
	    }
	  }, {
	    key: 'cancelSetting',
	    value: function cancelSetting() {
	      Utils.clearFields();
	      this.getSettings();
	    }
	  }]);
	
	  return SettingsClass;
	}();
	
	exports.default = SettingsClass;
	;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**************************************************
	 * Learn Words // utils.js
	 * coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
	 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	 * Placed in public domain.
	 **************************************************/
	'use strict';
	
	if (typeof Utils == 'undefined' || Utils == null || !Utils) {
	  var Utils = {};
	
	  Utils = {
	    isNumber: function isNumber(str, withDot) {
	      //validate filed for number value
	      var NumberReg = /^\d+$/,
	          NumberWithDotReg = /^[-+]?[0-9]*\.?[0-9]+$/;
	
	      return withDot ? NumberWithDotReg.test(str) : NumberReg.test(str);
	    },
	
	    clearFields: function clearFields() {
	      $('.form-group').each(function (i, node) {
	        //clear all error styles
	        $(node).removeClass('has-error');
	      });
	      $('#errorSettings').addClass('nodisplay');
	    },
	
	    setFieldError: function setFieldError(self) {
	      //set the error style for the current input field
	      $(self).addClass('has-error');
	      return true;
	    },
	
	    getRandomInt: function getRandomInt(min, max) {
	      return Math.floor(Math.random() * (max - min + 1)) + min;
	    },
	
	    getToday: function getToday(fullDate) {
	      var now = new Date();
	
	      if (fullDate) {
	        return new Date().valueOf();
	      } else {
	        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
	      }
	    },
	
	    closeMobMenu: function closeMobMenu() {
	      if ($('#bs-example-navbar-collapse-1').hasClass('in')) {
	        $('#navbarToggle').click();
	      }
	    },
	
	    shuffle: function shuffle(a) {
	      var j, x, i;
	      for (i = a.length; i; i--) {
	        j = Math.floor(Math.random() * i);
	        x = a[i - 1];
	        a[i - 1] = a[j];
	        a[j] = x;
	      }
	    }
	  };
	}
	
	if (typeof module !== 'undefined' && module.exports != null) {
	  exports.Utils = Utils;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**************************************************
	 * Learn Words // memorystore.js
	 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - January 2017
	 * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
	 * Placed in public domain.
	 **************************************************/
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Memorystore = exports.Memorystore = [{
	  'index': 'index1',
	  'word': 'das Auto',
	  'translate': 'car',
	  'step': 0,
	  'date': 0
	}, {
	  'index': 'index2',
	  'word': 'laufen',
	  'translate': 'run',
	  'step': 0,
	  'date': 0
	}, {
	  'index': 'index3',
	  'word': 'alt',
	  'translate': 'old',
	  'step': 0,
	  'date': 0
	}, {
	  'index': 'index4',
	  'word': 'krank',
	  'translate': 'sick',
	  'step': 0,
	  'date': 0
	}, {
	  'index': 'index5',
	  'word': 'heute',
	  'translate': 'today',
	  'step': 0,
	  'date': 0
	}, {
	  'index': 'index6',
	  'word': 'schreiben',
	  'translate': 'write',
	  'step': 0,
	  'date': 0
	}, {
	  'index': 'index7',
	  'word': 'hell',
	  'translate': 'light',
	  'step': 0,
	  'date': 0
	}, {
	  'index': 'index8',
	  'word': 'reich',
	  'translate': 'rich',
	  'step': 0,
	  'date': 0
	}, {
	  'index': 'index9',
	  'word': 'süß',
	  'translate': 'sweet',
	  'step': 1,
	  'date': 0
	}, {
	  'index': 'index10',
	  'word': 'weiblich',
	  'translate': 'female',
	  'step': 1,
	  'date': 0
	}, {
	  'index': 'index11',
	  'word': 'bestellen',
	  'translate': 'order',
	  'step': 1,
	  'date': 0
	}, {
	  'index': 'index12',
	  'word': 'kalt',
	  'translate': 'cold',
	  'step': 2,
	  'date': 0
	}, {
	  'index': 'index13',
	  'word': 'sauer',
	  'translate': 'sour',
	  'step': 2,
	  'date': 0
	}, {
	  'index': 'index14',
	  'word': 'fliegen',
	  'translate': 'fly',
	  'step': 3,
	  'date': 0
	}];

/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvTFcuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pzL3V0aWxzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL2FwcC9qcy91dGlscy9tZW1vcnlzdG9yZS5qcyJdLCJuYW1lcyI6WyJMVyIsImNvbnNvbGUiLCJsb2ciLCJpc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSIsIlNldHRpbmdzIiwiaXNPSyIsImlzRW1wdHkiLCJsb2FkV29yZHMiLCJhIiwiZ2V0U2V0dGluZ3MiLCJMV0NsYXNzIiwiZGJOYW1lIiwiYWxlcnQiLCJuYW1lIiwiaW5kZXgiLCJzdHJJbmRleCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzcGxpdCIsIndpbmRvdyIsImUiLCJrZXkiLCJKU09OIiwicGFyc2UiLCJyZW1vdmVJdGVtIiwidmFsdWUiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiUVVPVEFfRVhDRUVERURfRVJSIiwidGhlU2V0dGluZ3NPYmoiLCJzdG9yZUl0ZW0iLCJzZXR0aW5ncyIsInJlYWRJdGVtIiwiZmlyc3QiLCJzZWNvbmQiLCJ0aGlyZCIsInRoZVdvcmRzIiwiaSIsImFycmF5T2ZLZXlzIiwic3RvcmVFYWNoRWxlbWVudCIsImVsZW1lbnQiLCJzdGVwIiwiZGF0ZSIsInB1c2giLCJmb3JFYWNoIiwiYmluZCIsImpvaW4iLCJsZW5ndGgiLCJzdHJWYWx1ZSIsInJlc3VsdCIsInByZWZpeEZvck51bWJlciIsImxhc3RJbmRleE9mIiwiYUtleVByZWZpeCIsImtleXNUb0RlbGV0ZSIsInN0IiwiYUtleSIsInJlbW92ZU9iamVjdHMiLCJTZXR0aW5nc0NsYXNzIiwiaW5wdXRGaXJzdENoZWNrIiwiJCIsImlucHV0U2Vjb25kQ2hlY2siLCJpbnB1dFRoaXJkQ2hlY2siLCJzZXR0aW5nRnJvbSIsImVycm9yU2V0dGluZ3MiLCJwYXJhbXMiLCJkb2N1bWVudCIsIm9uIiwic2F2ZVNldHRpbmciLCJjYW5jZWxTZXR0aW5nIiwic3RvcmVkU2V0dGluZ3MiLCJ2YWwiLCJ0cmltIiwiZm9ybSIsImVycm9yTmFtZSIsImVycm9yIiwiVXRpbHMiLCJjbGVhckZpZWxkcyIsInNldEZpZWxkRXJyb3IiLCJjaGlsZHJlbiIsImlzTnVtYmVyIiwiZXJyb3JUeHQiLCJsb2NhbCIsImN1cnJlbnRMb2NhbCIsImVycm9yRW1wdHkiLCJlcnJvclZhbGlkIiwicmVtb3ZlQ2xhc3MiLCJ0ZXh0IiwicHV0U2V0dGluZ3MiLCJlcnJvck5vIiwic3RyIiwid2l0aERvdCIsIk51bWJlclJlZyIsIk51bWJlcldpdGhEb3RSZWciLCJ0ZXN0IiwiZWFjaCIsIm5vZGUiLCJhZGRDbGFzcyIsInNlbGYiLCJnZXRSYW5kb21JbnQiLCJtaW4iLCJtYXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZXRUb2RheSIsImZ1bGxEYXRlIiwibm93IiwiRGF0ZSIsInZhbHVlT2YiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImNsb3NlTW9iTWVudSIsImhhc0NsYXNzIiwiY2xpY2siLCJzaHVmZmxlIiwiaiIsIngiLCJtb2R1bGUiLCJleHBvcnRzIiwiTWVtb3J5c3RvcmUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7OztBQU1BOztBQUVBOzs7O0FBTUE7Ozs7QUFHQTs7OztBQUVBOzs7O0FBVkE7QUFDQSxLQUFNQSxLQUFLLGlCQUFZLE1BQVosQ0FBWDtBQUNBO0FBQ0FDLFNBQVFDLEdBQVIsQ0FBWUYsR0FBR0csdUJBQUgsRUFBWjs7QUFHQSxLQUFNQyxXQUFXLHdCQUFqQjs7QUFLQTtBQUNBLEtBQUlKLEdBQUdLLElBQUgsSUFBV0wsR0FBR00sT0FBbEIsRUFBMkI7QUFDekJMLFdBQVFDLEdBQVIsQ0FBWSxrQ0FBWjtBQUNBRixNQUFHTyxTQUFIO0FBQ0FOLFdBQVFDLEdBQVIsQ0FBWSxxQ0FBWjtBQUNE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USxDQUpQO0FBS0QsV0FBUTtBQUxQLEVBbENzQixFQXdDdEI7QUFDRCxZQUFTLFFBRFI7QUFFRCxXQUFRLE1BRlA7QUFHRCxnQkFBYSxPQUhaO0FBSUQsV0FBUSxDQUpQO0FBS0QsV0FBUTtBQUxQLEVBeENzQixFQStDekI7QUFDRSxZQUFTLFFBRFg7QUFFRSxXQUFRLE9BRlY7QUFHRSxnQkFBYSxNQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBL0N5QixFQXNEekI7QUFDRSxZQUFTLFFBRFg7QUFFRSxXQUFRLEtBRlY7QUFHRSxnQkFBYSxPQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBdER5QixFQTZEekI7QUFDRSxZQUFTLFNBRFg7QUFFRSxXQUFRLFVBRlY7QUFHRSxnQkFBYSxRQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBN0R5QixFQW1FdEI7QUFDRCxZQUFTLFNBRFI7QUFFRCxXQUFRLFdBRlA7QUFHRCxnQkFBYSxPQUhaO0FBSUQsV0FBUSxDQUpQO0FBS0QsV0FBUTtBQUxQLEVBbkVzQixFQTBFekI7QUFDRSxZQUFTLFNBRFg7QUFFRSxXQUFRLE1BRlY7QUFHRSxnQkFBYSxNQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBMUV5QixFQWlGekI7QUFDRSxZQUFTLFNBRFg7QUFFRSxXQUFRLE9BRlY7QUFHRSxnQkFBYSxNQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBakZ5QixFQXdGekI7QUFDRSxZQUFTLFNBRFg7QUFFRSxXQUFRLFNBRlY7QUFHRSxnQkFBYSxLQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBeEZ5QixDQUFwQixDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKiBMZWFybiBXb3JkcyAvLyBtYWluLmpzXHJcbiogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBKYW51YXJ5IDIwMTdcclxuKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gYS5tZXJlemhhbnlpQGdtYWlsLmNvbVxyXG4qIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IExXQ2xhc3MgZnJvbSAnLi91dGlscy9MVyc7XHJcbi8vIGNvbnNvbGUubG9nKExXKTtcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG4vLyBjb25zb2xlLmxvZyhMVyk7XHJcbmNvbnNvbGUubG9nKExXLmlzTG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkpO1xyXG5cclxuaW1wb3J0IFNldHRpbmdzQ2xhc3MgZnJvbSAnLi4vY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncyc7XHJcbmNvbnN0IFNldHRpbmdzID0gbmV3IFNldHRpbmdzQ2xhc3MoKTtcclxuXHJcbmltcG9ydCBVdGlscyBmcm9tICcuL3V0aWxzL3V0aWxzJztcclxuXHJcbmltcG9ydCB7TWVtb3J5c3RvcmV9IGZyb20gJy4vdXRpbHMvbWVtb3J5c3RvcmUnO1xyXG4vLyBsb2FkIHRoZSBkZWZhdWx0IHdvcmRzIHNldCBpZiBuZWVkZWRcclxuaWYgKExXLmlzT0sgJiYgTFcuaXNFbXB0eSkge1xyXG4gIGNvbnNvbGUubG9nKCdtZW1vcnlzdG9yZTogc3RhcnQgbG9hZGluZyB3b3JkcycpO1xyXG4gIExXLmxvYWRXb3JkcyhNZW1vcnlzdG9yZSk7XHJcbiAgY29uc29sZS5sb2coJ21lbW9yeXN0b3JlOiB3b3JkcyBoYXZlIGJlZW4gbG9hZGVkJyk7XHJcbn1cclxuXHJcbi8vIGltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4vdXRpbHMvbmF2aWdhdGlvbic7XHJcbi8vIGltcG9ydCBMb2NhbCBmcm9tICcuL2xvY2FsL2xvY2FsJztcclxuLy8gaW1wb3J0IEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zL2FjdGlvbnMnO1xyXG5sZXQgYTtcclxuaWYgKCdkZXZlbG9wbWVudCcgPT09IE5PREVfRU5WKSB7XHJcbiAgY29uc29sZS5sb2coYGRldmVsb3BtZW50IGVudmlyb25tZW50ICR7Tk9ERV9FTlZ9YCk7XHJcbn1cclxuLy8gcmVhZCBzZXR0aW5nc1xyXG5TZXR0aW5ncy5nZXRTZXR0aW5ncygpO1xyXG5cclxuLy8gc2V0IHVzZXIgc2F2ZWQgbG9jYWxcclxuLy9pZiAobG9jYWwuY3VycmVudExvY2FsICE9PSAkKCdbZGF0YS10eXBlPWxhbmctLy9zZWxlY3RdLnNlbGVjdGVkJykuZGF0YSgnbGFuZycpKSB7XHJcbi8vXHQkKCdbZGF0YS1sYW5nPScgKyBsb2NhbC5jdXJyZW50TG9jYWwgKyAnXScpLmNsaWNrKCk7XHJcbi8vfTtcclxuXHJcbi8vIFZvY2FidWxhcnkudmlld1dvcmQoKTtcclxuLy8gTGVhcm4ucmVjb3VudEluZGV4TGVhcm4oKTtcclxuLy8gTGVhcm4uc2hvd1dvcmQoKTtcclxuLy8gUmVwZWF0LnJlY291bnRJbmRleFJlcGVhdCgpO1xyXG4vLyBSZXBlYXQuc2hvd1dvcmQoKTtcclxuLy8gVXRpbHMuY2xvc2VNb2JNZW51KCk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy9tYWluLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIGxvY2Fsc3RvcmFnZS5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55QGdtYWlsLmNvbVxyXG4gKlxyXG4gKiBVcGRhdGVkIGJ5IEhhbm5lcyBIaXJ6ZWwsIE5vdmVtYmVyIDIwMTZcclxuICpcclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTFdDbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoZGJOYW1lKSB7XHJcbiAgICB0aGlzLmlzT0sgPSBmYWxzZTtcclxuICAgIGlmICghdGhpcy5pc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSgpKSB7XHJcbiAgICAgIGFsZXJ0KCdMb2NhbCBTdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUuJyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICB0aGlzLm5hbWUgPSBkYk5hbWU7XHJcbiAgICAvLyBnZXQgaW5kZXhcclxuICAgIHRoaXMuaW5kZXggPSBbXTtcclxuICAgIHZhciBzdHJJbmRleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSArICctd29yZHMnKTtcclxuICAgIGlmIChzdHJJbmRleCkge1xyXG4gICAgICB0aGlzLmluZGV4ID0gc3RySW5kZXguc3BsaXQoJywnKTtcclxuICAgIH07XHJcbiAgICB0aGlzLmlzT0sgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gd2luZG93ICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlYWRJdGVtKGtleSkge1xyXG4gICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbW92ZUl0ZW0oa2V5KSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdG9yZUl0ZW0oa2V5LCB2YWx1ZSkge1xyXG4gICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlID09PSBRVU9UQV9FWENFRURFRF9FUlIpIHtcclxuICAgICAgICAgIGFsZXJ0KCdMb2NhbCBTdG9yYWdlIGlzIGZ1bGwnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdXRTZXR0aW5ncyh0aGVTZXR0aW5nc09iaikge1xyXG4gICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy13b3Jkcy1zZXR0aW5ncycsIHRoZVNldHRpbmdzT2JqKTtcclxuICB9XHJcblxyXG4gIGdldFNldHRpbmdzKCkge1xyXG5cclxuICAgIHZhciBzZXR0aW5ncyA9IHRoaXMucmVhZEl0ZW0odGhpcy5uYW1lICsgJy13b3Jkcy1zZXR0aW5ncycpO1xyXG4gICAgaWYgKCFzZXR0aW5ncykge1xyXG4gICAgICAvLyB0aGUgYXBwIHJ1bnMgZm9yIHRoZSBmaXJzdCB0aW1lLCB0aHVzXHJcbiAgICAgIC8vIGluaXRpYWxpemUgdGhlIHNldHRpbmcgb2JqZWN0IG5lZWVkcyB0byBiZSBpbml0aWFsaXplZFxyXG4gICAgICAvLyB3aXRoIGRlZmF1bHQgdmFsdWVzLlxyXG5cclxuICAgICAgLy8gZmlyc3QgaXMgZm9yIGJveCAob3Igc3RlcCkgMSBpbiB0aGUgTGVpdG5lciBib3g7XHJcbiAgICAgIC8vICAgICAgIGFzayB0aGUgd29yZCBhZ2FpbiBhZnRlciAxIGRheVxyXG4gICAgICAvLyBzZWNvbmQgaXMgZm9yIGJveCAyIDsgYXNrIHRoZSB3b3JkIGFnYWluIGFmdGVyIDMgZGF5c1xyXG4gICAgICAvLyB0aGlyZCBpcyBmb3IgYm94IDMgOyBhc2sgdGhlIHdvcmQgYWdhaW4gYWZ0ZXIgNyBkYXlzXHJcblxyXG4gICAgICAvLyBOb3RlOiBib3ggMCBpcyBmb3IgdGhlIExlYXJuIG1vZGUgYW5kIGl0IG5vdCBzZXRcclxuICAgICAgLy8gYXMgdGhlIHdvcmRzIGFyZSBhY2Nlc3NpYmxlIGFsbCB0aGUgdGltZVxyXG4gICAgICBjb25zb2xlLmxvZygnaW5pdGlhbGl6ZSBzZXR0aW5ncycpO1xyXG4gICAgICBzZXR0aW5ncyA9IHtcclxuICAgICAgICBmaXJzdDogMSxcclxuICAgICAgICBzZWNvbmQ6IDMsXHJcbiAgICAgICAgdGhpcmQ6IDdcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy1zZXR0aW5ncycsIHNldHRpbmdzKTtcclxuICAgICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy1sYW5ndWFnZScsICdlbl9HQicpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNldHRpbmdzO1xyXG4gIH1cclxuXHJcbiAgbG9hZFdvcmRzKHRoZVdvcmRzKSB7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB2YXIgYXJyYXlPZktleXMgPSBbXTtcclxuICAgIGNvbnN0IHN0b3JlRWFjaEVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LmluZGV4ID0gJ2luZGV4JyArICsraTtcclxuICAgICAgZWxlbWVudC5zdGVwID0gZWxlbWVudC5kYXRlID0gMDtcclxuICAgICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy0nICsgZWxlbWVudC5pbmRleCwgZWxlbWVudCk7XHJcbiAgICAgIGFycmF5T2ZLZXlzLnB1c2goZWxlbWVudC5pbmRleCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoZVdvcmRzLmZvckVhY2goc3RvcmVFYWNoRWxlbWVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnN0b3JlSXRlbSh0aGlzLm5hbWUgKyAnLXdvcmRzJywgYXJyYXlPZktleXMuam9pbigpKTtcclxuICAgIHRoaXMuaW5kZXggPSBhcnJheU9mS2V5cztcclxuXHJcbiAgICBjb25zb2xlLmxvZyhhcnJheU9mS2V5cy5sZW5ndGggKyAnIHdvcmRzIGhhdmUgYmVlbiBsb2FkZWQnKTtcclxuXHJcbiAgfVxyXG5cclxuICBpc0VtcHR5KC8qa2V5Ki8pIHtcclxuICAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICAgcmV0dXJuICghdGhpcy5pbmRleC5sZW5ndGgpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZHVtcFdvcmRzKC8qYUtleVByZWZpeCovKSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgICd1c2Ugc3RyaWN0JztcclxuICAgICAgdmFyIGtleTtcclxuICAgICAgdmFyIHN0clZhbHVlO1xyXG4gICAgICB2YXIgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICB2YXIgcHJlZml4Rm9yTnVtYmVyID0gdGhpcy5uYW1lICsgJy1pbmRleCc7XHJcblxyXG4gICAgICAvLyBnbyB0aHJvdWdoIGFsbCBrZXlzIHN0YXJ0aW5nIHdpdGggdGhlIG5hbWVcclxuICAgICAgLy8gb2YgdGhlIGRhdGFiYXNlLCBpLmUgJ2xlYXJuV29yZHMtaW5kZXgxNCdcclxuICAgICAgLy8gY29sbGVjdCB0aGUgbWF0Y2hpbmcgb2JqZWN0cyBpbnRvIGFyclxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGtleSA9IGxvY2FsU3RvcmFnZS5rZXkoaSk7XHJcbiAgICAgICAgc3RyVmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG5cclxuICAgICAgICBpZiAoMCA9PT0ga2V5Lmxhc3RJbmRleE9mKHByZWZpeEZvck51bWJlciwgMCkpIHtcclxuICAgICAgICAgIHJlc3VsdC5wdXNoKEpTT04ucGFyc2Uoc3RyVmFsdWUpKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gRHVtcCB0aGUgYXJyYXkgYXMgSlNPTiBjb2RlIChmb3Igc2VsZWN0IGFsbCAvIGNvcHkpXHJcbiAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgIHZhciBrZXk7XHJcbiAgICAgIC8vIHZhciBzdDtcclxuICAgICAgdmFyIGtleXNUb0RlbGV0ZSA9IFtdO1xyXG5cclxuICAgICAgLy8gZ28gdGhyb3VnaCBhbGwga2V5cyBzdGFydGluZyB3aXRoIHRoZSBuYW1lXHJcbiAgICAgIC8vIG9mIHRoZSBkYXRhYmFzZSwgaS5lICdsZWFybldvcmRzLWluZGV4MTQnXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcclxuICAgICAgICBzdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblxyXG4gICAgICAgIGlmICgwID09PSBrZXkubGFzdEluZGV4T2YoYUtleVByZWZpeCwgMCkpIHtcclxuICAgICAgICAgIGtleXNUb0RlbGV0ZS5wdXNoKGtleSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfTtcclxuICAgICAgLy8gbm93IHdlIGhhdmUgYWxsIHRoZSBrZXlzIHdoaWNoIHNob3VsZCBiZSBkZWxldGVkXHJcbiAgICAgIC8vIGluIHRoZSBhcnJheSBrZXlzVG9EZWxldGUuXHJcbiAgICAgIGNvbnNvbGUubG9nKGtleXNUb0RlbGV0ZSk7XHJcbiAgICAgIGtleXNUb0RlbGV0ZS5mb3JFYWNoKGZ1bmN0aW9uIChhS2V5KSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oYUtleSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlV29yZHMoKSB7XHJcbiAgICB2YXIgYUtleVByZWZpeCA9IHRoaXMubmFtZSArICctaW5kZXgnO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KTtcclxuICAgIC8vIHJlc2V0IGluZGV4XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm5hbWUgKyAnLXdvcmRzJywgJycpO1xyXG4gICAgLy8gdGhpcyBvbmUgdHJpZ2dlcnMgdGhhdCBtZW1vcnlzdG9yZSBpcyBleGVjdXRlZFxyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5uYW1lICsgJy1zZXR0aW5ncycpO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSgpIHtcclxuICAgIHZhciBhS2V5UHJlZml4ID0gdGhpcy5uYW1lO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KTtcclxuICB9XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy91dGlscy9MVy5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIHRoaXMuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiAqXHJcbiAqIFVwZGF0ZWQgYnkgSGFubmVzIEhpcnplbCwgTm92ZW1iZXIgMjAxNlxyXG4gKlxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuLi8uLi9qcy91dGlscy9MVyc7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzQ2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pbnB1dEZpcnN0Q2hlY2sgPSAkKCcjaW5wdXRGaXJzdENoZWNrJyk7XHJcbiAgICB0aGlzLmlucHV0U2Vjb25kQ2hlY2sgPSAkKCcjaW5wdXRTZWNvbmRDaGVjaycpO1xyXG4gICAgdGhpcy5pbnB1dFRoaXJkQ2hlY2sgPSAkKCcjaW5wdXRUaGlyZENoZWNrJyk7XHJcbiAgICB0aGlzLnNldHRpbmdGcm9tID0gJCgnI3NldHRpbmdGcm9tJyk7XHJcbiAgICB0aGlzLmVycm9yU2V0dGluZ3MgPSAkKCcjZXJyb3JTZXR0aW5ncycpO1xyXG5cclxuICAgIHRoaXMucGFyYW1zID0ge307XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI3NhdmVTZXR0aW5ncycsIHRoaXMuc2F2ZVNldHRpbmcpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI2NhbmNlbFNldHRpbmdzJywgdGhpcy5jYW5jZWxTZXR0aW5nKTtcclxuICB9XHJcbiAgZ2V0U2V0dGluZ3MoKSB7IC8vcmVhZCBzZXR0aW5nJ3MgdmFsdWVzXHJcbiAgICB2YXIgc3RvcmVkU2V0dGluZ3MgPSBMVy5nZXRTZXR0aW5ncygpO1xyXG5cclxuICAgICQodGhpcy5pbnB1dEZpcnN0Q2hlY2spLnZhbChzdG9yZWRTZXR0aW5ncy5maXJzdCk7XHJcbiAgICAkKHRoaXMuaW5wdXRTZWNvbmRDaGVjaykudmFsKHN0b3JlZFNldHRpbmdzLnNlY29uZCk7XHJcbiAgICAkKHRoaXMuaW5wdXRUaGlyZENoZWNrKS52YWwoc3RvcmVkU2V0dGluZ3MudGhpcmQpO1xyXG5cclxuICAgIHRoaXMucGFyYW1zID0gc3RvcmVkU2V0dGluZ3M7IC8vc3RvcmUgbG9jYWxcclxuICB9XHJcblxyXG4gIHNhdmVTZXR0aW5nKCkgeyAvL3NhdmUgc2V0dGluZydzIHZhbHVlcyB0byBEQlxyXG4gICAgICB2YXIgZmlyc3QgPSAkKHRoaXMuaW5wdXRGaXJzdENoZWNrKS52YWwoKS50cmltKCksXHJcbiAgICAgICAgc2Vjb25kID0gJCh0aGlzLmlucHV0U2Vjb25kQ2hlY2spLnZhbCgpLnRyaW0oKSxcclxuICAgICAgICB0aGlyZCA9ICQodGhpcy5pbnB1dFRoaXJkQ2hlY2spLnZhbCgpLnRyaW0oKSxcclxuICAgICAgICBmb3JtID0gJCh0aGlzLnNldHRpbmdGcm9tKSxcclxuICAgICAgICBlcnJvck5hbWUgPSAnJyxcclxuICAgICAgICBlcnJvciA9IGZhbHNlO1xyXG5cclxuICAgICAgVXRpbHMuY2xlYXJGaWVsZHMoKTtcclxuICAgICAgLy9jaGVjayBmb3IgZW1wdHkgZmllbGRzXHJcbiAgICAgIGlmICghZmlyc3QpIHtcclxuICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpKTtcclxuICAgICAgICBlcnJvck5hbWUgPSAnZW1wdHknO1xyXG4gICAgICB9IGVsc2UgaWYgKCFzZWNvbmQpIHtcclxuICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpKTtcclxuICAgICAgICBlcnJvck5hbWUgPSAnZW1wdHknO1xyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlyZCkge1xyXG4gICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykpO1xyXG4gICAgICAgIGVycm9yTmFtZSA9ICdlbXB0eSc7XHJcbiAgICAgIH0gZWxzZSB7IC8vb25seSBkaWdpdHMgaXMgdmFsaWRcclxuICAgICAgICBpZiAoIVV0aWxzLmlzTnVtYmVyKGZpcnN0KSkge1xyXG4gICAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKSk7XHJcbiAgICAgICAgICBlcnJvck5hbWUgPSAnbnVtYmVyJztcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIoc2Vjb25kKSkge1xyXG4gICAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKSk7XHJcbiAgICAgICAgICBlcnJvck5hbWUgPSAnbnVtYmVyJztcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIodGhpcmQpKSB7XHJcbiAgICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpKTtcclxuICAgICAgICAgIGVycm9yTmFtZSA9ICdudW1iZXInO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGVycm9yKSB7IC8vc2hvdyBlcnJvciBpZiBhbnlcclxuICAgICAgICB2YXIgZXJyb3JUeHQgPSAoJ2VtcHR5JyA9PT0gZXJyb3JOYW1lKSA/IGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JFbXB0eSA6IGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JWYWxpZDtcclxuICAgICAgICAkKHRoaXMuZXJyb3JTZXR0aW5ncykucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpLnRleHQoZXJyb3JUeHQpO1xyXG4gICAgICB9IGVsc2UgeyAvL290aGVyd2lzZSBzYXZlIG5ldyBzZXR0aW5nc1xyXG4gICAgICAgIHNldHRpbmdzID0ge1xyXG4gICAgICAgICAgZmlyc3Q6IGZpcnN0LFxyXG4gICAgICAgICAgc2Vjb25kOiBzZWNvbmQsXHJcbiAgICAgICAgICB0aGlyZDogdGhpcmRcclxuICAgICAgICB9O1xyXG4gICAgICAgIExXLnB1dFNldHRpbmdzKHNldHRpbmdzKTtcclxuICAgICAgICAkKHRoaXMuZXJyb3JTZXR0aW5ncykucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpLnRleHQobG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5lcnJvck5vKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBzZXR0aW5nczsgLy9zdG9yZSBsb2NhbFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNhbmNlbFNldHRpbmcoKSB7XHJcbiAgICAgIFV0aWxzLmNsZWFyRmllbGRzKCk7XHJcbiAgICAgIHRoaXMuZ2V0U2V0dGluZ3MoKTtcclxuICAgIH1cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gdXRpbHMuanNcclxuICogY29kZWQgYnkgQW5hdG9saWkgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGUxcjBuZC5jcmdAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmlmICh0eXBlb2YgKFV0aWxzKSA9PSAndW5kZWZpbmVkJyB8fCBVdGlscyA9PSBudWxsIHx8ICFVdGlscykge1xyXG4gIHZhciBVdGlscyA9IHt9O1xyXG5cclxuICBVdGlscyA9IHtcclxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbiAoc3RyLCB3aXRoRG90KSB7IC8vdmFsaWRhdGUgZmlsZWQgZm9yIG51bWJlciB2YWx1ZVxyXG4gICAgICB2YXIgTnVtYmVyUmVnID0gL15cXGQrJC8sXHJcbiAgICAgICAgTnVtYmVyV2l0aERvdFJlZyA9IC9eWy0rXT9bMC05XSpcXC4/WzAtOV0rJC87XHJcblxyXG4gICAgICByZXR1cm4gd2l0aERvdCA/IE51bWJlcldpdGhEb3RSZWcudGVzdChzdHIpIDogTnVtYmVyUmVnLnRlc3Qoc3RyKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJGaWVsZHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLmZvcm0tZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uIChpLCBub2RlKSB7IC8vY2xlYXIgYWxsIGVycm9yIHN0eWxlc1xyXG4gICAgICAgICQobm9kZSkucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnI2Vycm9yU2V0dGluZ3MnKS5hZGRDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEZpZWxkRXJyb3I6IGZ1bmN0aW9uIChzZWxmKSB7IC8vc2V0IHRoZSBlcnJvciBzdHlsZSBmb3IgdGhlIGN1cnJlbnQgaW5wdXQgZmllbGRcclxuICAgICAgJChzZWxmKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSYW5kb21JbnQ6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0VG9kYXk6IGZ1bmN0aW9uIChmdWxsRGF0ZSkge1xyXG4gICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgIGlmIChmdWxsRGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpKS52YWx1ZU9mKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xvc2VNb2JNZW51OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkKCcjYnMtZXhhbXBsZS1uYXZiYXItY29sbGFwc2UtMScpLmhhc0NsYXNzKCdpbicpKSB7XHJcbiAgICAgICAgJCgnI25hdmJhclRvZ2dsZScpLmNsaWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2h1ZmZsZTogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdmFyIGosIHgsIGk7XHJcbiAgICAgIGZvciAoaSA9IGEubGVuZ3RoOyBpOyBpLS0pIHtcclxuICAgICAgICBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSk7XHJcbiAgICAgICAgeCA9IGFbaSAtIDFdO1xyXG4gICAgICAgIGFbaSAtIDFdID0gYVtqXTtcclxuICAgICAgICBhW2pdID0geDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAhPSBudWxsKSB7XHJcbiAgICBleHBvcnRzLlV0aWxzID0gVXRpbHM7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL3V0aWxzL3V0aWxzLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIG1lbW9yeXN0b3JlLmpzXHJcbiAqIGNvZGVkIGJ5IEFuYXRvbCBNYXJlemhhbnlpIGFrYSBlMXIwbmQvL1tDUkddIC0gSmFudWFyeSAyMDE3XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjb25zdCBNZW1vcnlzdG9yZSA9IFtcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgxJyxcclxuICAgICd3b3JkJzogJ2RhcyBBdXRvJyxcclxuICAgICd0cmFuc2xhdGUnOiAnY2FyJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MicsXHJcbiAgICAnd29yZCc6ICdsYXVmZW4nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdydW4nLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgzJyxcclxuICAgICd3b3JkJzogJ2FsdCcsXHJcbiAgICAndHJhbnNsYXRlJzogJ29sZCcsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDQnLFxyXG4gICAgJ3dvcmQnOiAna3JhbmsnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdzaWNrJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sIHtcclxuICAgICdpbmRleCc6ICdpbmRleDUnLFxyXG4gICAgJ3dvcmQnOiAnaGV1dGUnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICd0b2RheScsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LCB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg2JyxcclxuICAgICd3b3JkJzogJ3NjaHJlaWJlbicsXHJcbiAgICAndHJhbnNsYXRlJzogJ3dyaXRlJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sIHtcclxuICAgICdpbmRleCc6ICdpbmRleDcnLFxyXG4gICAgJ3dvcmQnOiAnaGVsbCcsXHJcbiAgICAndHJhbnNsYXRlJzogJ2xpZ2h0JyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4OCcsXHJcbiAgICAnd29yZCc6ICdyZWljaCcsXHJcbiAgICAndHJhbnNsYXRlJzogJ3JpY2gnLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg5JyxcclxuICAgICd3b3JkJzogJ3PDvMOfJyxcclxuICAgICd0cmFuc2xhdGUnOiAnc3dlZXQnLFxyXG4gICAgJ3N0ZXAnOiAxLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgxMCcsXHJcbiAgICAnd29yZCc6ICd3ZWlibGljaCcsXHJcbiAgICAndHJhbnNsYXRlJzogJ2ZlbWFsZScsXHJcbiAgICAnc3RlcCc6IDEsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LCB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgxMScsXHJcbiAgICAnd29yZCc6ICdiZXN0ZWxsZW4nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdvcmRlcicsXHJcbiAgICAnc3RlcCc6IDEsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDEyJyxcclxuICAgICd3b3JkJzogJ2thbHQnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdjb2xkJyxcclxuICAgICdzdGVwJzogMixcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MTMnLFxyXG4gICAgJ3dvcmQnOiAnc2F1ZXInLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdzb3VyJyxcclxuICAgICdzdGVwJzogMixcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MTQnLFxyXG4gICAgJ3dvcmQnOiAnZmxpZWdlbicsXHJcbiAgICAndHJhbnNsYXRlJzogJ2ZseScsXHJcbiAgICAnc3RlcCc6IDMsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9XHJcbl07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy91dGlscy9tZW1vcnlzdG9yZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=