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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// console.log(LW);
	var LW = new _LW2.default('LWdb');
	// console.log(LW);
	console.log(LW.isLocalStorageAvailable());
	
	var Settings = new _settings2.default();
	
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
	
	      theWords.forEach(function (element) {
	        i = i + 1;
	        element.index = 'index' + i;
	        element.step = 0;
	        element.date = 0;
	        this.storeItem(this.name + '-' + element.index, element);
	        arrayOfKeys.push(element.index);
	      });
	
	      this.storeItem(this.name + '-words', arrayOfKeys.join());
	      this.index = arrayOfKeys;
	
	      console.log(arrayOfKeys.length + ' words loaded');
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

/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvTFcuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pzL3V0aWxzL3V0aWxzLmpzIl0sIm5hbWVzIjpbIkxXIiwiY29uc29sZSIsImxvZyIsImlzTG9jYWxTdG9yYWdlQXZhaWxhYmxlIiwiU2V0dGluZ3MiLCJhIiwiZ2V0U2V0dGluZ3MiLCJMV0NsYXNzIiwiZGJOYW1lIiwiaXNPSyIsImFsZXJ0IiwibmFtZSIsImluZGV4Iiwic3RySW5kZXgiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic3BsaXQiLCJ3aW5kb3ciLCJlIiwia2V5IiwiSlNPTiIsInBhcnNlIiwicmVtb3ZlSXRlbSIsInZhbHVlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsIlFVT1RBX0VYQ0VFREVEX0VSUiIsInRoZVNldHRpbmdzT2JqIiwic3RvcmVJdGVtIiwic2V0dGluZ3MiLCJyZWFkSXRlbSIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJ0aGVXb3JkcyIsImkiLCJhcnJheU9mS2V5cyIsImZvckVhY2giLCJlbGVtZW50Iiwic3RlcCIsImRhdGUiLCJwdXNoIiwiam9pbiIsImxlbmd0aCIsInN0clZhbHVlIiwicmVzdWx0IiwicHJlZml4Rm9yTnVtYmVyIiwibGFzdEluZGV4T2YiLCJhS2V5UHJlZml4Iiwia2V5c1RvRGVsZXRlIiwic3QiLCJhS2V5IiwicmVtb3ZlT2JqZWN0cyIsIlNldHRpbmdzQ2xhc3MiLCJpbnB1dEZpcnN0Q2hlY2siLCIkIiwiaW5wdXRTZWNvbmRDaGVjayIsImlucHV0VGhpcmRDaGVjayIsInNldHRpbmdGcm9tIiwiZXJyb3JTZXR0aW5ncyIsInBhcmFtcyIsImRvY3VtZW50Iiwib24iLCJzYXZlU2V0dGluZyIsImNhbmNlbFNldHRpbmciLCJzdG9yZWRTZXR0aW5ncyIsInZhbCIsInRyaW0iLCJmb3JtIiwiZXJyb3JOYW1lIiwiZXJyb3IiLCJVdGlscyIsImNsZWFyRmllbGRzIiwic2V0RmllbGRFcnJvciIsImNoaWxkcmVuIiwiaXNOdW1iZXIiLCJlcnJvclR4dCIsImxvY2FsIiwiY3VycmVudExvY2FsIiwiZXJyb3JFbXB0eSIsImVycm9yVmFsaWQiLCJyZW1vdmVDbGFzcyIsInRleHQiLCJwdXRTZXR0aW5ncyIsImVycm9yTm8iLCJzdHIiLCJ3aXRoRG90IiwiTnVtYmVyUmVnIiwiTnVtYmVyV2l0aERvdFJlZyIsInRlc3QiLCJlYWNoIiwibm9kZSIsImFkZENsYXNzIiwic2VsZiIsImdldFJhbmRvbUludCIsIm1pbiIsIm1heCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImdldFRvZGF5IiwiZnVsbERhdGUiLCJub3ciLCJEYXRlIiwidmFsdWVPZiIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiY2xvc2VNb2JNZW51IiwiaGFzQ2xhc3MiLCJjbGljayIsInNodWZmbGUiLCJqIiwieCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7OztBQU1BOztBQUVBOzs7O0FBTUE7Ozs7QUFHQTs7Ozs7O0FBUkE7QUFDQSxLQUFNQSxLQUFLLGlCQUFZLE1BQVosQ0FBWDtBQUNBO0FBQ0FDLFNBQVFDLEdBQVIsQ0FBWUYsR0FBR0csdUJBQUgsRUFBWjs7QUFHQSxLQUFNQyxXQUFXLHdCQUFqQjs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUlDLFVBQUo7QUFDQSxLQUFJLElBQUosRUFBZ0M7QUFDOUJKLFdBQVFDLEdBQVIsOEJBQXVDLGVBQXZDO0FBQ0Q7QUFDRDtBQUNBRSxVQUFTRSxXQUFUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Qjs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZDQTs7Ozs7Ozs7O0tBU3FCQyxPO0FBQ25CLG9CQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FB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T0FBT0MsT0FBUCxJQUFrQixJQUF2RCxFQUE2RDtBQUN6REEsV0FBUTVDLEtBQVIsR0FBZ0JBLEtBQWhCO0FBQ0gsRSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiogTGVhcm4gV29yZHMgLy8gbWFpbi5qc1xyXG4qIGNvZGVkIGJ5IEFuYXRvbCBNYXJlemhhbnlpIGFrYSBlMXIwbmQvL1tDUkddIC0gSmFudWFyeSAyMDE3XHJcbiogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBMV0NsYXNzIGZyb20gJy4vdXRpbHMvTFcnO1xyXG4vLyBjb25zb2xlLmxvZyhMVyk7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuLy8gY29uc29sZS5sb2coTFcpO1xyXG5jb25zb2xlLmxvZyhMVy5pc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSgpKTtcclxuXHJcbmltcG9ydCBTZXR0aW5nc0NsYXNzIGZyb20gJy4uL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MnO1xyXG5jb25zdCBTZXR0aW5ncyA9IG5ldyBTZXR0aW5nc0NsYXNzKCk7XHJcblxyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi91dGlscy91dGlscyc7XHJcbi8vIGltcG9ydCBNZW1vcnlzdG9yZSBmcm9tICcuL3V0aWxzL21lbW9yeXN0b3JlJztcclxuLy8gaW1wb3J0IE5hdmlnYXRpb24gZnJvbSAnLi91dGlscy9uYXZpZ2F0aW9uJztcclxuLy8gaW1wb3J0IExvY2FsIGZyb20gJy4vbG9jYWwvbG9jYWwnO1xyXG4vLyBpbXBvcnQgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMvYWN0aW9ucyc7XHJcbmxldCBhO1xyXG5pZiAoJ2RldmVsb3BtZW50JyA9PT0gTk9ERV9FTlYpIHtcclxuICBjb25zb2xlLmxvZyhgZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnQgJHtOT0RFX0VOVn1gKTtcclxufVxyXG4vLyByZWFkIHNldHRpbmdzXHJcblNldHRpbmdzLmdldFNldHRpbmdzKCk7XHJcblxyXG4vLyBzZXQgdXNlciBzYXZlZCBsb2NhbFxyXG4vL2lmIChsb2NhbC5jdXJyZW50TG9jYWwgIT09ICQoJ1tkYXRhLXR5cGU9bGFuZy0vL3NlbGVjdF0uc2VsZWN0ZWQnKS5kYXRhKCdsYW5nJykpIHtcclxuLy9cdCQoJ1tkYXRhLWxhbmc9JyArIGxvY2FsLmN1cnJlbnRMb2NhbCArICddJykuY2xpY2soKTtcclxuLy99O1xyXG5cclxuLy8gVm9jYWJ1bGFyeS52aWV3V29yZCgpO1xyXG4vLyBMZWFybi5yZWNvdW50SW5kZXhMZWFybigpO1xyXG4vLyBMZWFybi5zaG93V29yZCgpO1xyXG4vLyBSZXBlYXQucmVjb3VudEluZGV4UmVwZWF0KCk7XHJcbi8vIFJlcGVhdC5zaG93V29yZCgpO1xyXG4vLyBVdGlscy5jbG9zZU1vYk1lbnUoKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL21haW4uanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gbG9jYWxzdG9yYWdlLmpzXHJcbiAqIGNvZGVkIGJ5IEFuYXRvbCBNYXJlemhhbnlpIGFrYSBlMXIwbmQvL1tDUkddIC0gTWFyY2ggMjAxNFxyXG4gKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gYS5tZXJlemhhbnlAZ21haWwuY29tXHJcbiAqXHJcbiAqIFVwZGF0ZWQgYnkgSGFubmVzIEhpcnplbCwgTm92ZW1iZXIgMjAxNlxyXG4gKlxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMV0NsYXNzIHtcclxuICBjb25zdHJ1Y3RvcihkYk5hbWUpIHtcclxuICAgIHRoaXMuaXNPSyA9IGZhbHNlO1xyXG4gICAgaWYgKCF0aGlzLmlzTG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkpIHtcclxuICAgICAgYWxlcnQoJ0xvY2FsIFN0b3JhZ2UgaXMgbm90IGF2YWlsYWJsZS4nKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIHRoaXMubmFtZSA9IGRiTmFtZTtcclxuICAgIC8vIGdldCBpbmRleFxyXG4gICAgdGhpcy5pbmRleCA9IFtdO1xyXG4gICAgdmFyIHN0ckluZGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lICsgJy13b3JkcycpO1xyXG4gICAgaWYgKHN0ckluZGV4KSB7XHJcbiAgICAgIHRoaXMuaW5kZXggPSBzdHJJbmRleC5zcGxpdCgnLCcpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuaXNPSyA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBpc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiB3aW5kb3cgJiYgd2luZG93LmxvY2FsU3RvcmFnZTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVhZEl0ZW0oa2V5KSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlSXRlbShrZXkpIHtcclxuICAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0b3JlSXRlbShrZXksIHZhbHVlKSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgPT09IFFVT1RBX0VYQ0VFREVEX0VSUikge1xyXG4gICAgICAgICAgYWxlcnQoJ0xvY2FsIFN0b3JhZ2UgaXMgZnVsbCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1dFNldHRpbmdzKHRoZVNldHRpbmdzT2JqKSB7XHJcbiAgICB0aGlzLnN0b3JlSXRlbSh0aGlzLm5hbWUgKyAnLXdvcmRzLXNldHRpbmdzJywgdGhlU2V0dGluZ3NPYmopO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2V0dGluZ3MoKSB7XHJcblxyXG4gICAgdmFyIHNldHRpbmdzID0gdGhpcy5yZWFkSXRlbSh0aGlzLm5hbWUgKyAnLXdvcmRzLXNldHRpbmdzJyk7XHJcbiAgICBpZiAoIXNldHRpbmdzKSB7XHJcbiAgICAgIC8vIHRoZSBhcHAgcnVucyBmb3IgdGhlIGZpcnN0IHRpbWUsIHRodXNcclxuICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgc2V0dGluZyBvYmplY3QgbmVlZWRzIHRvIGJlIGluaXRpYWxpemVkXHJcbiAgICAgIC8vIHdpdGggZGVmYXVsdCB2YWx1ZXMuXHJcblxyXG4gICAgICAvLyBmaXJzdCBpcyBmb3IgYm94IChvciBzdGVwKSAxIGluIHRoZSBMZWl0bmVyIGJveDtcclxuICAgICAgLy8gICAgICAgYXNrIHRoZSB3b3JkIGFnYWluIGFmdGVyIDEgZGF5XHJcbiAgICAgIC8vIHNlY29uZCBpcyBmb3IgYm94IDIgOyBhc2sgdGhlIHdvcmQgYWdhaW4gYWZ0ZXIgMyBkYXlzXHJcbiAgICAgIC8vIHRoaXJkIGlzIGZvciBib3ggMyA7IGFzayB0aGUgd29yZCBhZ2FpbiBhZnRlciA3IGRheXNcclxuXHJcbiAgICAgIC8vIE5vdGU6IGJveCAwIGlzIGZvciB0aGUgTGVhcm4gbW9kZSBhbmQgaXQgbm90IHNldFxyXG4gICAgICAvLyBhcyB0aGUgd29yZHMgYXJlIGFjY2Vzc2libGUgYWxsIHRoZSB0aW1lXHJcbiAgICAgIGNvbnNvbGUubG9nKCdpbml0aWFsaXplIHNldHRpbmdzJyk7XHJcbiAgICAgIHNldHRpbmdzID0ge1xyXG4gICAgICAgIGZpcnN0OiAxLFxyXG4gICAgICAgIHNlY29uZDogMyxcclxuICAgICAgICB0aGlyZDogN1xyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLnN0b3JlSXRlbSh0aGlzLm5hbWUgKyAnLXNldHRpbmdzJywgc2V0dGluZ3MpO1xyXG4gICAgICB0aGlzLnN0b3JlSXRlbSh0aGlzLm5hbWUgKyAnLWxhbmd1YWdlJywgJ2VuX0dCJyk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2V0dGluZ3M7XHJcbiAgfVxyXG5cclxuICBsb2FkV29yZHModGhlV29yZHMpIHtcclxuICAgIHZhciBpID0gMDtcclxuICAgIHZhciBhcnJheU9mS2V5cyA9IFtdO1xyXG5cclxuICAgIHRoZVdvcmRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgaSA9IGkgKyAxO1xyXG4gICAgICBlbGVtZW50LmluZGV4ID0gJ2luZGV4JyArIGk7XHJcbiAgICAgIGVsZW1lbnQuc3RlcCA9IDA7XHJcbiAgICAgIGVsZW1lbnQuZGF0ZSA9IDA7XHJcbiAgICAgIHRoaXMuc3RvcmVJdGVtKHRoaXMubmFtZSArICctJyArIGVsZW1lbnQuaW5kZXgsIGVsZW1lbnQpO1xyXG4gICAgICBhcnJheU9mS2V5cy5wdXNoKGVsZW1lbnQuaW5kZXgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy13b3JkcycsIGFycmF5T2ZLZXlzLmpvaW4oKSk7XHJcbiAgICB0aGlzLmluZGV4ID0gYXJyYXlPZktleXM7XHJcblxyXG4gICAgY29uc29sZS5sb2coYXJyYXlPZktleXMubGVuZ3RoICsgJyB3b3JkcyBsb2FkZWQnKTtcclxuXHJcbiAgfVxyXG5cclxuICBpc0VtcHR5KC8qa2V5Ki8pIHtcclxuICAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICAgcmV0dXJuICghdGhpcy5pbmRleC5sZW5ndGgpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZHVtcFdvcmRzKC8qYUtleVByZWZpeCovKSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgICd1c2Ugc3RyaWN0JztcclxuICAgICAgdmFyIGtleTtcclxuICAgICAgdmFyIHN0clZhbHVlO1xyXG4gICAgICB2YXIgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICB2YXIgcHJlZml4Rm9yTnVtYmVyID0gdGhpcy5uYW1lICsgJy1pbmRleCc7XHJcblxyXG4gICAgICAvLyBnbyB0aHJvdWdoIGFsbCBrZXlzIHN0YXJ0aW5nIHdpdGggdGhlIG5hbWVcclxuICAgICAgLy8gb2YgdGhlIGRhdGFiYXNlLCBpLmUgJ2xlYXJuV29yZHMtaW5kZXgxNCdcclxuICAgICAgLy8gY29sbGVjdCB0aGUgbWF0Y2hpbmcgb2JqZWN0cyBpbnRvIGFyclxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGtleSA9IGxvY2FsU3RvcmFnZS5rZXkoaSk7XHJcbiAgICAgICAgc3RyVmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG5cclxuICAgICAgICBpZiAoMCA9PT0ga2V5Lmxhc3RJbmRleE9mKHByZWZpeEZvck51bWJlciwgMCkpIHtcclxuICAgICAgICAgIHJlc3VsdC5wdXNoKEpTT04ucGFyc2Uoc3RyVmFsdWUpKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gRHVtcCB0aGUgYXJyYXkgYXMgSlNPTiBjb2RlIChmb3Igc2VsZWN0IGFsbCAvIGNvcHkpXHJcbiAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgIHZhciBrZXk7XHJcbiAgICAgIC8vIHZhciBzdDtcclxuICAgICAgdmFyIGtleXNUb0RlbGV0ZSA9IFtdO1xyXG5cclxuICAgICAgLy8gZ28gdGhyb3VnaCBhbGwga2V5cyBzdGFydGluZyB3aXRoIHRoZSBuYW1lXHJcbiAgICAgIC8vIG9mIHRoZSBkYXRhYmFzZSwgaS5lICdsZWFybldvcmRzLWluZGV4MTQnXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcclxuICAgICAgICBzdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblxyXG4gICAgICAgIGlmICgwID09PSBrZXkubGFzdEluZGV4T2YoYUtleVByZWZpeCwgMCkpIHtcclxuICAgICAgICAgIGtleXNUb0RlbGV0ZS5wdXNoKGtleSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfTtcclxuICAgICAgLy8gbm93IHdlIGhhdmUgYWxsIHRoZSBrZXlzIHdoaWNoIHNob3VsZCBiZSBkZWxldGVkXHJcbiAgICAgIC8vIGluIHRoZSBhcnJheSBrZXlzVG9EZWxldGUuXHJcbiAgICAgIGNvbnNvbGUubG9nKGtleXNUb0RlbGV0ZSk7XHJcbiAgICAgIGtleXNUb0RlbGV0ZS5mb3JFYWNoKGZ1bmN0aW9uIChhS2V5KSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oYUtleSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlV29yZHMoKSB7XHJcbiAgICB2YXIgYUtleVByZWZpeCA9IHRoaXMubmFtZSArICctaW5kZXgnO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KTtcclxuICAgIC8vIHJlc2V0IGluZGV4XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm5hbWUgKyAnLXdvcmRzJywgJycpO1xyXG4gICAgLy8gdGhpcyBvbmUgdHJpZ2dlcnMgdGhhdCBtZW1vcnlzdG9yZSBpcyBleGVjdXRlZFxyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5uYW1lICsgJy1zZXR0aW5ncycpO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSgpIHtcclxuICAgIHZhciBhS2V5UHJlZml4ID0gdGhpcy5uYW1lO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KTtcclxuICB9XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy91dGlscy9MVy5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIHRoaXMuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiAqXHJcbiAqIFVwZGF0ZWQgYnkgSGFubmVzIEhpcnplbCwgTm92ZW1iZXIgMjAxNlxyXG4gKlxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuLi8uLi9qcy91dGlscy9MVyc7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzQ2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pbnB1dEZpcnN0Q2hlY2sgPSAkKCcjaW5wdXRGaXJzdENoZWNrJyk7XHJcbiAgICB0aGlzLmlucHV0U2Vjb25kQ2hlY2sgPSAkKCcjaW5wdXRTZWNvbmRDaGVjaycpO1xyXG4gICAgdGhpcy5pbnB1dFRoaXJkQ2hlY2sgPSAkKCcjaW5wdXRUaGlyZENoZWNrJyk7XHJcbiAgICB0aGlzLnNldHRpbmdGcm9tID0gJCgnI3NldHRpbmdGcm9tJyk7XHJcbiAgICB0aGlzLmVycm9yU2V0dGluZ3MgPSAkKCcjZXJyb3JTZXR0aW5ncycpO1xyXG5cclxuICAgIHRoaXMucGFyYW1zID0ge307XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI3NhdmVTZXR0aW5ncycsIHRoaXMuc2F2ZVNldHRpbmcpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI2NhbmNlbFNldHRpbmdzJywgdGhpcy5jYW5jZWxTZXR0aW5nKTtcclxuICB9XHJcbiAgZ2V0U2V0dGluZ3MoKSB7IC8vcmVhZCBzZXR0aW5nJ3MgdmFsdWVzXHJcbiAgICB2YXIgc3RvcmVkU2V0dGluZ3MgPSBMVy5nZXRTZXR0aW5ncygpO1xyXG5cclxuICAgICQodGhpcy5pbnB1dEZpcnN0Q2hlY2spLnZhbChzdG9yZWRTZXR0aW5ncy5maXJzdCk7XHJcbiAgICAkKHRoaXMuaW5wdXRTZWNvbmRDaGVjaykudmFsKHN0b3JlZFNldHRpbmdzLnNlY29uZCk7XHJcbiAgICAkKHRoaXMuaW5wdXRUaGlyZENoZWNrKS52YWwoc3RvcmVkU2V0dGluZ3MudGhpcmQpO1xyXG5cclxuICAgIHRoaXMucGFyYW1zID0gc3RvcmVkU2V0dGluZ3M7IC8vc3RvcmUgbG9jYWxcclxuICB9XHJcblxyXG4gIHNhdmVTZXR0aW5nKCkgeyAvL3NhdmUgc2V0dGluZydzIHZhbHVlcyB0byBEQlxyXG4gICAgICB2YXIgZmlyc3QgPSAkKHRoaXMuaW5wdXRGaXJzdENoZWNrKS52YWwoKS50cmltKCksXHJcbiAgICAgICAgc2Vjb25kID0gJCh0aGlzLmlucHV0U2Vjb25kQ2hlY2spLnZhbCgpLnRyaW0oKSxcclxuICAgICAgICB0aGlyZCA9ICQodGhpcy5pbnB1dFRoaXJkQ2hlY2spLnZhbCgpLnRyaW0oKSxcclxuICAgICAgICBmb3JtID0gJCh0aGlzLnNldHRpbmdGcm9tKSxcclxuICAgICAgICBlcnJvck5hbWUgPSAnJyxcclxuICAgICAgICBlcnJvciA9IGZhbHNlO1xyXG5cclxuICAgICAgVXRpbHMuY2xlYXJGaWVsZHMoKTtcclxuICAgICAgLy9jaGVjayBmb3IgZW1wdHkgZmllbGRzXHJcbiAgICAgIGlmICghZmlyc3QpIHtcclxuICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpKTtcclxuICAgICAgICBlcnJvck5hbWUgPSAnZW1wdHknO1xyXG4gICAgICB9IGVsc2UgaWYgKCFzZWNvbmQpIHtcclxuICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpKTtcclxuICAgICAgICBlcnJvck5hbWUgPSAnZW1wdHknO1xyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlyZCkge1xyXG4gICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykpO1xyXG4gICAgICAgIGVycm9yTmFtZSA9ICdlbXB0eSc7XHJcbiAgICAgIH0gZWxzZSB7IC8vb25seSBkaWdpdHMgaXMgdmFsaWRcclxuICAgICAgICBpZiAoIVV0aWxzLmlzTnVtYmVyKGZpcnN0KSkge1xyXG4gICAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKSk7XHJcbiAgICAgICAgICBlcnJvck5hbWUgPSAnbnVtYmVyJztcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIoc2Vjb25kKSkge1xyXG4gICAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKSk7XHJcbiAgICAgICAgICBlcnJvck5hbWUgPSAnbnVtYmVyJztcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIodGhpcmQpKSB7XHJcbiAgICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpKTtcclxuICAgICAgICAgIGVycm9yTmFtZSA9ICdudW1iZXInO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGVycm9yKSB7IC8vc2hvdyBlcnJvciBpZiBhbnlcclxuICAgICAgICB2YXIgZXJyb3JUeHQgPSAoJ2VtcHR5JyA9PT0gZXJyb3JOYW1lKSA/IGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JFbXB0eSA6IGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JWYWxpZDtcclxuICAgICAgICAkKHRoaXMuZXJyb3JTZXR0aW5ncykucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpLnRleHQoZXJyb3JUeHQpO1xyXG4gICAgICB9IGVsc2UgeyAvL290aGVyd2lzZSBzYXZlIG5ldyBzZXR0aW5nc1xyXG4gICAgICAgIHNldHRpbmdzID0ge1xyXG4gICAgICAgICAgZmlyc3Q6IGZpcnN0LFxyXG4gICAgICAgICAgc2Vjb25kOiBzZWNvbmQsXHJcbiAgICAgICAgICB0aGlyZDogdGhpcmRcclxuICAgICAgICB9O1xyXG4gICAgICAgIExXLnB1dFNldHRpbmdzKHNldHRpbmdzKTtcclxuICAgICAgICAkKHRoaXMuZXJyb3JTZXR0aW5ncykucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpLnRleHQobG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5lcnJvck5vKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBzZXR0aW5nczsgLy9zdG9yZSBsb2NhbFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNhbmNlbFNldHRpbmcoKSB7XHJcbiAgICAgIFV0aWxzLmNsZWFyRmllbGRzKCk7XHJcbiAgICAgIHRoaXMuZ2V0U2V0dGluZ3MoKTtcclxuICAgIH1cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gdXRpbHMuanNcclxuICogY29kZWQgYnkgQW5hdG9saWkgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGUxcjBuZC5jcmdAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmlmICh0eXBlb2YgKFV0aWxzKSA9PSAndW5kZWZpbmVkJyB8fCBVdGlscyA9PSBudWxsIHx8ICFVdGlscykge1xyXG4gIHZhciBVdGlscyA9IHt9O1xyXG5cclxuICBVdGlscyA9IHtcclxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbiAoc3RyLCB3aXRoRG90KSB7IC8vdmFsaWRhdGUgZmlsZWQgZm9yIG51bWJlciB2YWx1ZVxyXG4gICAgICB2YXIgTnVtYmVyUmVnID0gL15cXGQrJC8sXHJcbiAgICAgICAgTnVtYmVyV2l0aERvdFJlZyA9IC9eWy0rXT9bMC05XSpcXC4/WzAtOV0rJC87XHJcblxyXG4gICAgICByZXR1cm4gd2l0aERvdCA/IE51bWJlcldpdGhEb3RSZWcudGVzdChzdHIpIDogTnVtYmVyUmVnLnRlc3Qoc3RyKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJGaWVsZHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLmZvcm0tZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uIChpLCBub2RlKSB7IC8vY2xlYXIgYWxsIGVycm9yIHN0eWxlc1xyXG4gICAgICAgICQobm9kZSkucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnI2Vycm9yU2V0dGluZ3MnKS5hZGRDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEZpZWxkRXJyb3I6IGZ1bmN0aW9uIChzZWxmKSB7IC8vc2V0IHRoZSBlcnJvciBzdHlsZSBmb3IgdGhlIGN1cnJlbnQgaW5wdXQgZmllbGRcclxuICAgICAgJChzZWxmKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSYW5kb21JbnQ6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0VG9kYXk6IGZ1bmN0aW9uIChmdWxsRGF0ZSkge1xyXG4gICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgIGlmIChmdWxsRGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpKS52YWx1ZU9mKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xvc2VNb2JNZW51OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkKCcjYnMtZXhhbXBsZS1uYXZiYXItY29sbGFwc2UtMScpLmhhc0NsYXNzKCdpbicpKSB7XHJcbiAgICAgICAgJCgnI25hdmJhclRvZ2dsZScpLmNsaWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2h1ZmZsZTogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdmFyIGosIHgsIGk7XHJcbiAgICAgIGZvciAoaSA9IGEubGVuZ3RoOyBpOyBpLS0pIHtcclxuICAgICAgICBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSk7XHJcbiAgICAgICAgeCA9IGFbaSAtIDFdO1xyXG4gICAgICAgIGFbaSAtIDFdID0gYVtqXTtcclxuICAgICAgICBhW2pdID0geDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAhPSBudWxsKSB7XHJcbiAgICBleHBvcnRzLlV0aWxzID0gVXRpbHM7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL3V0aWxzL3V0aWxzLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==