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
	
	var _navigation = __webpack_require__(5);
	
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
	
	// const {Navigation} = new NavigationObject();
	_navigation.Navigation.init();
	
	// import Local from './local/local';
	// import Actions from './actions/actions';
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
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	if (typeof Utils == 'undefined' || Utils == null || !Utils) {
	  var Utils = {};
	
	  exports.Utils = Utils = {
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
	
	exports.Utils = Utils;

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Navigation = undefined;
	
	var _utils = __webpack_require__(3);
	
	var Navigation = {}; /**************************************************
	                      * Learn Words // navigation.js
	                      * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	                      * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
	                      * Placed in public domain.
	                      **************************************************/
	
	
	exports.Navigation = Navigation = {
	  hashguard: function hashguard(init) {
	    //onHashChange
	    if (init) {
	      this.hash = window.location.hash;
	    }
	    if (this.hash !== window.location.hash) {
	      $(window).trigger('hashbreak', {
	        'prevhash': this.hash
	      });
	      this.hash = window.location.hash;
	    }
	    setTimeout(this.hashguard.bind(this), 50);
	  },
	
	  hashbreak: function hashbreak() {
	    //hashchange event
	    var hashUrl = window.location.hash.slice(3);
	
	    if (hashUrl) {
	      $('[data-target=' + window.location.hash.slice(3) + ']').click();
	    } else {
	      $('[data-target=summary]').click();
	    }
	  },
	
	  navSelect: function navSelect() {
	    $('[data-toggle=nav]').each(function () {
	      $(this).addClass('nodisplay');
	    });
	    $('[data-type=nav-select-li]').each(function () {
	      $(this).removeClass('active');
	    });
	    $(this).parent().addClass('active');
	    $('#' + $(this).data('target')).removeClass('nodisplay');
	    _utils.Utils.closeMobMenu();
	  },
	
	  init: function init() {
	    $(document).on('click touchstart', '[data-type=nav-select]', this.navSelect);
	    $(window).bind('hashbreak', this.hashbreak);
	    this.hashguard(false);
	  }
	};
	
	exports.Navigation = Navigation;

/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvTFcuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pzL3V0aWxzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL2FwcC9qcy91dGlscy9tZW1vcnlzdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvbmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJMVyIsImNvbnNvbGUiLCJsb2ciLCJpc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSIsIlNldHRpbmdzIiwiaXNPSyIsImlzRW1wdHkiLCJsb2FkV29yZHMiLCJpbml0IiwiZ2V0U2V0dGluZ3MiLCJMV0NsYXNzIiwiZGJOYW1lIiwiYWxlcnQiLCJuYW1lIiwiaW5kZXgiLCJzdHJJbmRleCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzcGxpdCIsIndpbmRvdyIsImUiLCJrZXkiLCJKU09OIiwicGFyc2UiLCJyZW1vdmVJdGVtIiwidmFsdWUiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiUVVPVEFfRVhDRUVERURfRVJSIiwidGhlU2V0dGluZ3NPYmoiLCJzdG9yZUl0ZW0iLCJzZXR0aW5ncyIsInJlYWRJdGVtIiwiZmlyc3QiLCJzZWNvbmQiLCJ0aGlyZCIsInRoZVdvcmRzIiwiaSIsImFycmF5T2ZLZXlzIiwic3RvcmVFYWNoRWxlbWVudCIsImVsZW1lbnQiLCJzdGVwIiwiZGF0ZSIsInB1c2giLCJmb3JFYWNoIiwiYmluZCIsImpvaW4iLCJsZW5ndGgiLCJzdHJWYWx1ZSIsInJlc3VsdCIsInByZWZpeEZvck51bWJlciIsImxhc3RJbmRleE9mIiwiYUtleVByZWZpeCIsImtleXNUb0RlbGV0ZSIsInN0IiwiYUtleSIsInJlbW92ZU9iamVjdHMiLCJTZXR0aW5nc0NsYXNzIiwiaW5wdXRGaXJzdENoZWNrIiwiJCIsImlucHV0U2Vjb25kQ2hlY2siLCJpbnB1dFRoaXJkQ2hlY2siLCJzZXR0aW5nRnJvbSIsImVycm9yU2V0dGluZ3MiLCJwYXJhbXMiLCJkb2N1bWVudCIsIm9uIiwic2F2ZVNldHRpbmciLCJjYW5jZWxTZXR0aW5nIiwic3RvcmVkU2V0dGluZ3MiLCJ2YWwiLCJ0cmltIiwiZm9ybSIsImVycm9yTmFtZSIsImVycm9yIiwiVXRpbHMiLCJjbGVhckZpZWxkcyIsInNldEZpZWxkRXJyb3IiLCJjaGlsZHJlbiIsImlzTnVtYmVyIiwiZXJyb3JUeHQiLCJsb2NhbCIsImN1cnJlbnRMb2NhbCIsImVycm9yRW1wdHkiLCJlcnJvclZhbGlkIiwicmVtb3ZlQ2xhc3MiLCJ0ZXh0IiwicHV0U2V0dGluZ3MiLCJlcnJvck5vIiwic3RyIiwid2l0aERvdCIsIk51bWJlclJlZyIsIk51bWJlcldpdGhEb3RSZWciLCJ0ZXN0IiwiZWFjaCIsIm5vZGUiLCJhZGRDbGFzcyIsInNlbGYiLCJnZXRSYW5kb21JbnQiLCJtaW4iLCJtYXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZXRUb2RheSIsImZ1bGxEYXRlIiwibm93IiwiRGF0ZSIsInZhbHVlT2YiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImNsb3NlTW9iTWVudSIsImhhc0NsYXNzIiwiY2xpY2siLCJzaHVmZmxlIiwiYSIsImoiLCJ4IiwibW9kdWxlIiwiZXhwb3J0cyIsIk1lbW9yeXN0b3JlIiwiTmF2aWdhdGlvbiIsImhhc2hndWFyZCIsImhhc2giLCJsb2NhdGlvbiIsInRyaWdnZXIiLCJzZXRUaW1lb3V0IiwiaGFzaGJyZWFrIiwiaGFzaFVybCIsInNsaWNlIiwibmF2U2VsZWN0IiwicGFyZW50IiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7QUFNQTs7OztBQUdBOzs7O0FBRUE7O0FBU0E7Ozs7QUFuQkE7QUFDQSxLQUFNQSxLQUFLLGlCQUFZLE1BQVosQ0FBWDtBQUNBO0FBQ0FDLFNBQVFDLEdBQVIsQ0FBWUYsR0FBR0csdUJBQUgsRUFBWjs7QUFHQSxLQUFNQyxXQUFXLHdCQUFqQjs7QUFLQTtBQUNBLEtBQUlKLEdBQUdLLElBQUgsSUFBV0wsR0FBR00sT0FBbEIsRUFBMkI7QUFDekJMLFdBQVFDLEdBQVIsQ0FBWSxrQ0FBWjtBQUNBRixNQUFHTyxTQUFIO0FBQ0FOLFdBQVFDLEdBQVIsQ0FBWSxxQ0FBWjtBQUNEOztBQUVEOztBQUVBO0FBQ0Esd0JBQVdNLElBQVg7O0FBRUE7QUFDQTtBQUNBLEtBQUksSUFBSixFQUFnQztBQUM5QlAsV0FBUUMsR0FBUiw4QkFBdUMsZUFBdkM7QUFDRDtBQUNEO0FBQ0FFLFVBQVNLLFdBQVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCOzs7Ozs7Ozs7Ozs7Ozs7O0FDbERBOzs7Ozs7Ozs7S0FTcUJDLE87QUFDbkIsb0JBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEIsVUFBS04sSUFBTCxHQUFZLEtBQVo7QUFDQSxTQUFJLENBQUMsS0FBS0YsdUJBQUwsRUFBTCxFQUFxQztBQUNuQ1MsYUFBTSxpQ0FBTjtBQUNBLGNBQU8sS0FBUDtBQUNEO0FBQ0QsVUFBS0MsSUFBTCxHQUFZRixNQUFaO0FBQ0E7QUFDQSxVQUFLRyxLQUFMLEdBQWEsRUFBYjtBQUNBLFNBQUlDLFdBQVdDLGFBQWFDLE9BQWIsQ0FBcUIsS0FBS0osSUFBTCxHQUFZLFFBQWpDLENBQWY7QUFDQSxTQUFJRSxRQUFKLEVBQWM7QUFDWixZQUFLRCxLQUFMLEdBQWFDLFNBQVNHLEtBQVQsQ0FBZSxHQUFmLENBQWI7QUFDRDtBQUNELFVBQUtiLElBQUwsR0FBWSxJQUFaO0FBQ0Q7Ozs7K0NBRXlCO0FBQ3hCLFdBQUk7QUFDRixnQkFBT2MsVUFBVUEsT0FBT0gsWUFBeEI7QUFDRCxRQUZELENBRUUsT0FBT0ksQ0FBUCxFQUFVO0FBQ1YsZ0JBQU8sS0FBUDtBQUNEO0FBQ0Y7Ozs4QkFFUUMsRyxFQUFLO0FBQ1osV0FBSSxLQUFLaEIsSUFBVCxFQUFlO0FBQ2IsZ0JBQU9pQixLQUFLQyxLQUFMLENBQVdQLGFBQWFDLE9BQWIsQ0FBcUJJLEdBQXJCLENBQVgsQ0FBUDtBQUNEO0FBQ0Y7OztnQ0FFVUEsRyxFQUFLO0FBQ2QsV0FBSSxLQUFLaEIsSUFBVCxFQUFlO0FBQ2JXLHNCQUFhUSxVQUFiLENBQXdCSCxHQUF4QjtBQUNEO0FBQ0Y7OzsrQkFFU0EsRyxFQUFLSSxLLEVBQU87QUFDcEIsV0FBSSxLQUFLcEIsSUFBVCxFQUFlO0FBQ2IsYUFBSTtBQUNGVyx3QkFBYVUsT0FBYixDQUFxQkwsR0FBckIsRUFBMEJDLEtBQUtLLFNBQUwsQ0FBZUYsS0FBZixDQUExQjtBQUNELFVBRkQsQ0FFRSxPQUFPTCxDQUFQLEVBQVU7QUFDVixlQUFJQSxNQUFNUSxrQkFBVixFQUE4QjtBQUM1QmhCLG1CQUFNLHVCQUFOO0FBQ0Q7QUFDRCxrQkFBTyxLQUFQO0FBQ0Q7QUFDRjtBQUNGOzs7aUNBRVdpQixjLEVBQWdCO0FBQzFCLFlBQUtDLFNBQUwsQ0FBZSxLQUFLakIsSUFBTCxHQUFZLGlCQUEzQixFQUE4Q2dCLGNBQTlDO0FBQ0Q7OzttQ0FFYTs7QUFFWixXQUFJRSxXQUFXLEtBQUtDLFFBQUwsQ0FBYyxLQUFLbkIsSUFBTCxHQUFZLGlCQUExQixDQUFmO0FBQ0EsV0FBSSxDQUFDa0IsUUFBTCxFQUFlO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTlCLGlCQUFRQyxHQUFSLENBQVkscUJBQVo7QUFDQTZCLG9CQUFXO0FBQ1RFLGtCQUFPLENBREU7QUFFVEMsbUJBQVEsQ0FGQztBQUdUQyxrQkFBTztBQUhFLFVBQVg7QUFLQSxjQUFLTCxTQUFMLENBQWUsS0FBS2pCLElBQUwsR0FBWSxXQUEzQixFQUF3Q2tCLFFBQXhDO0FBQ0EsY0FBS0QsU0FBTCxDQUFlLEtBQUtqQixJQUFMLEdBQVksV0FBM0IsRUFBd0MsT0FBeEM7QUFFRDs7QUFFRCxjQUFPa0IsUUFBUDtBQUNEOzs7K0JBRVNLLFEsRUFBVTtBQUNsQixXQUFJQyxJQUFJLENBQVI7QUFDQSxXQUFJQyxjQUFjLEVBQWxCO0FBQ0EsV0FBTUMsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBVUMsT0FBVixFQUFtQjtBQUMxQ0EsaUJBQVExQixLQUFSLEdBQWdCLFVBQVUsRUFBRXVCLENBQTVCO0FBQ0FHLGlCQUFRQyxJQUFSLEdBQWVELFFBQVFFLElBQVIsR0FBZSxDQUE5QjtBQUNBLGNBQUtaLFNBQUwsQ0FBZSxLQUFLakIsSUFBTCxHQUFZLEdBQVosR0FBa0IyQixRQUFRMUIsS0FBekMsRUFBZ0QwQixPQUFoRDtBQUNBRixxQkFBWUssSUFBWixDQUFpQkgsUUFBUTFCLEtBQXpCO0FBQ0QsUUFMRDs7QUFPQXNCLGdCQUFTUSxPQUFULENBQWlCTCxpQkFBaUJNLElBQWpCLENBQXNCLElBQXRCLENBQWpCOztBQUVBLFlBQUtmLFNBQUwsQ0FBZSxLQUFLakIsSUFBTCxHQUFZLFFBQTNCLEVBQXFDeUIsWUFBWVEsSUFBWixFQUFyQztBQUNBLFlBQUtoQyxLQUFMLEdBQWF3QixXQUFiOztBQUVBckMsZUFBUUMsR0FBUixDQUFZb0MsWUFBWVMsTUFBWixHQUFxQix5QkFBakM7QUFDRDs7OytCQUVPLE9BQVM7QUFDZixXQUFJLEtBQUsxQyxJQUFULEVBQWU7QUFDYixnQkFBUSxDQUFDLEtBQUtTLEtBQUwsQ0FBV2lDLE1BQWIsR0FBdUIsSUFBdkIsR0FBOEIsS0FBckM7QUFDRDtBQUNGOzs7aUNBRVMsY0FBZ0I7QUFDeEIsV0FBSSxLQUFLMUMsSUFBVCxFQUFlO0FBQ2I7QUFDQSxhQUFJZ0IsR0FBSjtBQUNBLGFBQUkyQixRQUFKO0FBQ0EsYUFBSUMsU0FBUyxFQUFiOztBQUVBLGFBQUlDLGtCQUFrQixLQUFLckMsSUFBTCxHQUFZLFFBQWxDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQUssSUFBSXdCLElBQUksQ0FBYixFQUFnQkEsSUFBSXJCLGFBQWErQixNQUFqQyxFQUF5Q1YsR0FBekMsRUFBOEM7QUFDNUNoQixpQkFBTUwsYUFBYUssR0FBYixDQUFpQmdCLENBQWpCLENBQU47QUFDQVcsc0JBQVdoQyxhQUFhQyxPQUFiLENBQXFCSSxHQUFyQixDQUFYOztBQUVBLGVBQUksTUFBTUEsSUFBSThCLFdBQUosQ0FBZ0JELGVBQWhCLEVBQWlDLENBQWpDLENBQVYsRUFBK0M7QUFDN0NELG9CQUFPTixJQUFQLENBQVlyQixLQUFLQyxLQUFMLENBQVd5QixRQUFYLENBQVo7QUFDRDtBQUNGOztBQUVEO0FBQ0EvQyxpQkFBUUMsR0FBUixDQUFZb0IsS0FBS0ssU0FBTCxDQUFlc0IsTUFBZixDQUFaO0FBQ0Q7QUFDRjs7O21DQUVhRyxVLEVBQVk7QUFDeEIsV0FBSSxLQUFLL0MsSUFBVCxFQUFlO0FBQ2IsYUFBSWdCLEdBQUo7QUFDQTtBQUNBLGFBQUlnQyxlQUFlLEVBQW5COztBQUVBO0FBQ0E7QUFDQSxjQUFLLElBQUloQixJQUFJLENBQWIsRUFBZ0JBLElBQUlyQixhQUFhK0IsTUFBakMsRUFBeUNWLEdBQXpDLEVBQThDO0FBQzVDaEIsaUJBQU1MLGFBQWFLLEdBQWIsQ0FBaUJnQixDQUFqQixDQUFOO0FBQ0FpQixnQkFBS3RDLGFBQWFDLE9BQWIsQ0FBcUJJLEdBQXJCLENBQUw7O0FBRUEsZUFBSSxNQUFNQSxJQUFJOEIsV0FBSixDQUFnQkMsVUFBaEIsRUFBNEIsQ0FBNUIsQ0FBVixFQUEwQztBQUN4Q0MsMEJBQWFWLElBQWIsQ0FBa0J0QixHQUFsQjtBQUNEO0FBQ0Y7QUFDRDtBQUNBO0FBQ0FwQixpQkFBUUMsR0FBUixDQUFZbUQsWUFBWjtBQUNBQSxzQkFBYVQsT0FBYixDQUFxQixVQUFVVyxJQUFWLEVBQWdCO0FBQ25DdkMsd0JBQWFRLFVBQWIsQ0FBd0IrQixJQUF4QjtBQUNELFVBRkQ7QUFHRDtBQUNGOzs7bUNBRWE7QUFDWixXQUFJSCxhQUFhLEtBQUt2QyxJQUFMLEdBQVksUUFBN0I7O0FBRUEsWUFBSzJDLGFBQUwsQ0FBbUJKLFVBQW5CO0FBQ0E7QUFDQXBDLG9CQUFhVSxPQUFiLENBQXFCLEtBQUtiLElBQUwsR0FBWSxRQUFqQyxFQUEyQyxFQUEzQztBQUNBO0FBQ0FHLG9CQUFhUSxVQUFiLENBQXdCLEtBQUtYLElBQUwsR0FBWSxXQUFwQztBQUNEOzs7K0JBRVM7QUFDUixXQUFJdUMsYUFBYSxLQUFLdkMsSUFBdEI7O0FBRUEsWUFBSzJDLGFBQUwsQ0FBbUJKLFVBQW5CO0FBQ0Q7Ozs7OzttQkE1S2tCMUMsTztBQTZLcEIsRTs7Ozs7Ozs7Ozs7O3NqQkN0TEQ7Ozs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7O0FBQ0EsS0FBTVYsS0FBSyxpQkFBWSxNQUFaLENBQVg7O0tBRXFCeUQsYTtBQUNuQiw0QkFBYztBQUFBOztBQUNaLFVBQUtDLGVBQUwsR0FBdUJDLEVBQUUsa0JBQUYsQ0FBdkI7QUFDQSxVQUFLQyxnQkFBTCxHQUF3QkQsRUFBRSxtQkFBRixDQUF4QjtBQUNBLFVBQUtFLGVBQUwsR0FBdUJGLEVBQUUsa0JBQUYsQ0FBdkI7QUFDQSxVQUFLRyxXQUFMLEdBQW1CSCxFQUFFLGNBQUYsQ0FBbkI7QUFDQSxVQUFLSSxhQUFMLEdBQXFCSixFQUFFLGdCQUFGLENBQXJCOztBQUVBLFVBQUtLLE1BQUwsR0FBYyxFQUFkOztBQUVBTCxPQUFFTSxRQUFGLEVBQVlDLEVBQVosQ0FBZSxrQkFBZixFQUFtQyxlQUFuQyxFQUFvRCxLQUFLQyxXQUF6RDtBQUNBUixPQUFFTSxRQUFGLEVBQVlDLEVBQVosQ0FBZSxrQkFBZixFQUFtQyxpQkFBbkMsRUFBc0QsS0FBS0UsYUFBM0Q7QUFDRDs7OzttQ0FDYTtBQUFFO0FBQ2QsV0FBSUMsaUJBQWlCckUsR0FBR1MsV0FBSCxFQUFyQjs7QUFFQWtELFNBQUUsS0FBS0QsZUFBUCxFQUF3QlksR0FBeEIsQ0FBNEJELGVBQWVwQyxLQUEzQztBQUNBMEIsU0FBRSxLQUFLQyxnQkFBUCxFQUF5QlUsR0FBekIsQ0FBNkJELGVBQWVuQyxNQUE1QztBQUNBeUIsU0FBRSxLQUFLRSxlQUFQLEVBQXdCUyxHQUF4QixDQUE0QkQsZUFBZWxDLEtBQTNDOztBQUVBLFlBQUs2QixNQUFMLEdBQWNLLGNBQWQsQ0FQWSxDQU9rQjtBQUMvQjs7O21DQUVhO0FBQUU7QUFDWixXQUFJcEMsUUFBUTBCLEVBQUUsS0FBS0QsZUFBUCxFQUF3QlksR0FBeEIsR0FBOEJDLElBQTlCLEVBQVo7QUFBQSxXQUNFckMsU0FBU3lCLEVBQUUsS0FBS0MsZ0JBQVAsRUFBeUJVLEdBQXpCLEdBQStCQyxJQUEvQixFQURYO0FBQUEsV0FFRXBDLFFBQVF3QixFQUFFLEtBQUtFLGVBQVAsRUFBd0JTLEdBQXhCLEdBQThCQyxJQUE5QixFQUZWO0FBQUEsV0FHRUMsT0FBT2IsRUFBRSxLQUFLRyxXQUFQLENBSFQ7QUFBQSxXQUlFVyxZQUFZLEVBSmQ7QUFBQSxXQUtFQyxRQUFRLEtBTFY7O0FBT0FDLGFBQU1DLFdBQU47QUFDQTtBQUNBLFdBQUksQ0FBQzNDLEtBQUwsRUFBWTtBQUNWeUMsaUJBQVFDLE1BQU1FLGFBQU4sQ0FBb0JMLEtBQUtNLFFBQUwsQ0FBYyxlQUFkLENBQXBCLENBQVI7QUFDQUwscUJBQVksT0FBWjtBQUNELFFBSEQsTUFHTyxJQUFJLENBQUN2QyxNQUFMLEVBQWE7QUFDbEJ3QyxpQkFBUUMsTUFBTUUsYUFBTixDQUFvQkwsS0FBS00sUUFBTCxDQUFjLGVBQWQsQ0FBcEIsQ0FBUjtBQUNBTCxxQkFBWSxPQUFaO0FBQ0QsUUFITSxNQUdBLElBQUksQ0FBQ3RDLEtBQUwsRUFBWTtBQUNqQnVDLGlCQUFRQyxNQUFNRSxhQUFOLENBQW9CTCxLQUFLTSxRQUFMLENBQWMsZUFBZCxDQUFwQixDQUFSO0FBQ0FMLHFCQUFZLE9BQVo7QUFDRCxRQUhNLE1BR0E7QUFBRTtBQUNQLGFBQUksQ0FBQ0UsTUFBTUksUUFBTixDQUFlOUMsS0FBZixDQUFMLEVBQTRCO0FBQzFCeUMsbUJBQVFDLE1BQU1FLGFBQU4sQ0FBb0JMLEtBQUtNLFFBQUwsQ0FBYyxlQUFkLENBQXBCLENBQVI7QUFDQUwsdUJBQVksUUFBWjtBQUNEO0FBQ0QsYUFBSSxDQUFDRSxNQUFNSSxRQUFOLENBQWU3QyxNQUFmLENBQUwsRUFBNkI7QUFDM0J3QyxtQkFBUUMsTUFBTUUsYUFBTixDQUFvQkwsS0FBS00sUUFBTCxDQUFjLGVBQWQsQ0FBcEIsQ0FBUjtBQUNBTCx1QkFBWSxRQUFaO0FBQ0Q7QUFDRCxhQUFJLENBQUNFLE1BQU1JLFFBQU4sQ0FBZTVDLEtBQWYsQ0FBTCxFQUE0QjtBQUMxQnVDLG1CQUFRQyxNQUFNRSxhQUFOLENBQW9CTCxLQUFLTSxRQUFMLENBQWMsZUFBZCxDQUFwQixDQUFSO0FBQ0FMLHVCQUFZLFFBQVo7QUFDRDtBQUNGO0FBQ0QsV0FBSUMsS0FBSixFQUFXO0FBQUU7QUFDWCxhQUFJTSxXQUFZLFlBQVlQLFNBQWIsR0FBMEJRLE1BQU1BLE1BQU1DLFlBQVosRUFBMEJDLFVBQXBELEdBQWlFRixNQUFNQSxNQUFNQyxZQUFaLEVBQTBCRSxVQUExRztBQUNBekIsV0FBRSxLQUFLSSxhQUFQLEVBQXNCc0IsV0FBdEIsQ0FBa0MsV0FBbEMsRUFBK0NDLElBQS9DLENBQW9ETixRQUFwRDtBQUNELFFBSEQsTUFHTztBQUFFO0FBQ1BqRCxvQkFBVztBQUNURSxrQkFBT0EsS0FERTtBQUVUQyxtQkFBUUEsTUFGQztBQUdUQyxrQkFBT0E7QUFIRSxVQUFYO0FBS0FuQyxZQUFHdUYsV0FBSCxDQUFleEQsUUFBZjtBQUNBNEIsV0FBRSxLQUFLSSxhQUFQLEVBQXNCc0IsV0FBdEIsQ0FBa0MsV0FBbEMsRUFBK0NDLElBQS9DLENBQW9ETCxNQUFNQSxNQUFNQyxZQUFaLEVBQTBCTSxPQUE5RTs7QUFFQSxjQUFLeEIsTUFBTCxHQUFjakMsUUFBZCxDQVRLLENBU21CO0FBQ3pCO0FBQ0Y7OztxQ0FFZTtBQUNkNEMsYUFBTUMsV0FBTjtBQUNBLFlBQUtuRSxXQUFMO0FBQ0Q7Ozs7OzttQkEzRWdCZ0QsYTtBQTRFcEIsRTs7Ozs7O0FDeEZEOzs7Ozs7QUFNQTs7Ozs7QUFFQSxLQUFJLE9BQVFrQixLQUFSLElBQWtCLFdBQWxCLElBQWlDQSxTQUFTLElBQTFDLElBQWtELENBQUNBLEtBQXZELEVBQThEO0FBQzVELE9BQUlBLFFBQVEsRUFBWjs7QUFFQSxXQXdETUEsS0F4RE4sV0FBUTtBQUNOSSxlQUFVLGtCQUFVVSxHQUFWLEVBQWVDLE9BQWYsRUFBd0I7QUFBRTtBQUNsQyxXQUFJQyxZQUFZLE9BQWhCO0FBQUEsV0FDRUMsbUJBQW1CLHdCQURyQjs7QUFHQSxjQUFPRixVQUFVRSxpQkFBaUJDLElBQWpCLENBQXNCSixHQUF0QixDQUFWLEdBQXVDRSxVQUFVRSxJQUFWLENBQWVKLEdBQWYsQ0FBOUM7QUFDRCxNQU5LOztBQVFOYixrQkFBYSx1QkFBWTtBQUN2QmpCLFNBQUUsYUFBRixFQUFpQm1DLElBQWpCLENBQXNCLFVBQVV6RCxDQUFWLEVBQWEwRCxJQUFiLEVBQW1CO0FBQUU7QUFDekNwQyxXQUFFb0MsSUFBRixFQUFRVixXQUFSLENBQW9CLFdBQXBCO0FBQ0QsUUFGRDtBQUdBMUIsU0FBRSxnQkFBRixFQUFvQnFDLFFBQXBCLENBQTZCLFdBQTdCO0FBQ0QsTUFiSzs7QUFlTm5CLG9CQUFlLHVCQUFVb0IsSUFBVixFQUFnQjtBQUFFO0FBQy9CdEMsU0FBRXNDLElBQUYsRUFBUUQsUUFBUixDQUFpQixXQUFqQjtBQUNBLGNBQU8sSUFBUDtBQUNELE1BbEJLOztBQW9CTkUsbUJBQWMsc0JBQVVDLEdBQVYsRUFBZUMsR0FBZixFQUFvQjtBQUNoQyxjQUFPQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsTUFBaUJILE1BQU1ELEdBQU4sR0FBWSxDQUE3QixDQUFYLElBQThDQSxHQUFyRDtBQUNELE1BdEJLOztBQXdCTkssZUFBVSxrQkFBVUMsUUFBVixFQUFvQjtBQUM1QixXQUFJQyxNQUFNLElBQUlDLElBQUosRUFBVjs7QUFFQSxXQUFJRixRQUFKLEVBQWM7QUFDWixnQkFBTyxJQUFJRSxJQUFKLEdBQVdDLE9BQVgsRUFBUDtBQUNELFFBRkQsTUFFTztBQUNMLGdCQUFPLElBQUlELElBQUosQ0FBU0QsSUFBSUcsV0FBSixFQUFULEVBQTRCSCxJQUFJSSxRQUFKLEVBQTVCLEVBQTRDSixJQUFJSyxPQUFKLEVBQTVDLEVBQTJESCxPQUEzRCxFQUFQO0FBQ0Q7QUFDRixNQWhDSzs7QUFrQ05JLG1CQUFjLHdCQUFZO0FBQ3hCLFdBQUlyRCxFQUFFLCtCQUFGLEVBQW1Dc0QsUUFBbkMsQ0FBNEMsSUFBNUMsQ0FBSixFQUF1RDtBQUNyRHRELFdBQUUsZUFBRixFQUFtQnVELEtBQW5CO0FBQ0Q7QUFDRixNQXRDSzs7QUF3Q05DLGNBQVMsaUJBQVVDLENBQVYsRUFBYTtBQUNwQixXQUFJQyxDQUFKLEVBQU9DLENBQVAsRUFBVWpGLENBQVY7QUFDQSxZQUFLQSxJQUFJK0UsRUFBRXJFLE1BQVgsRUFBbUJWLENBQW5CLEVBQXNCQSxHQUF0QixFQUEyQjtBQUN6QmdGLGFBQUloQixLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JsRSxDQUEzQixDQUFKO0FBQ0FpRixhQUFJRixFQUFFL0UsSUFBSSxDQUFOLENBQUo7QUFDQStFLFdBQUUvRSxJQUFJLENBQU4sSUFBVytFLEVBQUVDLENBQUYsQ0FBWDtBQUNBRCxXQUFFQyxDQUFGLElBQU9DLENBQVA7QUFDRDtBQUNGO0FBaERLLElBQVI7QUFrREQ7O0FBRUQsS0FBSSxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxPQUFPQyxPQUFQLElBQWtCLElBQXZELEVBQTZEO0FBQ3pEQSxXQUFRN0MsS0FBUixHQUFnQkEsS0FBaEI7QUFDSDs7U0FFT0EsSyxHQUFBQSxLOzs7Ozs7QUNuRVI7Ozs7OztBQU1BOzs7OztBQUVPLEtBQU04QyxvQ0FBYyxDQUN6QjtBQUNFLFlBQVMsUUFEWDtBQUVFLFdBQVEsVUFGVjtBQUdFLGdCQUFhLEtBSGY7QUFJRSxXQUFRLENBSlY7QUFLRSxXQUFRO0FBTFYsRUFEeUIsRUFRekI7QUFDRSxZQUFTLFFBRFg7QUFFRSxXQUFRLFFBRlY7QUFHRSxnQkFBYSxLQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBUnlCLEVBZXpCO0FBQ0UsWUFBUyxRQURYO0FBRUUsV0FBUSxLQUZWO0FBR0UsZ0JBQWEsS0FIZjtBQUlFLFdBQVEsQ0FKVjtBQUtFLFdBQVE7QUFMVixFQWZ5QixFQXNCekI7QUFDRSxZQUFTLFFBRFg7QUFFRSxXQUFRLE9BRlY7QUFHRSxnQkFBYSxNQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBdEJ5QixFQTRCdEI7QUFDRCxZQUFTLFFBRFI7QUFFRCxXQUFRLE9BRlA7QUFHRCxnQkFBYSxPQUhaO0FBSUQsV0FBUSxDQUpQO0FBS0QsV0FBUTtBQUxQLEVBNUJzQixFQWtDdEI7QUFDRCxZQUFTLFFBRFI7QUFFRCxXQUFRLFdBRlA7QUFHRCxnQkFBYSxPQUhaO0FBSUQsV0FBUSxDQUpQO0FBS0QsV0FBUTtBQUxQLEVBbENzQixFQXdDdEI7QUFDRCxZQUFTLFFBRFI7QUFFRCxXQUFRLE1BRlA7QUFHRCxnQkFBYSxPQUhaO0FBSUQsV0FBUSxDQUpQO0FBS0QsV0FBUTtBQUxQLEVBeENzQixFQStDekI7QUFDRSxZQUFTLFFBRFg7QUFFRSxXQUFRLE9BRlY7QUFHRSxnQkFBYSxNQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBL0N5QixFQXNEekI7QUFDRSxZQUFTLFFBRFg7QUFFRSxXQUFRLEtBRlY7QUFHRSxnQkFBYSxPQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBdER5QixFQTZEekI7QUFDRSxZQUFTLFNBRFg7QUFFRSxXQUFRLFVBRlY7QUFHRSxnQkFBYSxRQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBN0R5QixFQW1FdEI7QUFDRCxZQUFTLFNBRFI7QUFFRCxXQUFRLFdBRlA7QUFHRCxnQkFBYSxPQUhaO0FBSUQsV0FBUSxDQUpQO0FBS0QsV0FBUTtBQUxQLEVBbkVzQixFQTBFekI7QUFDRSxZQUFTLFNBRFg7QUFFRSxXQUFRLE1BRlY7QUFHRSxnQkFBYSxNQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBMUV5QixFQWlGekI7QUFDRSxZQUFTLFNBRFg7QUFFRSxXQUFRLE9BRlY7QUFHRSxnQkFBYSxNQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBakZ5QixFQXdGekI7QUFDRSxZQUFTLFNBRFg7QUFFRSxXQUFRLFNBRlY7QUFHRSxnQkFBYSxLQUhmO0FBSUUsV0FBUSxDQUpWO0FBS0UsV0FBUTtBQUxWLEVBeEZ5QixDQUFwQixDOzs7Ozs7Ozs7Ozs7O0FDRlA7O0FBQ0EsS0FBSUMsYUFBYSxFQUFqQixDLENBUEE7Ozs7Ozs7O0FBU0EsU0EyQ1FBLFVBM0NSLGdCQUFhO0FBQ1hDLGNBQVcsbUJBQVVuSCxJQUFWLEVBQWdCO0FBQUU7QUFDM0IsU0FBSUEsSUFBSixFQUFVO0FBQ1IsWUFBS29ILElBQUwsR0FBWXpHLE9BQU8wRyxRQUFQLENBQWdCRCxJQUE1QjtBQUNEO0FBQ0QsU0FBSSxLQUFLQSxJQUFMLEtBQWN6RyxPQUFPMEcsUUFBUCxDQUFnQkQsSUFBbEMsRUFBd0M7QUFDdENqRSxTQUFFeEMsTUFBRixFQUFVMkcsT0FBVixDQUFrQixXQUFsQixFQUErQjtBQUM3QixxQkFBWSxLQUFLRjtBQURZLFFBQS9CO0FBR0EsWUFBS0EsSUFBTCxHQUFZekcsT0FBTzBHLFFBQVAsQ0FBZ0JELElBQTVCO0FBQ0Q7QUFDREcsZ0JBQVcsS0FBS0osU0FBTCxDQUFlOUUsSUFBZixDQUFvQixJQUFwQixDQUFYLEVBQXNDLEVBQXRDO0FBQ0QsSUFaVTs7QUFjWG1GLGNBQVcscUJBQVk7QUFBRTtBQUN2QixTQUFJQyxVQUFVOUcsT0FBTzBHLFFBQVAsQ0FBZ0JELElBQWhCLENBQXFCTSxLQUFyQixDQUEyQixDQUEzQixDQUFkOztBQUVBLFNBQUlELE9BQUosRUFBYTtBQUNYdEUsU0FBRSxrQkFBa0J4QyxPQUFPMEcsUUFBUCxDQUFnQkQsSUFBaEIsQ0FBcUJNLEtBQXJCLENBQTJCLENBQTNCLENBQWxCLEdBQWtELEdBQXBELEVBQXlEaEIsS0FBekQ7QUFDRCxNQUZELE1BRU87QUFDTHZELFNBQUUsdUJBQUYsRUFBMkJ1RCxLQUEzQjtBQUNEO0FBQ0YsSUF0QlU7O0FBd0JYaUIsY0FBVyxxQkFBWTtBQUNyQnhFLE9BQUUsbUJBQUYsRUFBdUJtQyxJQUF2QixDQUE0QixZQUFZO0FBQ3RDbkMsU0FBRSxJQUFGLEVBQVFxQyxRQUFSLENBQWlCLFdBQWpCO0FBQ0QsTUFGRDtBQUdBckMsT0FBRSwyQkFBRixFQUErQm1DLElBQS9CLENBQW9DLFlBQVk7QUFDOUNuQyxTQUFFLElBQUYsRUFBUTBCLFdBQVIsQ0FBb0IsUUFBcEI7QUFDRCxNQUZEO0FBR0ExQixPQUFFLElBQUYsRUFBUXlFLE1BQVIsR0FBaUJwQyxRQUFqQixDQUEwQixRQUExQjtBQUNBckMsT0FBRSxNQUFNQSxFQUFFLElBQUYsRUFBUTBFLElBQVIsQ0FBYSxRQUFiLENBQVIsRUFBZ0NoRCxXQUFoQyxDQUE0QyxXQUE1QztBQUNBLGtCQUFNMkIsWUFBTjtBQUNELElBbENVOztBQW9DWHhHLFNBQU0sZ0JBQVk7QUFDaEJtRCxPQUFFTSxRQUFGLEVBQVlDLEVBQVosQ0FBZSxrQkFBZixFQUFtQyx3QkFBbkMsRUFBNkQsS0FBS2lFLFNBQWxFO0FBQ0F4RSxPQUFFeEMsTUFBRixFQUFVMEIsSUFBVixDQUFlLFdBQWYsRUFBNEIsS0FBS21GLFNBQWpDO0FBQ0EsVUFBS0wsU0FBTCxDQUFlLEtBQWY7QUFDRDtBQXhDVSxFQUFiOztTQTJDUUQsVSxHQUFBQSxVIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKiBMZWFybiBXb3JkcyAvLyBtYWluLmpzXHJcbiogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBKYW51YXJ5IDIwMTdcclxuKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gYS5tZXJlemhhbnlpQGdtYWlsLmNvbVxyXG4qIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IExXQ2xhc3MgZnJvbSAnLi91dGlscy9MVyc7XHJcbi8vIGNvbnNvbGUubG9nKExXKTtcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG4vLyBjb25zb2xlLmxvZyhMVyk7XHJcbmNvbnNvbGUubG9nKExXLmlzTG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkpO1xyXG5cclxuaW1wb3J0IFNldHRpbmdzQ2xhc3MgZnJvbSAnLi4vY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncyc7XHJcbmNvbnN0IFNldHRpbmdzID0gbmV3IFNldHRpbmdzQ2xhc3MoKTtcclxuXHJcbmltcG9ydCBVdGlscyBmcm9tICcuL3V0aWxzL3V0aWxzJztcclxuXHJcbmltcG9ydCB7TWVtb3J5c3RvcmV9IGZyb20gJy4vdXRpbHMvbWVtb3J5c3RvcmUnO1xyXG4vLyBsb2FkIHRoZSBkZWZhdWx0IHdvcmRzIHNldCBpZiBuZWVkZWRcclxuaWYgKExXLmlzT0sgJiYgTFcuaXNFbXB0eSkge1xyXG4gIGNvbnNvbGUubG9nKCdtZW1vcnlzdG9yZTogc3RhcnQgbG9hZGluZyB3b3JkcycpO1xyXG4gIExXLmxvYWRXb3JkcyhNZW1vcnlzdG9yZSk7XHJcbiAgY29uc29sZS5sb2coJ21lbW9yeXN0b3JlOiB3b3JkcyBoYXZlIGJlZW4gbG9hZGVkJyk7XHJcbn1cclxuXHJcbi8vIGltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4vdXRpbHMvbmF2aWdhdGlvbic7XHJcbmltcG9ydCB7TmF2aWdhdGlvbn0gZnJvbSAnLi91dGlscy9uYXZpZ2F0aW9uJztcclxuLy8gY29uc3Qge05hdmlnYXRpb259ID0gbmV3IE5hdmlnYXRpb25PYmplY3QoKTtcclxuTmF2aWdhdGlvbi5pbml0KCk7XHJcblxyXG4vLyBpbXBvcnQgTG9jYWwgZnJvbSAnLi9sb2NhbC9sb2NhbCc7XHJcbi8vIGltcG9ydCBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucy9hY3Rpb25zJztcclxuaWYgKCdkZXZlbG9wbWVudCcgPT09IE5PREVfRU5WKSB7XHJcbiAgY29uc29sZS5sb2coYGRldmVsb3BtZW50IGVudmlyb25tZW50ICR7Tk9ERV9FTlZ9YCk7XHJcbn1cclxuLy8gcmVhZCBzZXR0aW5nc1xyXG5TZXR0aW5ncy5nZXRTZXR0aW5ncygpO1xyXG5cclxuLy8gc2V0IHVzZXIgc2F2ZWQgbG9jYWxcclxuLy9pZiAobG9jYWwuY3VycmVudExvY2FsICE9PSAkKCdbZGF0YS10eXBlPWxhbmctLy9zZWxlY3RdLnNlbGVjdGVkJykuZGF0YSgnbGFuZycpKSB7XHJcbi8vXHQkKCdbZGF0YS1sYW5nPScgKyBsb2NhbC5jdXJyZW50TG9jYWwgKyAnXScpLmNsaWNrKCk7XHJcbi8vfTtcclxuXHJcbi8vIFZvY2FidWxhcnkudmlld1dvcmQoKTtcclxuLy8gTGVhcm4ucmVjb3VudEluZGV4TGVhcm4oKTtcclxuLy8gTGVhcm4uc2hvd1dvcmQoKTtcclxuLy8gUmVwZWF0LnJlY291bnRJbmRleFJlcGVhdCgpO1xyXG4vLyBSZXBlYXQuc2hvd1dvcmQoKTtcclxuLy8gVXRpbHMuY2xvc2VNb2JNZW51KCk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy9tYWluLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIGxvY2Fsc3RvcmFnZS5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55QGdtYWlsLmNvbVxyXG4gKlxyXG4gKiBVcGRhdGVkIGJ5IEhhbm5lcyBIaXJ6ZWwsIE5vdmVtYmVyIDIwMTZcclxuICpcclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTFdDbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoZGJOYW1lKSB7XHJcbiAgICB0aGlzLmlzT0sgPSBmYWxzZTtcclxuICAgIGlmICghdGhpcy5pc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSgpKSB7XHJcbiAgICAgIGFsZXJ0KCdMb2NhbCBTdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUuJyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICB0aGlzLm5hbWUgPSBkYk5hbWU7XHJcbiAgICAvLyBnZXQgaW5kZXhcclxuICAgIHRoaXMuaW5kZXggPSBbXTtcclxuICAgIHZhciBzdHJJbmRleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSArICctd29yZHMnKTtcclxuICAgIGlmIChzdHJJbmRleCkge1xyXG4gICAgICB0aGlzLmluZGV4ID0gc3RySW5kZXguc3BsaXQoJywnKTtcclxuICAgIH07XHJcbiAgICB0aGlzLmlzT0sgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gd2luZG93ICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlYWRJdGVtKGtleSkge1xyXG4gICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbW92ZUl0ZW0oa2V5KSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdG9yZUl0ZW0oa2V5LCB2YWx1ZSkge1xyXG4gICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlID09PSBRVU9UQV9FWENFRURFRF9FUlIpIHtcclxuICAgICAgICAgIGFsZXJ0KCdMb2NhbCBTdG9yYWdlIGlzIGZ1bGwnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdXRTZXR0aW5ncyh0aGVTZXR0aW5nc09iaikge1xyXG4gICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy13b3Jkcy1zZXR0aW5ncycsIHRoZVNldHRpbmdzT2JqKTtcclxuICB9XHJcblxyXG4gIGdldFNldHRpbmdzKCkge1xyXG5cclxuICAgIHZhciBzZXR0aW5ncyA9IHRoaXMucmVhZEl0ZW0odGhpcy5uYW1lICsgJy13b3Jkcy1zZXR0aW5ncycpO1xyXG4gICAgaWYgKCFzZXR0aW5ncykge1xyXG4gICAgICAvLyB0aGUgYXBwIHJ1bnMgZm9yIHRoZSBmaXJzdCB0aW1lLCB0aHVzXHJcbiAgICAgIC8vIGluaXRpYWxpemUgdGhlIHNldHRpbmcgb2JqZWN0IG5lZWVkcyB0byBiZSBpbml0aWFsaXplZFxyXG4gICAgICAvLyB3aXRoIGRlZmF1bHQgdmFsdWVzLlxyXG5cclxuICAgICAgLy8gZmlyc3QgaXMgZm9yIGJveCAob3Igc3RlcCkgMSBpbiB0aGUgTGVpdG5lciBib3g7XHJcbiAgICAgIC8vICAgICAgIGFzayB0aGUgd29yZCBhZ2FpbiBhZnRlciAxIGRheVxyXG4gICAgICAvLyBzZWNvbmQgaXMgZm9yIGJveCAyIDsgYXNrIHRoZSB3b3JkIGFnYWluIGFmdGVyIDMgZGF5c1xyXG4gICAgICAvLyB0aGlyZCBpcyBmb3IgYm94IDMgOyBhc2sgdGhlIHdvcmQgYWdhaW4gYWZ0ZXIgNyBkYXlzXHJcblxyXG4gICAgICAvLyBOb3RlOiBib3ggMCBpcyBmb3IgdGhlIExlYXJuIG1vZGUgYW5kIGl0IG5vdCBzZXRcclxuICAgICAgLy8gYXMgdGhlIHdvcmRzIGFyZSBhY2Nlc3NpYmxlIGFsbCB0aGUgdGltZVxyXG4gICAgICBjb25zb2xlLmxvZygnaW5pdGlhbGl6ZSBzZXR0aW5ncycpO1xyXG4gICAgICBzZXR0aW5ncyA9IHtcclxuICAgICAgICBmaXJzdDogMSxcclxuICAgICAgICBzZWNvbmQ6IDMsXHJcbiAgICAgICAgdGhpcmQ6IDdcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy1zZXR0aW5ncycsIHNldHRpbmdzKTtcclxuICAgICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy1sYW5ndWFnZScsICdlbl9HQicpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNldHRpbmdzO1xyXG4gIH1cclxuXHJcbiAgbG9hZFdvcmRzKHRoZVdvcmRzKSB7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB2YXIgYXJyYXlPZktleXMgPSBbXTtcclxuICAgIGNvbnN0IHN0b3JlRWFjaEVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LmluZGV4ID0gJ2luZGV4JyArICsraTtcclxuICAgICAgZWxlbWVudC5zdGVwID0gZWxlbWVudC5kYXRlID0gMDtcclxuICAgICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy0nICsgZWxlbWVudC5pbmRleCwgZWxlbWVudCk7XHJcbiAgICAgIGFycmF5T2ZLZXlzLnB1c2goZWxlbWVudC5pbmRleCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoZVdvcmRzLmZvckVhY2goc3RvcmVFYWNoRWxlbWVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnN0b3JlSXRlbSh0aGlzLm5hbWUgKyAnLXdvcmRzJywgYXJyYXlPZktleXMuam9pbigpKTtcclxuICAgIHRoaXMuaW5kZXggPSBhcnJheU9mS2V5cztcclxuXHJcbiAgICBjb25zb2xlLmxvZyhhcnJheU9mS2V5cy5sZW5ndGggKyAnIHdvcmRzIGhhdmUgYmVlbiBsb2FkZWQnKTtcclxuICB9XHJcblxyXG4gIGlzRW1wdHkoLyprZXkqLykge1xyXG4gICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgICByZXR1cm4gKCF0aGlzLmluZGV4Lmxlbmd0aCkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkdW1wV29yZHMoLyphS2V5UHJlZml4Ki8pIHtcclxuICAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgICB2YXIga2V5O1xyXG4gICAgICB2YXIgc3RyVmFsdWU7XHJcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgIHZhciBwcmVmaXhGb3JOdW1iZXIgPSB0aGlzLm5hbWUgKyAnLWluZGV4JztcclxuXHJcbiAgICAgIC8vIGdvIHRocm91Z2ggYWxsIGtleXMgc3RhcnRpbmcgd2l0aCB0aGUgbmFtZVxyXG4gICAgICAvLyBvZiB0aGUgZGF0YWJhc2UsIGkuZSAnbGVhcm5Xb3Jkcy1pbmRleDE0J1xyXG4gICAgICAvLyBjb2xsZWN0IHRoZSBtYXRjaGluZyBvYmplY3RzIGludG8gYXJyXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcclxuICAgICAgICBzdHJWYWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblxyXG4gICAgICAgIGlmICgwID09PSBrZXkubGFzdEluZGV4T2YocHJlZml4Rm9yTnVtYmVyLCAwKSkge1xyXG4gICAgICAgICAgcmVzdWx0LnB1c2goSlNPTi5wYXJzZShzdHJWYWx1ZSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBEdW1wIHRoZSBhcnJheSBhcyBKU09OIGNvZGUgKGZvciBzZWxlY3QgYWxsIC8gY29weSlcclxuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW1vdmVPYmplY3RzKGFLZXlQcmVmaXgpIHtcclxuICAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICAgdmFyIGtleTtcclxuICAgICAgLy8gdmFyIHN0O1xyXG4gICAgICB2YXIga2V5c1RvRGVsZXRlID0gW107XHJcblxyXG4gICAgICAvLyBnbyB0aHJvdWdoIGFsbCBrZXlzIHN0YXJ0aW5nIHdpdGggdGhlIG5hbWVcclxuICAgICAgLy8gb2YgdGhlIGRhdGFiYXNlLCBpLmUgJ2xlYXJuV29yZHMtaW5kZXgxNCdcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBrZXkgPSBsb2NhbFN0b3JhZ2Uua2V5KGkpO1xyXG4gICAgICAgIHN0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuXHJcbiAgICAgICAgaWYgKDAgPT09IGtleS5sYXN0SW5kZXhPZihhS2V5UHJlZml4LCAwKSkge1xyXG4gICAgICAgICAga2V5c1RvRGVsZXRlLnB1c2goa2V5KTtcclxuICAgICAgICB9O1xyXG4gICAgICB9O1xyXG4gICAgICAvLyBub3cgd2UgaGF2ZSBhbGwgdGhlIGtleXMgd2hpY2ggc2hvdWxkIGJlIGRlbGV0ZWRcclxuICAgICAgLy8gaW4gdGhlIGFycmF5IGtleXNUb0RlbGV0ZS5cclxuICAgICAgY29uc29sZS5sb2coa2V5c1RvRGVsZXRlKTtcclxuICAgICAga2V5c1RvRGVsZXRlLmZvckVhY2goZnVuY3Rpb24gKGFLZXkpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShhS2V5KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW1vdmVXb3JkcygpIHtcclxuICAgIHZhciBhS2V5UHJlZml4ID0gdGhpcy5uYW1lICsgJy1pbmRleCc7XHJcblxyXG4gICAgdGhpcy5yZW1vdmVPYmplY3RzKGFLZXlQcmVmaXgpO1xyXG4gICAgLy8gcmVzZXQgaW5kZXhcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZSArICctd29yZHMnLCAnJyk7XHJcbiAgICAvLyB0aGlzIG9uZSB0cmlnZ2VycyB0aGF0IG1lbW9yeXN0b3JlIGlzIGV4ZWN1dGVkXHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLm5hbWUgKyAnLXNldHRpbmdzJyk7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95KCkge1xyXG4gICAgdmFyIGFLZXlQcmVmaXggPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgdGhpcy5yZW1vdmVPYmplY3RzKGFLZXlQcmVmaXgpO1xyXG4gIH1cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL3V0aWxzL0xXLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gdGhpcy5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICpcclxuICogVXBkYXRlZCBieSBIYW5uZXMgSGlyemVsLCBOb3ZlbWJlciAyMDE2XHJcbiAqXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCBMV0NsYXNzIGZyb20gJy4uLy4uL2pzL3V0aWxzL0xXJztcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3NDbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmlucHV0Rmlyc3RDaGVjayA9ICQoJyNpbnB1dEZpcnN0Q2hlY2snKTtcclxuICAgIHRoaXMuaW5wdXRTZWNvbmRDaGVjayA9ICQoJyNpbnB1dFNlY29uZENoZWNrJyk7XHJcbiAgICB0aGlzLmlucHV0VGhpcmRDaGVjayA9ICQoJyNpbnB1dFRoaXJkQ2hlY2snKTtcclxuICAgIHRoaXMuc2V0dGluZ0Zyb20gPSAkKCcjc2V0dGluZ0Zyb20nKTtcclxuICAgIHRoaXMuZXJyb3JTZXR0aW5ncyA9ICQoJyNlcnJvclNldHRpbmdzJyk7XHJcblxyXG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcjc2F2ZVNldHRpbmdzJywgdGhpcy5zYXZlU2V0dGluZyk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcjY2FuY2VsU2V0dGluZ3MnLCB0aGlzLmNhbmNlbFNldHRpbmcpO1xyXG4gIH1cclxuICBnZXRTZXR0aW5ncygpIHsgLy9yZWFkIHNldHRpbmcncyB2YWx1ZXNcclxuICAgIHZhciBzdG9yZWRTZXR0aW5ncyA9IExXLmdldFNldHRpbmdzKCk7XHJcblxyXG4gICAgJCh0aGlzLmlucHV0Rmlyc3RDaGVjaykudmFsKHN0b3JlZFNldHRpbmdzLmZpcnN0KTtcclxuICAgICQodGhpcy5pbnB1dFNlY29uZENoZWNrKS52YWwoc3RvcmVkU2V0dGluZ3Muc2Vjb25kKTtcclxuICAgICQodGhpcy5pbnB1dFRoaXJkQ2hlY2spLnZhbChzdG9yZWRTZXR0aW5ncy50aGlyZCk7XHJcblxyXG4gICAgdGhpcy5wYXJhbXMgPSBzdG9yZWRTZXR0aW5nczsgLy9zdG9yZSBsb2NhbFxyXG4gIH1cclxuXHJcbiAgc2F2ZVNldHRpbmcoKSB7IC8vc2F2ZSBzZXR0aW5nJ3MgdmFsdWVzIHRvIERCXHJcbiAgICAgIHZhciBmaXJzdCA9ICQodGhpcy5pbnB1dEZpcnN0Q2hlY2spLnZhbCgpLnRyaW0oKSxcclxuICAgICAgICBzZWNvbmQgPSAkKHRoaXMuaW5wdXRTZWNvbmRDaGVjaykudmFsKCkudHJpbSgpLFxyXG4gICAgICAgIHRoaXJkID0gJCh0aGlzLmlucHV0VGhpcmRDaGVjaykudmFsKCkudHJpbSgpLFxyXG4gICAgICAgIGZvcm0gPSAkKHRoaXMuc2V0dGluZ0Zyb20pLFxyXG4gICAgICAgIGVycm9yTmFtZSA9ICcnLFxyXG4gICAgICAgIGVycm9yID0gZmFsc2U7XHJcblxyXG4gICAgICBVdGlscy5jbGVhckZpZWxkcygpO1xyXG4gICAgICAvL2NoZWNrIGZvciBlbXB0eSBmaWVsZHNcclxuICAgICAgaWYgKCFmaXJzdCkge1xyXG4gICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykpO1xyXG4gICAgICAgIGVycm9yTmFtZSA9ICdlbXB0eSc7XHJcbiAgICAgIH0gZWxzZSBpZiAoIXNlY29uZCkge1xyXG4gICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykpO1xyXG4gICAgICAgIGVycm9yTmFtZSA9ICdlbXB0eSc7XHJcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXJkKSB7XHJcbiAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKSk7XHJcbiAgICAgICAgZXJyb3JOYW1lID0gJ2VtcHR5JztcclxuICAgICAgfSBlbHNlIHsgLy9vbmx5IGRpZ2l0cyBpcyB2YWxpZFxyXG4gICAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIoZmlyc3QpKSB7XHJcbiAgICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpKTtcclxuICAgICAgICAgIGVycm9yTmFtZSA9ICdudW1iZXInO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCFVdGlscy5pc051bWJlcihzZWNvbmQpKSB7XHJcbiAgICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpKTtcclxuICAgICAgICAgIGVycm9yTmFtZSA9ICdudW1iZXInO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCFVdGlscy5pc051bWJlcih0aGlyZCkpIHtcclxuICAgICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykpO1xyXG4gICAgICAgICAgZXJyb3JOYW1lID0gJ251bWJlcic7XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZXJyb3IpIHsgLy9zaG93IGVycm9yIGlmIGFueVxyXG4gICAgICAgIHZhciBlcnJvclR4dCA9ICgnZW1wdHknID09PSBlcnJvck5hbWUpID8gbG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5lcnJvckVtcHR5IDogbG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5lcnJvclZhbGlkO1xyXG4gICAgICAgICQodGhpcy5lcnJvclNldHRpbmdzKS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5JykudGV4dChlcnJvclR4dCk7XHJcbiAgICAgIH0gZWxzZSB7IC8vb3RoZXJ3aXNlIHNhdmUgbmV3IHNldHRpbmdzXHJcbiAgICAgICAgc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICBmaXJzdDogZmlyc3QsXHJcbiAgICAgICAgICBzZWNvbmQ6IHNlY29uZCxcclxuICAgICAgICAgIHRoaXJkOiB0aGlyZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgTFcucHV0U2V0dGluZ3Moc2V0dGluZ3MpO1xyXG4gICAgICAgICQodGhpcy5lcnJvclNldHRpbmdzKS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5JykudGV4dChsb2NhbFtsb2NhbC5jdXJyZW50TG9jYWxdLmVycm9yTm8pO1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHNldHRpbmdzOyAvL3N0b3JlIGxvY2FsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY2FuY2VsU2V0dGluZygpIHtcclxuICAgICAgVXRpbHMuY2xlYXJGaWVsZHMoKTtcclxuICAgICAgdGhpcy5nZXRTZXR0aW5ncygpO1xyXG4gICAgfVxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyB1dGlscy5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2xpaSBNYXJlemhhbnlpIGFrYSBlMXIwbmQvL1tDUkddIC0gTWFyY2ggMjAxNFxyXG4gKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gZTFyMG5kLmNyZ0BnbWFpbC5jb21cclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaWYgKHR5cGVvZiAoVXRpbHMpID09ICd1bmRlZmluZWQnIHx8IFV0aWxzID09IG51bGwgfHwgIVV0aWxzKSB7XHJcbiAgdmFyIFV0aWxzID0ge307XHJcblxyXG4gIFV0aWxzID0ge1xyXG4gICAgaXNOdW1iZXI6IGZ1bmN0aW9uIChzdHIsIHdpdGhEb3QpIHsgLy92YWxpZGF0ZSBmaWxlZCBmb3IgbnVtYmVyIHZhbHVlXHJcbiAgICAgIHZhciBOdW1iZXJSZWcgPSAvXlxcZCskLyxcclxuICAgICAgICBOdW1iZXJXaXRoRG90UmVnID0gL15bLStdP1swLTldKlxcLj9bMC05XSskLztcclxuXHJcbiAgICAgIHJldHVybiB3aXRoRG90ID8gTnVtYmVyV2l0aERvdFJlZy50ZXN0KHN0cikgOiBOdW1iZXJSZWcudGVzdChzdHIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGVhckZpZWxkczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcuZm9ybS1ncm91cCcpLmVhY2goZnVuY3Rpb24gKGksIG5vZGUpIHsgLy9jbGVhciBhbGwgZXJyb3Igc3R5bGVzXHJcbiAgICAgICAgJChub2RlKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcjZXJyb3JTZXR0aW5ncycpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0RmllbGRFcnJvcjogZnVuY3Rpb24gKHNlbGYpIHsgLy9zZXQgdGhlIGVycm9yIHN0eWxlIGZvciB0aGUgY3VycmVudCBpbnB1dCBmaWVsZFxyXG4gICAgICAkKHNlbGYpLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFJhbmRvbUludDogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRUb2RheTogZnVuY3Rpb24gKGZ1bGxEYXRlKSB7XHJcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgaWYgKGZ1bGxEYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkudmFsdWVPZigpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCkpLnZhbHVlT2YoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbG9zZU1vYk1lbnU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQoJyNicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xJykuaGFzQ2xhc3MoJ2luJykpIHtcclxuICAgICAgICAkKCcjbmF2YmFyVG9nZ2xlJykuY2xpY2soKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB2YXIgaiwgeCwgaTtcclxuICAgICAgZm9yIChpID0gYS5sZW5ndGg7IGk7IGktLSkge1xyXG4gICAgICAgIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKTtcclxuICAgICAgICB4ID0gYVtpIC0gMV07XHJcbiAgICAgICAgYVtpIC0gMV0gPSBhW2pdO1xyXG4gICAgICAgIGFbal0gPSB4O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICE9IG51bGwpIHtcclxuICAgIGV4cG9ydHMuVXRpbHMgPSBVdGlscztcclxufVxyXG5cclxuZXhwb3J0IHtVdGlsc307XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy91dGlscy91dGlscy5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyBtZW1vcnlzdG9yZS5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIEphbnVhcnkgMjAxN1xyXG4gKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gYS5tZXJlemhhbnlpQGdtYWlsLmNvbVxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY29uc3QgTWVtb3J5c3RvcmUgPSBbXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MScsXHJcbiAgICAnd29yZCc6ICdkYXMgQXV0bycsXHJcbiAgICAndHJhbnNsYXRlJzogJ2NhcicsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDInLFxyXG4gICAgJ3dvcmQnOiAnbGF1ZmVuJyxcclxuICAgICd0cmFuc2xhdGUnOiAncnVuJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MycsXHJcbiAgICAnd29yZCc6ICdhbHQnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdvbGQnLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg0JyxcclxuICAgICd3b3JkJzogJ2tyYW5rJyxcclxuICAgICd0cmFuc2xhdGUnOiAnc2ljaycsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LCB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg1JyxcclxuICAgICd3b3JkJzogJ2hldXRlJyxcclxuICAgICd0cmFuc2xhdGUnOiAndG9kYXknLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSwge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4NicsXHJcbiAgICAnd29yZCc6ICdzY2hyZWliZW4nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICd3cml0ZScsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LCB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg3JyxcclxuICAgICd3b3JkJzogJ2hlbGwnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdsaWdodCcsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDgnLFxyXG4gICAgJ3dvcmQnOiAncmVpY2gnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdyaWNoJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4OScsXHJcbiAgICAnd29yZCc6ICdzw7zDnycsXHJcbiAgICAndHJhbnNsYXRlJzogJ3N3ZWV0JyxcclxuICAgICdzdGVwJzogMSxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MTAnLFxyXG4gICAgJ3dvcmQnOiAnd2VpYmxpY2gnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdmZW1hbGUnLFxyXG4gICAgJ3N0ZXAnOiAxLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSwge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MTEnLFxyXG4gICAgJ3dvcmQnOiAnYmVzdGVsbGVuJyxcclxuICAgICd0cmFuc2xhdGUnOiAnb3JkZXInLFxyXG4gICAgJ3N0ZXAnOiAxLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgxMicsXHJcbiAgICAnd29yZCc6ICdrYWx0JyxcclxuICAgICd0cmFuc2xhdGUnOiAnY29sZCcsXHJcbiAgICAnc3RlcCc6IDIsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDEzJyxcclxuICAgICd3b3JkJzogJ3NhdWVyJyxcclxuICAgICd0cmFuc2xhdGUnOiAnc291cicsXHJcbiAgICAnc3RlcCc6IDIsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDE0JyxcclxuICAgICd3b3JkJzogJ2ZsaWVnZW4nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdmbHknLFxyXG4gICAgJ3N0ZXAnOiAzLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfVxyXG5dO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvdXRpbHMvbWVtb3J5c3RvcmUuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gbmF2aWdhdGlvbi5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscyc7XHJcbmxldCBOYXZpZ2F0aW9uID0ge307XHJcblxyXG5OYXZpZ2F0aW9uID0ge1xyXG4gIGhhc2hndWFyZDogZnVuY3Rpb24gKGluaXQpIHsgLy9vbkhhc2hDaGFuZ2VcclxuICAgIGlmIChpbml0KSB7XHJcbiAgICAgIHRoaXMuaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuaGFzaCAhPT0gd2luZG93LmxvY2F0aW9uLmhhc2gpIHtcclxuICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2hhc2hicmVhaycsIHtcclxuICAgICAgICAncHJldmhhc2gnOiB0aGlzLmhhc2hcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCh0aGlzLmhhc2hndWFyZC5iaW5kKHRoaXMpLCA1MCk7XHJcbiAgfSxcclxuXHJcbiAgaGFzaGJyZWFrOiBmdW5jdGlvbiAoKSB7IC8vaGFzaGNoYW5nZSBldmVudFxyXG4gICAgdmFyIGhhc2hVcmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgzKTtcclxuXHJcbiAgICBpZiAoaGFzaFVybCkge1xyXG4gICAgICAkKCdbZGF0YS10YXJnZXQ9JyArIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDMpICsgJ10nKS5jbGljaygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnW2RhdGEtdGFyZ2V0PXN1bW1hcnldJykuY2xpY2soKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBuYXZTZWxlY3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICQoJ1tkYXRhLXRvZ2dsZT1uYXZdJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgfSk7XHJcbiAgICAkKCdbZGF0YS10eXBlPW5hdi1zZWxlY3QtbGldJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJyMnICsgJCh0aGlzKS5kYXRhKCd0YXJnZXQnKSkucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgVXRpbHMuY2xvc2VNb2JNZW51KCk7XHJcbiAgfSxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnW2RhdGEtdHlwZT1uYXYtc2VsZWN0XScsIHRoaXMubmF2U2VsZWN0KTtcclxuICAgICQod2luZG93KS5iaW5kKCdoYXNoYnJlYWsnLCB0aGlzLmhhc2hicmVhayk7XHJcbiAgICB0aGlzLmhhc2hndWFyZChmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHtOYXZpZ2F0aW9ufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL3V0aWxzL25hdmlnYXRpb24uanMiXSwic291cmNlUm9vdCI6IiJ9