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
	
	var _memorystore = __webpack_require__(4);
	
	var _navigation = __webpack_require__(5);
	
	var _local = __webpack_require__(6);
	
	var _vocabulary = __webpack_require__(7);
	
	var _learn = __webpack_require__(8);
	
	var _repeat = __webpack_require__(9);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var LW = new _LW2.default('LWdb');
	console.log(LW.isLocalStorageAvailable());
	
	var Settings = new _settings2.default();
	
	// load the default words set if needed
	if (LW.isOK && LW.isEmpty) {
	  console.log('memorystore: start loading words');
	  LW.loadWords(_memorystore.Memorystore);
	  console.log('memorystore: words have been loaded');
	}
	
	_navigation.Navigation.init();
	
	_local.local.init();
	
	_vocabulary.Vocabulary.init();
	_vocabulary.Vocabulary.viewWord();
	
	_learn.Learn.init();
	_learn.Learn.recountIndexLearn();
	_learn.Learn.showWord();
	
	_repeat.Repeat.init();
	_repeat.Repeat.recountIndexRepeat();
	_repeat.Repeat.showWord();
	
	if (true) {
	  console.log('development environment ' + ("development"));
	}
	// read settings
	Settings.getSettings();
	
	// set user saved local
	if (_local.local.currentLocal !== $('[data-type=lang-select].selected').data('lang')) {
	  $('[data-lang=' + _local.local.currentLocal + ']').click();
	};
	
	_utils.Utils.closeMobMenu();

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
	        var key = void 0;
	        var strValue = void 0;
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
	        }
	
	        // Dump the array as JSON code (for select all / copy)
	        console.log(JSON.stringify(result));
	      }
	    }
	  }, {
	    key: 'removeObjects',
	    value: function removeObjects(aKeyPrefix) {
	      if (this.isOK) {
	        var key = void 0;
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
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Learn Words // settings.js
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
	      var first = $(this.inputFirstCheck).val().trim();
	
	      var second = $(this.inputSecondCheck).val().trim();
	      var third = $(this.inputThirdCheck).val().trim();
	      var form = $(this.settingFrom);
	      var errorName = '';
	      var error = false;
	
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
	      }
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

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**************************************************
	 * Learn Words // utils.js
	 * coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
	 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	 * Placed in public domain.
	**************************************************/
	var Utils = {};
	
	exports.Utils = Utils = {
	  isNumber: function isNumber(str, withDot) {
	    //validate filed for number value
	    var NumberReg = /^\d+$/;
	    var NumberWithDotReg = /^[-+]?[0-9]*\.?[0-9]+$/;
	
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
	    var j = void 0;
	    var x = void 0;
	    var i = void 0;
	    for (i = a.length; i; i--) {
	      j = Math.floor(Math.random() * i);
	      x = a[i - 1];
	      a[i - 1] = a[j];
	      a[j] = x;
	    }
	  }
	};
	
	if (typeof module !== 'undefined' && module.exports != null) {
	  exports.Utils = Utils;
	}
	
	exports.Utils = Utils;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**************************************************
	 * Learn Words // memorystore.js
	 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - January 2017
	 * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
	 * Placed in public domain.
	 **************************************************/
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.local = undefined;
	
	var _LW = __webpack_require__(1);
	
	var _LW2 = _interopRequireDefault(_LW);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var LW = new _LW2.default('LWdb'); /**************************************************
	                                    * Learn Words // local.js
	                                    * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	                                    * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
	                                    * Placed in public domain.
	                                    **************************************************/
	
	
	console.log('define local');
	var local = {
	  en_GB: {
	    summary: 'Summary',
	    learn: 'Learn',
	    repeat: 'Repeat',
	    vocabulary: 'Vocabulary',
	    settings: 'Settings',
	    editWords: 'Edit words',
	    first: 'First',
	    second: 'Second',
	    third: 'Third',
	    saveBtn: 'Save',
	    cancelBtn: 'Cancel',
	    language: 'Language',
	    en_GB: 'english',
	    de_DE: 'deutsch',
	    ru_RU: 'русский',
	    errorEmpty: 'All fields are required.',
	    errorValid: 'Entered values are incorrect.',
	    errorNo: 'New settings was saved.',
	    errorNoW: 'New word was added.',
	    totalWords: 'Total words',
	    learnWordsNum: 'Words to learn',
	    repeatWords: 'Words to repeat',
	    rememberBtn: 'Remember',
	    repeatBtn: 'Repeat',
	    knownBtn: 'Know',
	    allWordsOk: 'No more words for learning.',
	    inputWordLbl: 'Word',
	    inputTranslateLbl: 'Translate',
	    enterBtn: 'Check',
	    allWordsDone: 'No more words for repeat.'
	  },
	
	  ru_RU: {
	    summary: 'Сводка',
	    learn: 'Учить',
	    repeat: 'Повторять',
	    vocabulary: 'Словарь',
	    settings: 'Настройки',
	    editWords: 'Редактировать слова',
	    first: 'Первый',
	    second: 'Второй',
	    third: 'Третий',
	    saveBtn: 'Сохранить',
	    cancelBtn: 'Отменить',
	    language: 'Язык',
	    en_GB: 'english',
	    de_DE: 'deutsch',
	    ru_RU: 'русский',
	    errorEmpty: 'Все поля обязательны.',
	    errorValid: 'Введенные значения невалидны.',
	    errorNo: 'Новые значение были записаны.',
	    errorNoW: 'Новое слово добавлено.',
	    totalWords: 'Всего слов',
	    learnWordsNum: 'Слов учить',
	    repeatWords: 'Сегодня поторить слов',
	    rememberBtn: 'Запомнил',
	    repeatBtn: 'Повторить',
	    knownBtn: 'Знаю',
	    allWordsOk: 'Нет больше слов для изучения.',
	    inputWordLbl: 'Слово',
	    inputTranslateLbl: 'Перевод',
	    enterBtn: 'Проверить',
	    allWordsDone: 'Нет больше слов для повторения.'
	  },
	
	  de_DE: {
	    summary: 'Summe',
	    learn: 'Lernen',
	    repeat: 'Wiederholen',
	    vocabulary: 'Vokabular',
	    settings: 'Rahmen',
	    editWords: 'Wörter ändern',
	    first: 'Erste',
	    second: 'Zweite',
	    third: 'Dritte',
	    saveBtn: 'Speichern',
	    cancelBtn: 'Stornieren',
	    language: 'Sprache',
	    en_GB: 'english',
	    de_DE: 'deutsch',
	    ru_RU: 'русский',
	    errorEmpty: 'Alle Felder sind erforderlich.',
	    errorValid: 'Eingegebene Werte sind falsch.',
	    errorNo: 'Neue Einstellungen gespeichert wurde.',
	    errorNoW: 'Neues Wort hinzugefügt.',
	    totalWords: 'Insgesamt Worte',
	    learnWordsNum: 'Wörter zu lernen',
	    repeatWords: 'Worte zu wiederholen',
	    rememberBtn: 'Merken',
	    repeatBtn: 'Wiederholen',
	    knownBtn: 'Wissen',
	    allWordsOk: 'Keine Worte mehr für das Lernen.',
	    inputWordLbl: 'Wort',
	    inputTranslateLbl: 'Übersetzen',
	    enterBtn: 'Prüfen',
	    allWordsDone: 'Keine Worte mehr für wiederholen.'
	  },
	
	  changeLocalContent: function changeLocalContent() {
	    // change inner content
	    var langNode = $('[data-toggle=lang]');
	
	    var langSelect = $('[data-type=lang-select]');
	
	    $(langNode).each(function (i, node) {
	      $(node).text(local[local.currentLocal][$(node).data('lang')]);
	    });
	    $(langSelect).each(function (i, node) {
	      $(node).removeClass('selected');
	    });
	  },
	  langSelect: function langSelect() {
	    //change localization
	    local.currentLocal = $(this).data('lang');
	    $('#langSelect').click();
	    $('.navbar-toggle:visible').click();
	    local.changeLocalContent();
	    LW.storeItem(LW.name + '-language', local.currentLocal);
	    $(this).addClass('selected');
	    return false;
	  },
	  init: function init() {
	    // var settings = LW.getSettings(); // to force initialisation.
	    this.currentLocal = LW.readItem(LW.name + '-language');
	    $(document).on('click touchstart', '[data-type=lang-select]', local.langSelect);
	  }
	};
	
	exports.local = local;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Vocabulary = undefined;
	
	var _LW = __webpack_require__(1);
	
	var _LW2 = _interopRequireDefault(_LW);
	
	var _utils = __webpack_require__(3);
	
	var _learn = __webpack_require__(8);
	
	var _repeat = __webpack_require__(9);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var LW = new _LW2.default('LWdb'); /**************************************************
	                                    * Learn Words // vocabulary.js
	                                    * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	                                    * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	                                    * Placed in public domain.
	                                    **************************************************/
	
	
	var Vocabulary = {
	  rowTemplate: '<div id="{{node}}" class="row"><div class="col-md-5 col-sm-5 col-xs-4">{{txt}}</div>' + '<div class="col-md-5 col-sm-5 col-xs-4">{{translate}}</div>' + '<div class="col-md-2 col-sm-2 col-xs-4"><button data-node="{{node}}" type="button" class="btn btn-info js-edit-btn"><span class="glyphicon glyphicon-edit"></span></button></div>' + '</div>' + '<div id="{{node}}Edit" class="row nodisplay"><form id="form-{{node}}" role="form">' + '<div class="col-md-5 col-sm-5 col-xs-4"><input type="text" class="form-control inp-fld" id="word-{{node}}" placeholder="Enter word" value="{{txt}}"></div>' + '<div class="col-md-5 col-sm-5 col-xs-4"><input type="text" class="form-control inp-fld" id="translate-{{node}}" placeholder="Enter translate" value="{{translate}}"></div>' + '<div class="col-md-2 col-sm-2 col-xs-4"><button data-node="{{node}}" type="button" class="btn btn-success js-save-btn"><span class="glyphicon glyphicon-ok"></span></button>' + '<button id="del-{{node}}" data-node="{{node}}" data-id="{{index}}" type="button" class="btn btn-danger js-del-btn"><span class="glyphicon glyphicon-remove"></span></button>' + '</div></form>' + '</div>',
	
	  totalWordsNum: $('#totalWordsNum'),
	  vocabularyBox: $('#vocabularyBox'),
	  errorVocabularyBox: $('#errorVocabularyBox'),
	  errorVocabulary: $('#errorVocabulary'),
	  inputWordTxt: $('#inputWordTxt'),
	  inputTranslate: $('#inputTranslate'),
	  addWordForm: $('#addWordForm'),
	
	  words: [],
	  translates: [],
	
	  recountTotal: function recountTotal() {
	    $(Vocabulary.totalWordsNum).text(LW.index.length);
	  },
	  removeWord: function removeWord(self, notReindex) {
	    //remove word from vocabulary
	    var id = $(self).data('id');
	
	    var node = $(self).data('node');
	
	    if (!notReindex) {
	      LW.index.splice(id, 1); //remove from index
	      LW.storeItem(LW.name + '-words', LW.index.join());
	    }
	    LW.removeItem(LW.name + '-' + node); //remove this word
	    $('#' + node).remove();
	    $('#' + node + 'Edit').remove();
	    Vocabulary.recountTotal();
	    _learn.Learn.wordsLearn = [];
	    _learn.Learn.recountIndexLearn();
	    _repeat.Repeat.wordsRepeat = {
	      currentIndexFirst: 0,
	      first: [],
	      currentIndexSecond: 0,
	      second: [],
	      currentIndexThird: 0,
	      third: []
	    };
	    _repeat.Repeat.recountIndexRepeat();
	  },
	  viewWord: function viewWord() {
	    var contentInner = '';
	
	    $(LW.index).each(function (index, node) {
	      var txt = void 0;
	      var translate = void 0;
	      var item = LW.readItem(LW.name + '-' + node);
	      if (item) {
	        txt = item.word;
	        translate = item.translate;
	
	        Vocabulary.words.push(txt);
	        Vocabulary.translates.push(translate);
	        contentInner += Vocabulary.rowTemplate.replace(/{{node}}/g, node).replace(/{{txt}}/g, txt).replace(/{{translate}}/g, translate).replace(/{{index}}/g, index);
	      }
	    });
	
	    $(Vocabulary.vocabularyBox).html(contentInner);
	    Vocabulary.recountTotal();
	  },
	  addSaveWord: function addSaveWord(wordTxt, translate, addForm, addWord) {
	    var inputWord = wordTxt.val().trim();
	    var inputTranslate = translate.val().trim();
	    var form = addForm;
	    var error = false;
	    var word = {};
	
	    _utils.Utils.clearFields();
	    //check for empty fields
	    if (!inputWord) {
	      error = _utils.Utils.setFieldError(form.children(':nth-child(1)').children(':nth-child(1)'));
	    } else if (!inputTranslate) {
	      error = _utils.Utils.setFieldError(form.children(':nth-child(2)').children(':nth-child(1)'));
	    }
	    if (error) {
	      //show error if any
	      $(Vocabulary.errorVocabularyBox).removeClass('nodisplay');
	      $(Vocabulary.errorVocabulary).text(local[local.currentLocal].errorEmpty);
	    } else {
	      //otherwise save new word to Vocabulary
	      var newIndexVal = void 0;
	      var todayDate = _utils.Utils.getToday(true);
	      word = {
	        index: todayDate,
	        word: inputWord,
	        translate: inputTranslate,
	        step: 0,
	        date: 0
	      };
	
	      // save newly added word
	      newIndexVal = 'index' + (LW.index.length + 1);
	      LW.storeItem(LW.name + '-' + newIndexVal, word);
	
	      var contentInner = Vocabulary.rowTemplate.replace(/{{node}}/g, todayDate).replace(/{{txt}}/g, inputWord).replace(/{{translate}}/g, inputTranslate).replace(/{{index}}/g, addWord ? LW.index.length : LW.index.indexOf(inputWord));
	
	      if (addWord) {
	        LW.index.push(newIndexVal);
	        wordTxt.val('');
	        translate.val('');
	        $(Vocabulary.errorVocabularyBox).removeClass('nodisplay');
	        $(Vocabulary.errorVocabulary).text(local[local.currentLocal].errorNoW);
	        $(Vocabulary.vocabularyBox).append(contentInner);
	      } else {
	        var id = wordTxt.attr('id').slice(5);
	
	        LW.index[LW.index.indexOf(id)] = newIndexVal;
	        $('#' + id).before(contentInner);
	        Vocabulary.removeWord($('#del-' + id), true);
	      }
	
	      LW.storeItem(LW.name + '-words', LW.index.join()); //add word to Vocabulary list
	      _utils.Utils.clearFields();
	      Vocabulary.recountTotal();
	      _learn.Learn.wordsLearn = [];
	      _learn.Learn.recountIndexLearn();
	      _learn.Learn.showWord();
	    }
	  },
	  init: function init() {
	    $(document).on('click touchstart', '#addBtn', function () {
	      Vocabulary.addSaveWord($(Vocabulary.inputWordTxt), $(Vocabulary.inputTranslate), $(Vocabulary.addWordForm), true);
	    });
	    $(document).on('click touchstart', '.js-edit-btn', function () {
	      $('#' + $(this).data('node')).hide();
	      $('#' + $(this).data('node') + 'Edit').show();
	    });
	    $(document).on('click touchstart', '.js-save-btn', function () {
	      Vocabulary.addSaveWord($('#word-' + $(this).data('node')), $('#translate-' + $(this).data('node')), $('#form-' + $(this).data('node')));
	    });
	    $(document).on('click touchstart', '.js-del-btn', function () {
	      Vocabulary.removeWord(this);
	    });
	  }
	};
	
	exports.Vocabulary = Vocabulary;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Learn = undefined;
	
	var _LW = __webpack_require__(1);
	
	var _LW2 = _interopRequireDefault(_LW);
	
	var _utils = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var LW = new _LW2.default('LWdb'); /**********************************************
	                                    * Learn Words // learn.js
	                                    * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	                                    * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
	                                    *
	                                    * Updated by Hannes Hirzel, November 2016
	                                    *
	                                    * Placed in public domain.
	                                    **************************************************/
	
	
	var Learn = {
	  wordsLearn: [],
	  currentIndex: 0,
	
	  learnWordsNum: $('#learnWordsNum'),
	  learnWordsTopNum: $('#learnWordsTopNum'),
	  learnWordsTopSNum: $('#learnWordsTopSNum'),
	
	  learnWord: $('#learnWord'),
	  translateWord: $('#translateWord'),
	  learnWordsGrp: $('#learnWordsGrp'),
	  noWordsLeft: $('#noWordsLeft'),
	  allWordsOk: $('#allWordsOk'),
	
	  recountIndexLearn: function recountIndexLearn() {
	    //count words to learn
	    if (!Learn.wordsLearn.length) {
	      $(LW.index).each(function (index, node) {
	        //the initial counting
	        var item = LW.readItem(LW.name + '-' + node);
	        if (item) {
	          if (0 === item.step) {
	            Learn.wordsLearn.push(item);
	          }
	        }
	      });
	    }
	    console.log('Learn recountIndexLearn', Learn.wordsLearn);
	    var wordsLearnLength = Learn.wordsLearn.length ? Learn.wordsLearn.length : '';
	
	    $(learnWordsNum).text(wordsLearnLength || '0');
	    $(learnWordsTopNum).text(wordsLearnLength);
	    $(learnWordsTopSNum).text(wordsLearnLength);
	  },
	  showWord: function showWord() {
	    //show a next word to learn
	    if (Learn.wordsLearn.length) {
	      $(learnWord).text(Learn.wordsLearn[Learn.currentIndex].word);
	      $(translateWord).text(Learn.wordsLearn[Learn.currentIndex].translate);
	      $(learnWordsGrp).removeClass('nodisplay');
	      $(noWordsLeft).addClass('nodisplay');
	    } else {
	      $(allWordsOk).text(local[local.currentLocal].allWordsOk);
	      $(noWordsLeft).removeClass('nodisplay');
	      $(learnWordsGrp).addClass('nodisplay');
	    }
	  },
	  actionWord: function actionWord(step, reindex) {
	    if (step) {
	      var word = {
	        index: Learn.wordsLearn[Learn.currentIndex].index,
	        word: Learn.wordsLearn[Learn.currentIndex].word,
	        translate: Learn.wordsLearn[Learn.currentIndex].translate,
	        step: step,
	        date: 1 === step ? _utils.Utils.getToday() + _utils.Utils.delay * Settings.params.first : 0
	      };
	
	      LW.storeItem(LW.name + '-' + Learn.wordsLearn[Learn.currentIndex].index, word); //save word
	
	      if (reindex) {
	        Learn.wordsLearn.splice(Learn.currentIndex, 1); //remove from index
	        Learn.recountIndexLearn();
	      } else {
	        Learn.currentIndex++;
	      }
	    } else {
	      Learn.currentIndex++;
	    }
	
	    if (Learn.currentIndex >= Learn.wordsLearn.length) {
	      Learn.currentIndex = 0;
	    }
	    Learn.showWord();
	  },
	  rememberWord: function rememberWord() {
	    Learn.actionWord(1, true);
	  },
	  repeatWord: function repeatWord() {
	    Learn.actionWord(0);
	  },
	  knownWord: function knownWord() {
	    Learn.actionWord(4, true);
	  },
	  init: function init() {
	    $(document).on('click touchstart', '#rememberBtn', Learn.rememberWord);
	    $(document).on('click touchstart', '#repeatBtn', Learn.repeatWord);
	    $(document).on('click touchstart', '#knownBtn', Learn.knownWord);
	  }
	};
	
	exports.Learn = Learn;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Repeat = undefined;
	
	var _Repeat;
	
	var _LW = __webpack_require__(1);
	
	var _LW2 = _interopRequireDefault(_LW);
	
	var _utils = __webpack_require__(3);
	
	var _learn = __webpack_require__(8);
	
	var _settings = __webpack_require__(2);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**************************************************
	                                                                                                                                                                                                                   * Learn Words // repeat.js
	                                                                                                                                                                                                                   * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	                                                                                                                                                                                                                   * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	                                                                                                                                                                                                                   * Placed in public domain.
	                                                                                                                                                                                                                   **************************************************/
	
	
	var LW = new _LW2.default('LWdb');
	
	var Settings = new _settings2.default();
	
	var Repeat = (_Repeat = {
	  wordsRepeat: {
	    first: [],
	    second: [],
	    third: []
	  },
	
	  repeatWordsNum: $('#repeatWordsNum'),
	  repeatWordsTopNum: $('#repeatWordsTopNum'),
	  repeatWordsTopSNum: $('#repeatWordsTopSNum'),
	  checkWord: $('#checkWord'),
	  checkWordInp: $('#checkWordInp'),
	  enterWord: $('#enterWord'),
	  inputWord: $('#inputWord'),
	  noWordsRepeat: $('#noWordsRepeat'),
	  enterBtn: $('#enterBtn'),
	
	  recountIndexRepeat: function recountIndexRepeat() {
	    //count words to Repeat
	    if (!Repeat.wordsRepeat.first.length && !Repeat.wordsRepeat.second.length && !Repeat.wordsRepeat.third.length) {
	      $(LW.index).each(function (index, node) {
	        //the initial counting
	        var item = LW.readItem(LW.name + '-' + node);
	        if (item) {
	          if (_utils.Utils.getToday() > item.date) {
	            //if this word is for today
	            if (1 === item.step) {
	              Repeat.wordsRepeat.first.push(item);
	            } else if (2 === item.step) {
	              Repeat.wordsRepeat.second.push(item);
	            }
	            if (3 === item.step) {
	              Repeat.wordsRepeat.third.push(item);
	            }
	          }
	        }
	      });
	    }
	    var wordsRepeatTotal = Repeat.wordsRepeat.first.length + Repeat.wordsRepeat.second.length + Repeat.wordsRepeat.third.length;
	    var wordsRepeatLength = wordsRepeatTotal ? wordsRepeatTotal : '';
	
	    $(repeatWordsNum).text(wordsRepeatLength || '0');
	    $(repeatWordsTopNum).text(wordsRepeatLength);
	    $(repeatWordsTopSNum).text(wordsRepeatLength);
	  },
	  getWord: function getWord(index, arrWords) {
	    //if index is 0 we get the correct word. The other words are random
	    if (0 === index) {
	      wordPlaceholder = Repeat.wordsRepeat[Repeat.wordsRepeat.first.length ? 'first' : 'second'][0][Repeat.wordsRepeat.first.length ? 'translate' : 'word'];
	    } else {
	      wordPlaceholder = Vocabulary[Repeat.wordsRepeat.first.length ? 'translates' : 'words'][_utils.Utils.getRandomInt(0, Vocabulary[Repeat.wordsRepeat.first.length ? 'translates' : 'words'].length - 1)];
	    }
	
	    if (arrWords.includes(wordPlaceholder)) {
	      Repeat.getWord(index, arrWords);
	    }
	
	    return wordPlaceholder;
	  },
	  showWord: function showWord() {
	    //show a next word to Repeat
	    if (Repeat.wordsRepeat.first.length || Repeat.wordsRepeat.second.length) {
	      (function () {
	        var id = Repeat.wordsRepeat[Repeat.wordsRepeat.first.length ? 'first' : 'second'][0].index;
	        var wordPlaceholder = '';
	        var arrWords = new Array();
	        $(checkWordInp).text(Repeat.wordsRepeat[Repeat.wordsRepeat.first.length ? 'first' : 'second'][0][Repeat.wordsRepeat.first.length ? 'word' : 'translate']).data('id', id);
	
	        var arrOptionButtons = $('[data-type=checkWordBtn]');
	        //the answer buttons are shuffled so that we don't know which one is the correct word.
	        _utils.Utils.shuffle(arrOptionButtons);
	
	        arrOptionButtons.each(function (index) {
	
	          wordPlaceholder = Repeat.getWord(index, arrWords);
	
	          arrWords[index] = wordPlaceholder;
	
	          $(this).text(wordPlaceholder);
	        });
	        $(enterBtn).data('direction', true);
	        $(checkWord).removeClass('nodisplay');
	        $(enterWord).addClass('nodisplay');
	        $(noWordsRepeat).addClass('nodisplay');
	      })();
	    } else if (Repeat.wordsRepeat.third.length) {
	      $(enterWordInp).text(Repeat.wordsRepeat.third[0].translate);
	      $(checkWord).addClass('nodisplay');
	      $(enterWord).removeClass('nodisplay');
	      $(noWordsRepeat).addClass('nodisplay');
	    } else {
	      $(checkWord).addClass('nodisplay');
	      $(enterWord).addClass('nodisplay');
	      $(noWordsRepeat).removeClass('nodisplay');
	    }
	  },
	  actionWord: function actionWord(step, reindex) {
	    if (step) {
	
	      LW.storeItem(LW.name + '-' + Repeat.wordsRepeat[Repeat.currentIndex].word, word); //save word
	
	      if (reindex) {
	        Repeat.wordsRepeat.splice(Repeat.currentIndex, 1); //remove from index
	        Repeat.recountIndexRepeat();
	      } else {
	        Repeat.currentIndex++;
	      }
	    } else {
	      Repeat.currentIndex++;
	    }
	
	    if (Repeat.currentIndex >= Repeat.wordsRepeat.length) {
	      Repeat.currentIndex = 0;
	    }
	    Repeat.showWord(Repeat.currentIndex);
	  }
	}, _defineProperty(_Repeat, 'checkWord', function checkWord(self) {
	  var word = {
	    index: Repeat.wordsRepeat[Repeat.wordsRepeat.first.length ? 'first' : 'second'][0].index,
	    word: Repeat.wordsRepeat[Repeat.wordsRepeat.first.length ? 'first' : 'second'][0].word,
	    translate: Repeat.wordsRepeat[Repeat.wordsRepeat.first.length ? 'first' : 'second'][0].translate,
	    step: Repeat.wordsRepeat[Repeat.wordsRepeat.first.length ? 'first' : 'second'][0].step
	  };
	
	  if ($(self).text() === (Repeat.wordsRepeat.first.length ? word.translate : word.word)) {
	    word.step++;
	    word.date = _utils.Utils.getToday() + _utils.Utils.delay * Settings.params[Repeat.wordsRepeat.first.length ? 'second' : 'third'];
	  } else {
	    word.step--;
	    word.date = Repeat.wordsRepeat.first.length ? 0 : _utils.Utils.getToday() + _utils.Utils.delay * Settings.params.first;
	  }
	  LW.storeItem(LW.name + '-' + word.index, word); //save word
	  Repeat.wordsRepeat[Repeat.wordsRepeat.first.length ? 'first' : 'second'].splice(0, 1); //remove from index
	  _learn.Learn.wordsLearn = [];
	  _learn.Learn.recountIndexLearn();
	  _learn.Learn.showWord();
	  Repeat.recountIndexRepeat();
	  Repeat.showWord();
	}), _defineProperty(_Repeat, 'repeatWord', function repeatWord() {
	  var word = {
	    index: Repeat.wordsRepeat.third[0].index,
	    word: Repeat.wordsRepeat.third[0].word,
	    translate: Repeat.wordsRepeat.third[0].translate,
	    step: Repeat.wordsRepeat.third[0].step
	  };
	  if ($(enterWordInp).val() === word.word) {
	    word.step++;
	    word.date = 0;
	  } else {
	    word.step--;
	    word.date = _utils.Utils.getToday() + _utils.Utils.delay * Settings.params.second;
	  };
	  LW.storeItem(LW.name + '-' + word.index, word); //save word
	  Repeat.wordsRepeat.third.splice(0, 1); //remove from index
	  _learn.Learn.wordsLearn = [];
	  _learn.Learn.recountIndexLearn();
	  _learn.Learn.showWord();
	  Repeat.recountIndexRepeat();
	  Repeat.showWord();
	}), _defineProperty(_Repeat, 'init', function init() {
	  $(document).on('click touchstart', '[data-type=checkWordBtn]', function () {
	    Repeat.checkWord(this);
	  });
	  $(document).on('click touchstart', '#enterBtn', Repeat.repeatWord);
	}), _Repeat);
	
	exports.Repeat = Repeat;

/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvTFcuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pzL3V0aWxzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL2FwcC9qcy91dGlscy9tZW1vcnlzdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvbmF2aWdhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvbG9jYWwvbG9jYWwuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pzL2FjdGlvbnMvdm9jYWJ1bGFyeS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvYWN0aW9ucy9sZWFybi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvYWN0aW9ucy9yZXBlYXQuanMiXSwibmFtZXMiOlsiTFciLCJjb25zb2xlIiwibG9nIiwiaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUiLCJTZXR0aW5ncyIsImlzT0siLCJpc0VtcHR5IiwibG9hZFdvcmRzIiwiaW5pdCIsInZpZXdXb3JkIiwicmVjb3VudEluZGV4TGVhcm4iLCJzaG93V29yZCIsInJlY291bnRJbmRleFJlcGVhdCIsImdldFNldHRpbmdzIiwiY3VycmVudExvY2FsIiwiJCIsImRhdGEiLCJjbGljayIsImNsb3NlTW9iTWVudSIsIkxXQ2xhc3MiLCJkYk5hbWUiLCJhbGVydCIsIm5hbWUiLCJpbmRleCIsInN0ckluZGV4IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNwbGl0Iiwid2luZG93IiwiZSIsImtleSIsIkpTT04iLCJwYXJzZSIsInJlbW92ZUl0ZW0iLCJ2YWx1ZSIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJRVU9UQV9FWENFRURFRF9FUlIiLCJ0aGVTZXR0aW5nc09iaiIsInN0b3JlSXRlbSIsInNldHRpbmdzIiwicmVhZEl0ZW0iLCJmaXJzdCIsInNlY29uZCIsInRoaXJkIiwidGhlV29yZHMiLCJpIiwiYXJyYXlPZktleXMiLCJzdG9yZUVhY2hFbGVtZW50IiwiZWxlbWVudCIsInN0ZXAiLCJkYXRlIiwicHVzaCIsImZvckVhY2giLCJiaW5kIiwiam9pbiIsImxlbmd0aCIsInN0clZhbHVlIiwicmVzdWx0IiwicHJlZml4Rm9yTnVtYmVyIiwibGFzdEluZGV4T2YiLCJhS2V5UHJlZml4Iiwia2V5c1RvRGVsZXRlIiwic3QiLCJhS2V5IiwicmVtb3ZlT2JqZWN0cyIsIlNldHRpbmdzQ2xhc3MiLCJpbnB1dEZpcnN0Q2hlY2siLCJpbnB1dFNlY29uZENoZWNrIiwiaW5wdXRUaGlyZENoZWNrIiwic2V0dGluZ0Zyb20iLCJlcnJvclNldHRpbmdzIiwicGFyYW1zIiwiZG9jdW1lbnQiLCJvbiIsInNhdmVTZXR0aW5nIiwiY2FuY2VsU2V0dGluZyIsInN0b3JlZFNldHRpbmdzIiwidmFsIiwidHJpbSIsImZvcm0iLCJlcnJvck5hbWUiLCJlcnJvciIsIlV0aWxzIiwiY2xlYXJGaWVsZHMiLCJzZXRGaWVsZEVycm9yIiwiY2hpbGRyZW4iLCJpc051bWJlciIsImVycm9yVHh0IiwibG9jYWwiLCJlcnJvckVtcHR5IiwiZXJyb3JWYWxpZCIsInJlbW92ZUNsYXNzIiwidGV4dCIsInB1dFNldHRpbmdzIiwiZXJyb3JObyIsInN0ciIsIndpdGhEb3QiLCJOdW1iZXJSZWciLCJOdW1iZXJXaXRoRG90UmVnIiwidGVzdCIsImVhY2giLCJub2RlIiwiYWRkQ2xhc3MiLCJzZWxmIiwiZ2V0UmFuZG9tSW50IiwibWluIiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ2V0VG9kYXkiLCJmdWxsRGF0ZSIsIm5vdyIsIkRhdGUiLCJ2YWx1ZU9mIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJoYXNDbGFzcyIsInNodWZmbGUiLCJhIiwiaiIsIngiLCJtb2R1bGUiLCJleHBvcnRzIiwiTWVtb3J5c3RvcmUiLCJOYXZpZ2F0aW9uIiwiaGFzaGd1YXJkIiwiaGFzaCIsImxvY2F0aW9uIiwidHJpZ2dlciIsInNldFRpbWVvdXQiLCJoYXNoYnJlYWsiLCJoYXNoVXJsIiwic2xpY2UiLCJuYXZTZWxlY3QiLCJwYXJlbnQiLCJlbl9HQiIsInN1bW1hcnkiLCJsZWFybiIsInJlcGVhdCIsInZvY2FidWxhcnkiLCJlZGl0V29yZHMiLCJzYXZlQnRuIiwiY2FuY2VsQnRuIiwibGFuZ3VhZ2UiLCJkZV9ERSIsInJ1X1JVIiwiZXJyb3JOb1ciLCJ0b3RhbFdvcmRzIiwibGVhcm5Xb3Jkc051bSIsInJlcGVhdFdvcmRzIiwicmVtZW1iZXJCdG4iLCJyZXBlYXRCdG4iLCJrbm93bkJ0biIsImFsbFdvcmRzT2siLCJpbnB1dFdvcmRMYmwiLCJpbnB1dFRyYW5zbGF0ZUxibCIsImVudGVyQnRuIiwiYWxsV29yZHNEb25lIiwiY2hhbmdlTG9jYWxDb250ZW50IiwibGFuZ05vZGUiLCJsYW5nU2VsZWN0IiwiVm9jYWJ1bGFyeSIsInJvd1RlbXBsYXRlIiwidG90YWxXb3Jkc051bSIsInZvY2FidWxhcnlCb3giLCJlcnJvclZvY2FidWxhcnlCb3giLCJlcnJvclZvY2FidWxhcnkiLCJpbnB1dFdvcmRUeHQiLCJpbnB1dFRyYW5zbGF0ZSIsImFkZFdvcmRGb3JtIiwid29yZHMiLCJ0cmFuc2xhdGVzIiwicmVjb3VudFRvdGFsIiwicmVtb3ZlV29yZCIsIm5vdFJlaW5kZXgiLCJpZCIsInNwbGljZSIsInJlbW92ZSIsIndvcmRzTGVhcm4iLCJ3b3Jkc1JlcGVhdCIsImN1cnJlbnRJbmRleEZpcnN0IiwiY3VycmVudEluZGV4U2Vjb25kIiwiY3VycmVudEluZGV4VGhpcmQiLCJjb250ZW50SW5uZXIiLCJ0eHQiLCJ0cmFuc2xhdGUiLCJpdGVtIiwid29yZCIsInJlcGxhY2UiLCJodG1sIiwiYWRkU2F2ZVdvcmQiLCJ3b3JkVHh0IiwiYWRkRm9ybSIsImFkZFdvcmQiLCJpbnB1dFdvcmQiLCJuZXdJbmRleFZhbCIsInRvZGF5RGF0ZSIsImluZGV4T2YiLCJhcHBlbmQiLCJhdHRyIiwiYmVmb3JlIiwiaGlkZSIsInNob3ciLCJMZWFybiIsImN1cnJlbnRJbmRleCIsImxlYXJuV29yZHNUb3BOdW0iLCJsZWFybldvcmRzVG9wU051bSIsImxlYXJuV29yZCIsInRyYW5zbGF0ZVdvcmQiLCJsZWFybldvcmRzR3JwIiwibm9Xb3Jkc0xlZnQiLCJ3b3Jkc0xlYXJuTGVuZ3RoIiwiYWN0aW9uV29yZCIsInJlaW5kZXgiLCJkZWxheSIsInJlbWVtYmVyV29yZCIsInJlcGVhdFdvcmQiLCJrbm93bldvcmQiLCJSZXBlYXQiLCJyZXBlYXRXb3Jkc051bSIsInJlcGVhdFdvcmRzVG9wTnVtIiwicmVwZWF0V29yZHNUb3BTTnVtIiwiY2hlY2tXb3JkIiwiY2hlY2tXb3JkSW5wIiwiZW50ZXJXb3JkIiwibm9Xb3Jkc1JlcGVhdCIsIndvcmRzUmVwZWF0VG90YWwiLCJ3b3Jkc1JlcGVhdExlbmd0aCIsImdldFdvcmQiLCJhcnJXb3JkcyIsIndvcmRQbGFjZWhvbGRlciIsImluY2x1ZGVzIiwiQXJyYXkiLCJhcnJPcHRpb25CdXR0b25zIiwiZW50ZXJXb3JkSW5wIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7Ozs7QUFNQTs7QUFFQTs7OztBQUlBOzs7O0FBR0E7O0FBRUE7O0FBUUE7O0FBR0E7O0FBR0E7O0FBSUE7O0FBS0E7Ozs7QUEvQkEsS0FBTUEsS0FBSyxpQkFBWSxNQUFaLENBQVg7QUFDQUMsU0FBUUMsR0FBUixDQUFZRixHQUFHRyx1QkFBSCxFQUFaOztBQUdBLEtBQU1DLFdBQVcsd0JBQWpCOztBQUtBO0FBQ0EsS0FBSUosR0FBR0ssSUFBSCxJQUFXTCxHQUFHTSxPQUFsQixFQUEyQjtBQUN6QkwsV0FBUUMsR0FBUixDQUFZLGtDQUFaO0FBQ0FGLE1BQUdPLFNBQUg7QUFDQU4sV0FBUUMsR0FBUixDQUFZLHFDQUFaO0FBQ0Q7O0FBR0Qsd0JBQVdNLElBQVg7O0FBR0EsY0FBTUEsSUFBTjs7QUFHQSx3QkFBV0EsSUFBWDtBQUNBLHdCQUFXQyxRQUFYOztBQUdBLGNBQU1ELElBQU47QUFD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a0JBQVA7QUFDQWlOLFVBQU9sTixRQUFQO0FBQ0QsRUFoS0csb0RBa0tHO0FBQ0xJLEtBQUUwRCxRQUFGLEVBQVlDLEVBQVosQ0FBZSxrQkFBZixFQUFtQywwQkFBbkMsRUFBK0QsWUFBWTtBQUN6RW1KLFlBQU9JLFNBQVAsQ0FBaUIsSUFBakI7QUFDRCxJQUZEO0FBR0FsTixLQUFFMEQsUUFBRixFQUFZQyxFQUFaLENBQWUsa0JBQWYsRUFBbUMsV0FBbkMsRUFBZ0RtSixPQUFPRixVQUF2RDtBQUNELEVBdktHLFdBQU47O1NBMEtRRSxNLEdBQUFBLE0iLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4qIExlYXJuIFdvcmRzIC8vIG1haW4uanNcclxuKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIEphbnVhcnkgMjAxN1xyXG4qIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuL3V0aWxzL0xXJztcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG5jb25zb2xlLmxvZyhMVy5pc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSgpKTtcclxuXHJcbmltcG9ydCBTZXR0aW5nc0NsYXNzIGZyb20gJy4uL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MnO1xyXG5jb25zdCBTZXR0aW5ncyA9IG5ldyBTZXR0aW5nc0NsYXNzKCk7XHJcblxyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzL3V0aWxzJztcclxuXHJcbmltcG9ydCB7TWVtb3J5c3RvcmV9IGZyb20gJy4vdXRpbHMvbWVtb3J5c3RvcmUnO1xyXG4vLyBsb2FkIHRoZSBkZWZhdWx0IHdvcmRzIHNldCBpZiBuZWVkZWRcclxuaWYgKExXLmlzT0sgJiYgTFcuaXNFbXB0eSkge1xyXG4gIGNvbnNvbGUubG9nKCdtZW1vcnlzdG9yZTogc3RhcnQgbG9hZGluZyB3b3JkcycpO1xyXG4gIExXLmxvYWRXb3JkcyhNZW1vcnlzdG9yZSk7XHJcbiAgY29uc29sZS5sb2coJ21lbW9yeXN0b3JlOiB3b3JkcyBoYXZlIGJlZW4gbG9hZGVkJyk7XHJcbn1cclxuXHJcbmltcG9ydCB7TmF2aWdhdGlvbn0gZnJvbSAnLi91dGlscy9uYXZpZ2F0aW9uJztcclxuTmF2aWdhdGlvbi5pbml0KCk7XHJcblxyXG5pbXBvcnQge2xvY2FsfSBmcm9tICcuL2xvY2FsL2xvY2FsJztcclxubG9jYWwuaW5pdCgpO1xyXG5cclxuaW1wb3J0IHtWb2NhYnVsYXJ5fSBmcm9tICcuL2FjdGlvbnMvdm9jYWJ1bGFyeSc7XHJcblZvY2FidWxhcnkuaW5pdCgpO1xyXG5Wb2NhYnVsYXJ5LnZpZXdXb3JkKCk7XHJcblxyXG5pbXBvcnQge0xlYXJufSBmcm9tICcuL2FjdGlvbnMvbGVhcm4nO1xyXG5MZWFybi5pbml0KCk7XHJcbkxlYXJuLnJlY291bnRJbmRleExlYXJuKCk7XHJcbkxlYXJuLnNob3dXb3JkKCk7XHJcblxyXG5pbXBvcnQge1JlcGVhdH0gZnJvbSAnLi9hY3Rpb25zL3JlcGVhdCc7XHJcblJlcGVhdC5pbml0KCk7XHJcblJlcGVhdC5yZWNvdW50SW5kZXhSZXBlYXQoKTtcclxuUmVwZWF0LnNob3dXb3JkKCk7XHJcblxyXG5pZiAoJ2RldmVsb3BtZW50JyA9PT0gTk9ERV9FTlYpIHtcclxuICBjb25zb2xlLmxvZyhgZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnQgJHtOT0RFX0VOVn1gKTtcclxufVxyXG4vLyByZWFkIHNldHRpbmdzXHJcblNldHRpbmdzLmdldFNldHRpbmdzKCk7XHJcblxyXG4vLyBzZXQgdXNlciBzYXZlZCBsb2NhbFxyXG5pZiAobG9jYWwuY3VycmVudExvY2FsICE9PSAkKCdbZGF0YS10eXBlPWxhbmctc2VsZWN0XS5zZWxlY3RlZCcpLmRhdGEoJ2xhbmcnKSkge1xyXG5cdCQoYFtkYXRhLWxhbmc9JHtsb2NhbC5jdXJyZW50TG9jYWx9XWApLmNsaWNrKCk7XHJcbn07XHJcblxyXG5VdGlscy5jbG9zZU1vYk1lbnUoKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL21haW4uanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gbG9jYWxzdG9yYWdlLmpzXHJcbiAqIGNvZGVkIGJ5IEFuYXRvbCBNYXJlemhhbnlpIGFrYSBlMXIwbmQvL1tDUkddIC0gTWFyY2ggMjAxNFxyXG4gKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gYS5tZXJlemhhbnlAZ21haWwuY29tXHJcbiAqXHJcbiAqIFVwZGF0ZWQgYnkgSGFubmVzIEhpcnplbCwgTm92ZW1iZXIgMjAxNlxyXG4gKlxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMV0NsYXNzIHtcclxuIGNvbnN0cnVjdG9yKGRiTmFtZSkge1xyXG4gICB0aGlzLmlzT0sgPSBmYWxzZTtcclxuICAgaWYgKCF0aGlzLmlzTG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkpIHtcclxuICAgICBhbGVydCgnTG9jYWwgU3RvcmFnZSBpcyBub3QgYXZhaWxhYmxlLicpO1xyXG4gICAgIHJldHVybiBmYWxzZTtcclxuICAgfTtcclxuICAgdGhpcy5uYW1lID0gZGJOYW1lO1xyXG4gICAvLyBnZXQgaW5kZXhcclxuICAgdGhpcy5pbmRleCA9IFtdO1xyXG4gICBjb25zdCBzdHJJbmRleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMubmFtZX0td29yZHNgKTtcclxuICAgaWYgKHN0ckluZGV4KSB7XHJcbiAgICAgdGhpcy5pbmRleCA9IHN0ckluZGV4LnNwbGl0KCcsJyk7XHJcbiAgIH07XHJcbiAgIHRoaXMuaXNPSyA9IHRydWU7XHJcbiB9XHJcblxyXG4gaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSB7XHJcbiAgIHRyeSB7XHJcbiAgICAgcmV0dXJuIHdpbmRvdyAmJiB3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG4gICB9IGNhdGNoIChlKSB7XHJcbiAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICB9XHJcbiB9XHJcblxyXG4gcmVhZEl0ZW0oa2V5KSB7XHJcbiAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgfVxyXG4gfVxyXG5cclxuIHJlbW92ZUl0ZW0oa2V5KSB7XHJcbiAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG4gICB9XHJcbiB9XHJcblxyXG4gc3RvcmVJdGVtKGtleSwgdmFsdWUpIHtcclxuICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgIHRyeSB7XHJcbiAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XHJcbiAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgaWYgKGUgPT09IFFVT1RBX0VYQ0VFREVEX0VSUikge1xyXG4gICAgICAgICBhbGVydCgnTG9jYWwgU3RvcmFnZSBpcyBmdWxsJyk7XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgfVxyXG4gICB9XHJcbiB9XHJcblxyXG4gcHV0U2V0dGluZ3ModGhlU2V0dGluZ3NPYmopIHtcclxuICAgdGhpcy5zdG9yZUl0ZW0oYCR7dGhpcy5uYW1lfS13b3Jkcy1zZXR0aW5nc2AsIHRoZVNldHRpbmdzT2JqKTtcclxuIH1cclxuXHJcbiBnZXRTZXR0aW5ncygpIHtcclxuXHJcbiAgIGxldCBzZXR0aW5ncyA9IHRoaXMucmVhZEl0ZW0oYCR7dGhpcy5uYW1lfS13b3Jkcy1zZXR0aW5nc2ApO1xyXG4gICBpZiAoIXNldHRpbmdzKSB7XHJcbiAgICAgLy8gdGhlIGFwcCBydW5zIGZvciB0aGUgZmlyc3QgdGltZSwgdGh1c1xyXG4gICAgIC8vIGluaXRpYWxpemUgdGhlIHNldHRpbmcgb2JqZWN0IG5lZWVkcyB0byBiZSBpbml0aWFsaXplZFxyXG4gICAgIC8vIHdpdGggZGVmYXVsdCB2YWx1ZXMuXHJcblxyXG4gICAgIC8vIGZpcnN0IGlzIGZvciBib3ggKG9yIHN0ZXApIDEgaW4gdGhlIExlaXRuZXIgYm94O1xyXG4gICAgIC8vICAgICAgIGFzayB0aGUgd29yZCBhZ2FpbiBhZnRlciAxIGRheVxyXG4gICAgIC8vIHNlY29uZCBpcyBmb3IgYm94IDIgOyBhc2sgdGhlIHdvcmQgYWdhaW4gYWZ0ZXIgMyBkYXlzXHJcbiAgICAgLy8gdGhpcmQgaXMgZm9yIGJveCAzIDsgYXNrIHRoZSB3b3JkIGFnYWluIGFmdGVyIDcgZGF5c1xyXG5cclxuICAgICAvLyBOb3RlOiBib3ggMCBpcyBmb3IgdGhlIExlYXJuIG1vZGUgYW5kIGl0IG5vdCBzZXRcclxuICAgICAvLyBhcyB0aGUgd29yZHMgYXJlIGFjY2Vzc2libGUgYWxsIHRoZSB0aW1lXHJcbiAgICAgY29uc29sZS5sb2coJ2luaXRpYWxpemUgc2V0dGluZ3MnKTtcclxuICAgICBzZXR0aW5ncyA9IHtcclxuICAgICAgIGZpcnN0OiAxLFxyXG4gICAgICAgc2Vjb25kOiAzLFxyXG4gICAgICAgdGhpcmQ6IDdcclxuICAgICB9O1xyXG4gICAgIHRoaXMuc3RvcmVJdGVtKGAke3RoaXMubmFtZX0tc2V0dGluZ3NgLCBzZXR0aW5ncyk7XHJcbiAgICAgdGhpcy5zdG9yZUl0ZW0oYCR7dGhpcy5uYW1lfS1sYW5ndWFnZWAsICdlbl9HQicpO1xyXG5cclxuICAgfTtcclxuXHJcbiAgIHJldHVybiBzZXR0aW5ncztcclxuIH1cclxuXHJcbiBsb2FkV29yZHModGhlV29yZHMpIHtcclxuICAgbGV0IGkgPSAwO1xyXG4gICBjb25zdCBhcnJheU9mS2V5cyA9IFtdO1xyXG4gICBjb25zdCBzdG9yZUVhY2hFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICBlbGVtZW50LmluZGV4ID0gYGluZGV4JHsrK2l9YDtcclxuICAgICBlbGVtZW50LnN0ZXAgPSBlbGVtZW50LmRhdGUgPSAwO1xyXG4gICAgIHRoaXMuc3RvcmVJdGVtKGAke3RoaXMubmFtZX0tJHtlbGVtZW50LmluZGV4fWAsIGVsZW1lbnQpO1xyXG4gICAgIGFycmF5T2ZLZXlzLnB1c2goZWxlbWVudC5pbmRleCk7XHJcbiAgIH07XHJcblxyXG4gICB0aGVXb3Jkcy5mb3JFYWNoKHN0b3JlRWFjaEVsZW1lbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICB0aGlzLnN0b3JlSXRlbShgJHt0aGlzLm5hbWV9LXdvcmRzYCwgYXJyYXlPZktleXMuam9pbigpKTtcclxuICAgdGhpcy5pbmRleCA9IGFycmF5T2ZLZXlzO1xyXG5cclxuICAgY29uc29sZS5sb2coYCR7YXJyYXlPZktleXMubGVuZ3RofSB3b3JkcyBoYXZlIGJlZW4gbG9hZGVkYCk7XHJcbiB9XHJcblxyXG4gaXNFbXB0eSgvKmtleSovKSB7XHJcbiAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICByZXR1cm4gKCF0aGlzLmluZGV4Lmxlbmd0aCkgPyB0cnVlIDogZmFsc2U7XHJcbiAgIH1cclxuIH1cclxuXHJcbiBkdW1wV29yZHMoLyphS2V5UHJlZml4Ki8pIHtcclxuICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgIGxldCBrZXk7XHJcbiAgICAgbGV0IHN0clZhbHVlO1xyXG4gICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICBjb25zdCBwcmVmaXhGb3JOdW1iZXIgPSBgJHt0aGlzLm5hbWV9LWluZGV4YDtcclxuXHJcbiAgICAgLy8gZ28gdGhyb3VnaCBhbGwga2V5cyBzdGFydGluZyB3aXRoIHRoZSBuYW1lXHJcbiAgICAgLy8gb2YgdGhlIGRhdGFiYXNlLCBpLmUgJ2xlYXJuV29yZHMtaW5kZXgxNCdcclxuICAgICAvLyBjb2xsZWN0IHRoZSBtYXRjaGluZyBvYmplY3RzIGludG8gYXJyXHJcbiAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgIGtleSA9IGxvY2FsU3RvcmFnZS5rZXkoaSk7XHJcbiAgICAgICBzdHJWYWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblxyXG4gICAgICAgaWYgKDAgPT09IGtleS5sYXN0SW5kZXhPZihwcmVmaXhGb3JOdW1iZXIsIDApKSB7XHJcbiAgICAgICAgIHJlc3VsdC5wdXNoKEpTT04ucGFyc2Uoc3RyVmFsdWUpKTtcclxuICAgICAgIH07XHJcbiAgICAgfVxyXG5cclxuICAgICAvLyBEdW1wIHRoZSBhcnJheSBhcyBKU09OIGNvZGUgKGZvciBzZWxlY3QgYWxsIC8gY29weSlcclxuICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgfVxyXG4gfVxyXG5cclxuIHJlbW92ZU9iamVjdHMoYUtleVByZWZpeCkge1xyXG4gICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgbGV0IGtleTtcclxuICAgICAvLyB2YXIgc3Q7XHJcbiAgICAgY29uc3Qga2V5c1RvRGVsZXRlID0gW107XHJcblxyXG4gICAgIC8vIGdvIHRocm91Z2ggYWxsIGtleXMgc3RhcnRpbmcgd2l0aCB0aGUgbmFtZVxyXG4gICAgIC8vIG9mIHRoZSBkYXRhYmFzZSwgaS5lICdsZWFybldvcmRzLWluZGV4MTQnXHJcbiAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgIGtleSA9IGxvY2FsU3RvcmFnZS5rZXkoaSk7XHJcbiAgICAgICBzdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblxyXG4gICAgICAgaWYgKDAgPT09IGtleS5sYXN0SW5kZXhPZihhS2V5UHJlZml4LCAwKSkge1xyXG4gICAgICAgICBrZXlzVG9EZWxldGUucHVzaChrZXkpO1xyXG4gICAgICAgfTtcclxuICAgICB9O1xyXG4gICAgIC8vIG5vdyB3ZSBoYXZlIGFsbCB0aGUga2V5cyB3aGljaCBzaG91bGQgYmUgZGVsZXRlZFxyXG4gICAgIC8vIGluIHRoZSBhcnJheSBrZXlzVG9EZWxldGUuXHJcbiAgICAgY29uc29sZS5sb2coa2V5c1RvRGVsZXRlKTtcclxuICAgICBrZXlzVG9EZWxldGUuZm9yRWFjaChhS2V5ID0+IHtcclxuICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGFLZXkpO1xyXG4gICAgIH0pO1xyXG4gICB9XHJcbiB9XHJcblxyXG4gcmVtb3ZlV29yZHMoKSB7XHJcbiAgIGNvbnN0IGFLZXlQcmVmaXggPSBgJHt0aGlzLm5hbWV9LWluZGV4YDtcclxuXHJcbiAgIHRoaXMucmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KTtcclxuICAgLy8gcmVzZXQgaW5kZXhcclxuICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dGhpcy5uYW1lfS13b3Jkc2AsICcnKTtcclxuICAgLy8gdGhpcyBvbmUgdHJpZ2dlcnMgdGhhdCBtZW1vcnlzdG9yZSBpcyBleGVjdXRlZFxyXG4gICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShgJHt0aGlzLm5hbWV9LXNldHRpbmdzYCk7XHJcbiB9XHJcblxyXG4gZGVzdHJveSgpIHtcclxuICAgY29uc3QgYUtleVByZWZpeCA9IHRoaXMubmFtZTtcclxuXHJcbiAgIHRoaXMucmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KTtcclxuIH1cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL3V0aWxzL0xXLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gc2V0dGluZ3MuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiAqXHJcbiAqIFVwZGF0ZWQgYnkgSGFubmVzIEhpcnplbCwgTm92ZW1iZXIgMjAxNlxyXG4gKlxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuLi8uLi9qcy91dGlscy9MVyc7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzQ2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pbnB1dEZpcnN0Q2hlY2sgPSAkKCcjaW5wdXRGaXJzdENoZWNrJyk7XHJcbiAgICB0aGlzLmlucHV0U2Vjb25kQ2hlY2sgPSAkKCcjaW5wdXRTZWNvbmRDaGVjaycpO1xyXG4gICAgdGhpcy5pbnB1dFRoaXJkQ2hlY2sgPSAkKCcjaW5wdXRUaGlyZENoZWNrJyk7XHJcbiAgICB0aGlzLnNldHRpbmdGcm9tID0gJCgnI3NldHRpbmdGcm9tJyk7XHJcbiAgICB0aGlzLmVycm9yU2V0dGluZ3MgPSAkKCcjZXJyb3JTZXR0aW5ncycpO1xyXG5cclxuICAgIHRoaXMucGFyYW1zID0ge307XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI3NhdmVTZXR0aW5ncycsIHRoaXMuc2F2ZVNldHRpbmcpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI2NhbmNlbFNldHRpbmdzJywgdGhpcy5jYW5jZWxTZXR0aW5nKTtcclxuICB9XHJcbiAgZ2V0U2V0dGluZ3MoKSB7IC8vcmVhZCBzZXR0aW5nJ3MgdmFsdWVzXHJcbiAgICBjb25zdCBzdG9yZWRTZXR0aW5ncyA9IExXLmdldFNldHRpbmdzKCk7XHJcblxyXG4gICAgJCh0aGlzLmlucHV0Rmlyc3RDaGVjaykudmFsKHN0b3JlZFNldHRpbmdzLmZpcnN0KTtcclxuICAgICQodGhpcy5pbnB1dFNlY29uZENoZWNrKS52YWwoc3RvcmVkU2V0dGluZ3Muc2Vjb25kKTtcclxuICAgICQodGhpcy5pbnB1dFRoaXJkQ2hlY2spLnZhbChzdG9yZWRTZXR0aW5ncy50aGlyZCk7XHJcblxyXG4gICAgdGhpcy5wYXJhbXMgPSBzdG9yZWRTZXR0aW5nczsgLy9zdG9yZSBsb2NhbFxyXG4gIH1cclxuXHJcbiAgc2F2ZVNldHRpbmcoKSB7XHJcbiAgICAvL3NhdmUgc2V0dGluZydzIHZhbHVlcyB0byBEQlxyXG4gICAgY29uc3QgZmlyc3QgPSAkKHRoaXMuaW5wdXRGaXJzdENoZWNrKS52YWwoKS50cmltKCk7XHJcblxyXG4gICAgY29uc3Qgc2Vjb25kID0gJCh0aGlzLmlucHV0U2Vjb25kQ2hlY2spLnZhbCgpLnRyaW0oKTtcclxuICAgIGNvbnN0IHRoaXJkID0gJCh0aGlzLmlucHV0VGhpcmRDaGVjaykudmFsKCkudHJpbSgpO1xyXG4gICAgY29uc3QgZm9ybSA9ICQodGhpcy5zZXR0aW5nRnJvbSk7XHJcbiAgICBsZXQgZXJyb3JOYW1lID0gJyc7XHJcbiAgICBsZXQgZXJyb3IgPSBmYWxzZTtcclxuXHJcbiAgICBVdGlscy5jbGVhckZpZWxkcygpO1xyXG4gICAgLy9jaGVjayBmb3IgZW1wdHkgZmllbGRzXHJcbiAgICBpZiAoIWZpcnN0KSB7XHJcbiAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykpO1xyXG4gICAgICBlcnJvck5hbWUgPSAnZW1wdHknO1xyXG4gICAgfSBlbHNlIGlmICghc2Vjb25kKSB7XHJcbiAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykpO1xyXG4gICAgICBlcnJvck5hbWUgPSAnZW1wdHknO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcmQpIHtcclxuICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKSk7XHJcbiAgICAgIGVycm9yTmFtZSA9ICdlbXB0eSc7XHJcbiAgICB9IGVsc2UgeyAvL29ubHkgZGlnaXRzIGlzIHZhbGlkXHJcbiAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIoZmlyc3QpKSB7XHJcbiAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKSk7XHJcbiAgICAgICAgZXJyb3JOYW1lID0gJ251bWJlcic7XHJcbiAgICAgIH07XHJcbiAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIoc2Vjb25kKSkge1xyXG4gICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykpO1xyXG4gICAgICAgIGVycm9yTmFtZSA9ICdudW1iZXInO1xyXG4gICAgICB9O1xyXG4gICAgICBpZiAoIVV0aWxzLmlzTnVtYmVyKHRoaXJkKSkge1xyXG4gICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykpO1xyXG4gICAgICAgIGVycm9yTmFtZSA9ICdudW1iZXInO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgaWYgKGVycm9yKSB7IC8vc2hvdyBlcnJvciBpZiBhbnlcclxuICAgICAgY29uc3QgZXJyb3JUeHQgPSAoJ2VtcHR5JyA9PT0gZXJyb3JOYW1lKSA/IGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JFbXB0eSA6IGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JWYWxpZDtcclxuICAgICAgJCh0aGlzLmVycm9yU2V0dGluZ3MpLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKS50ZXh0KGVycm9yVHh0KTtcclxuICAgIH0gZWxzZSB7IC8vb3RoZXJ3aXNlIHNhdmUgbmV3IHNldHRpbmdzXHJcbiAgICAgIHNldHRpbmdzID0ge1xyXG4gICAgICAgIGZpcnN0LFxyXG4gICAgICAgIHNlY29uZCxcclxuICAgICAgICB0aGlyZFxyXG4gICAgICB9O1xyXG4gICAgICBMVy5wdXRTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgICAgICQodGhpcy5lcnJvclNldHRpbmdzKS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5JykudGV4dChsb2NhbFtsb2NhbC5jdXJyZW50TG9jYWxdLmVycm9yTm8pO1xyXG5cclxuICAgICAgdGhpcy5wYXJhbXMgPSBzZXR0aW5nczsgLy9zdG9yZSBsb2NhbFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgICBjYW5jZWxTZXR0aW5nKCkge1xyXG4gICAgICBVdGlscy5jbGVhckZpZWxkcygpO1xyXG4gICAgICB0aGlzLmdldFNldHRpbmdzKCk7XHJcbiAgICB9XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmdzLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIHV0aWxzLmpzXHJcbiAqIGNvZGVkIGJ5IEFuYXRvbGlpIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBlMXIwbmQuY3JnQGdtYWlsLmNvbVxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbnZhciBVdGlscyA9IHt9O1xyXG5cclxuVXRpbHMgPSB7XHJcbiAgaXNOdW1iZXIoc3RyLCB3aXRoRG90KSB7XHJcbiAgICAvL3ZhbGlkYXRlIGZpbGVkIGZvciBudW1iZXIgdmFsdWVcclxuICAgIGNvbnN0IE51bWJlclJlZyA9IC9eXFxkKyQvO1xyXG4gICAgY29uc3QgTnVtYmVyV2l0aERvdFJlZyA9IC9eWy0rXT9bMC05XSpcXC4/WzAtOV0rJC87XHJcblxyXG4gICAgcmV0dXJuIHdpdGhEb3QgPyBOdW1iZXJXaXRoRG90UmVnLnRlc3Qoc3RyKSA6IE51bWJlclJlZy50ZXN0KHN0cik7XHJcbiAgfSxcclxuXHJcbiAgY2xlYXJGaWVsZHMoKSB7XHJcbiAgICAkKCcuZm9ybS1ncm91cCcpLmVhY2goKGksIG5vZGUpID0+IHsgLy9jbGVhciBhbGwgZXJyb3Igc3R5bGVzXHJcbiAgICAgICQobm9kZSkucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjZXJyb3JTZXR0aW5ncycpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICB9LFxyXG5cclxuICBzZXRGaWVsZEVycm9yKHNlbGYpIHsgLy9zZXQgdGhlIGVycm9yIHN0eWxlIGZvciB0aGUgY3VycmVudCBpbnB1dCBmaWVsZFxyXG4gICAgJChzZWxmKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9LFxyXG5cclxuICBnZXRSYW5kb21JbnQobWluLCBtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gIH0sXHJcblxyXG4gIGdldFRvZGF5KGZ1bGxEYXRlKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgIGlmIChmdWxsRGF0ZSkge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUoKS52YWx1ZU9mKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpKS52YWx1ZU9mKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY2xvc2VNb2JNZW51KCkge1xyXG4gICAgaWYgKCQoJyNicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xJykuaGFzQ2xhc3MoJ2luJykpIHtcclxuICAgICAgJCgnI25hdmJhclRvZ2dsZScpLmNsaWNrKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgc2h1ZmZsZShhKSB7XHJcbiAgICBsZXQgajtcclxuICAgIGxldCB4O1xyXG4gICAgbGV0IGk7XHJcbiAgICBmb3IgKGkgPSBhLmxlbmd0aDsgaTsgaS0tKSB7XHJcbiAgICAgIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKTtcclxuICAgICAgeCA9IGFbaSAtIDFdO1xyXG4gICAgICBhW2kgLSAxXSA9IGFbal07XHJcbiAgICAgIGFbal0gPSB4O1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAhPSBudWxsKSB7XHJcbiAgICBleHBvcnRzLlV0aWxzID0gVXRpbHM7XHJcbn1cclxuXHJcbmV4cG9ydCB7VXRpbHN9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvdXRpbHMvdXRpbHMuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gbWVtb3J5c3RvcmUuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBKYW51YXJ5IDIwMTdcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuZXhwb3J0IGNvbnN0IE1lbW9yeXN0b3JlID0gW1xyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDEnLFxyXG4gICAgJ3dvcmQnOiAnZGFzIEF1dG8nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdjYXInLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgyJyxcclxuICAgICd3b3JkJzogJ2xhdWZlbicsXHJcbiAgICAndHJhbnNsYXRlJzogJ3J1bicsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDMnLFxyXG4gICAgJ3dvcmQnOiAnYWx0JyxcclxuICAgICd0cmFuc2xhdGUnOiAnb2xkJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4NCcsXHJcbiAgICAnd29yZCc6ICdrcmFuaycsXHJcbiAgICAndHJhbnNsYXRlJzogJ3NpY2snLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSwge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4NScsXHJcbiAgICAnd29yZCc6ICdoZXV0ZScsXHJcbiAgICAndHJhbnNsYXRlJzogJ3RvZGF5JyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sIHtcclxuICAgICdpbmRleCc6ICdpbmRleDYnLFxyXG4gICAgJ3dvcmQnOiAnc2NocmVpYmVuJyxcclxuICAgICd0cmFuc2xhdGUnOiAnd3JpdGUnLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSwge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4NycsXHJcbiAgICAnd29yZCc6ICdoZWxsJyxcclxuICAgICd0cmFuc2xhdGUnOiAnbGlnaHQnLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg4JyxcclxuICAgICd3b3JkJzogJ3JlaWNoJyxcclxuICAgICd0cmFuc2xhdGUnOiAncmljaCcsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDknLFxyXG4gICAgJ3dvcmQnOiAnc8O8w58nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdzd2VldCcsXHJcbiAgICAnc3RlcCc6IDEsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDEwJyxcclxuICAgICd3b3JkJzogJ3dlaWJsaWNoJyxcclxuICAgICd0cmFuc2xhdGUnOiAnZmVtYWxlJyxcclxuICAgICdzdGVwJzogMSxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sIHtcclxuICAgICdpbmRleCc6ICdpbmRleDExJyxcclxuICAgICd3b3JkJzogJ2Jlc3RlbGxlbicsXHJcbiAgICAndHJhbnNsYXRlJzogJ29yZGVyJyxcclxuICAgICdzdGVwJzogMSxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MTInLFxyXG4gICAgJ3dvcmQnOiAna2FsdCcsXHJcbiAgICAndHJhbnNsYXRlJzogJ2NvbGQnLFxyXG4gICAgJ3N0ZXAnOiAyLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgxMycsXHJcbiAgICAnd29yZCc6ICdzYXVlcicsXHJcbiAgICAndHJhbnNsYXRlJzogJ3NvdXInLFxyXG4gICAgJ3N0ZXAnOiAyLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgxNCcsXHJcbiAgICAnd29yZCc6ICdmbGllZ2VuJyxcclxuICAgICd0cmFuc2xhdGUnOiAnZmx5JyxcclxuICAgICdzdGVwJzogMyxcclxuICAgICdkYXRlJzogMFxyXG4gIH1cclxuXTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL3V0aWxzL21lbW9yeXN0b3JlLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIG5hdmlnYXRpb24uanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnO1xyXG5sZXQgTmF2aWdhdGlvbiA9IHt9O1xyXG5cclxuTmF2aWdhdGlvbiA9IHtcclxuICBoYXNoZ3VhcmQoaW5pdCkgeyAvL29uSGFzaENoYW5nZVxyXG4gICAgaWYgKGluaXQpIHtcclxuICAgICAgdGhpcy5oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5oYXNoICE9PSB3aW5kb3cubG9jYXRpb24uaGFzaCkge1xyXG4gICAgICAkKHdpbmRvdykudHJpZ2dlcignaGFzaGJyZWFrJywge1xyXG4gICAgICAgICdwcmV2aGFzaCc6IHRoaXMuaGFzaFxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KHRoaXMuaGFzaGd1YXJkLmJpbmQodGhpcyksIDUwKTtcclxuICB9LFxyXG5cclxuICBoYXNoYnJlYWsoKSB7IC8vaGFzaGNoYW5nZSBldmVudFxyXG4gICAgY29uc3QgaGFzaFVybCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDMpO1xyXG5cclxuICAgIGlmIChoYXNoVXJsKSB7XHJcbiAgICAgICQoYFtkYXRhLXRhcmdldD0ke3dpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDMpfV1gKS5jbGljaygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnW2RhdGEtdGFyZ2V0PXN1bW1hcnldJykuY2xpY2soKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBuYXZTZWxlY3QoKSB7XHJcbiAgICAkKCdbZGF0YS10b2dnbGU9bmF2XScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH0pO1xyXG4gICAgJCgnW2RhdGEtdHlwZT1uYXYtc2VsZWN0LWxpXScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKGAjJHskKHRoaXMpLmRhdGEoJ3RhcmdldCcpfWApLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIFV0aWxzLmNsb3NlTW9iTWVudSgpO1xyXG4gIH0sXHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICdbZGF0YS10eXBlPW5hdi1zZWxlY3RdJywgdGhpcy5uYXZTZWxlY3QpO1xyXG4gICAgJCh3aW5kb3cpLmJpbmQoJ2hhc2hicmVhaycsIHRoaXMuaGFzaGJyZWFrKTtcclxuICAgIHRoaXMuaGFzaGd1YXJkKGZhbHNlKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQge05hdmlnYXRpb259O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvdXRpbHMvbmF2aWdhdGlvbi5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyBsb2NhbC5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuaW1wb3J0IExXQ2xhc3MgZnJvbSAnLi4vdXRpbHMvTFcnO1xyXG5jb25zdCBMVyA9IG5ldyBMV0NsYXNzKCdMV2RiJyk7XHJcblxyXG5jb25zb2xlLmxvZygnZGVmaW5lIGxvY2FsJyk7XHJcbmNvbnN0IGxvY2FsID0ge1xyXG4gIGVuX0dCOiB7XHJcbiAgICBzdW1tYXJ5OiAnU3VtbWFyeScsXHJcbiAgICBsZWFybjogJ0xlYXJuJyxcclxuICAgIHJlcGVhdDogJ1JlcGVhdCcsXHJcbiAgICB2b2NhYnVsYXJ5OiAnVm9jYWJ1bGFyeScsXHJcbiAgICBzZXR0aW5nczogJ1NldHRpbmdzJyxcclxuICAgIGVkaXRXb3JkczogJ0VkaXQgd29yZHMnLFxyXG4gICAgZmlyc3Q6ICdGaXJzdCcsXHJcbiAgICBzZWNvbmQ6ICdTZWNvbmQnLFxyXG4gICAgdGhpcmQ6ICdUaGlyZCcsXHJcbiAgICBzYXZlQnRuOiAnU2F2ZScsXHJcbiAgICBjYW5jZWxCdG46ICdDYW5jZWwnLFxyXG4gICAgbGFuZ3VhZ2U6ICdMYW5ndWFnZScsXHJcbiAgICBlbl9HQjogJ2VuZ2xpc2gnLFxyXG4gICAgZGVfREU6ICdkZXV0c2NoJyxcclxuICAgIHJ1X1JVOiAn0YDRg9GB0YHQutC40LknLFxyXG4gICAgZXJyb3JFbXB0eTogJ0FsbCBmaWVsZHMgYXJlIHJlcXVpcmVkLicsXHJcbiAgICBlcnJvclZhbGlkOiAnRW50ZXJlZCB2YWx1ZXMgYXJlIGluY29ycmVjdC4nLFxyXG4gICAgZXJyb3JObzogJ05ldyBzZXR0aW5ncyB3YXMgc2F2ZWQuJyxcclxuICAgIGVycm9yTm9XOiAnTmV3IHdvcmQgd2FzIGFkZGVkLicsXHJcbiAgICB0b3RhbFdvcmRzOiAnVG90YWwgd29yZHMnLFxyXG4gICAgbGVhcm5Xb3Jkc051bTogJ1dvcmRzIHRvIGxlYXJuJyxcclxuICAgIHJlcGVhdFdvcmRzOiAnV29yZHMgdG8gcmVwZWF0JyxcclxuICAgIHJlbWVtYmVyQnRuOiAnUmVtZW1iZXInLFxyXG4gICAgcmVwZWF0QnRuOiAnUmVwZWF0JyxcclxuICAgIGtub3duQnRuOiAnS25vdycsXHJcbiAgICBhbGxXb3Jkc09rOiAnTm8gbW9yZSB3b3JkcyBmb3IgbGVhcm5pbmcuJyxcclxuICAgIGlucHV0V29yZExibDogJ1dvcmQnLFxyXG4gICAgaW5wdXRUcmFuc2xhdGVMYmw6ICdUcmFuc2xhdGUnLFxyXG4gICAgZW50ZXJCdG46ICdDaGVjaycsXHJcbiAgICBhbGxXb3Jkc0RvbmU6ICdObyBtb3JlIHdvcmRzIGZvciByZXBlYXQuJ1xyXG4gIH0sXHJcblxyXG4gIHJ1X1JVOiB7XHJcbiAgICBzdW1tYXJ5OiAn0KHQstC+0LTQutCwJyxcclxuICAgIGxlYXJuOiAn0KPRh9C40YLRjCcsXHJcbiAgICByZXBlYXQ6ICfQn9C+0LLRgtC+0YDRj9GC0YwnLFxyXG4gICAgdm9jYWJ1bGFyeTogJ9Ch0LvQvtCy0LDRgNGMJyxcclxuICAgIHNldHRpbmdzOiAn0J3QsNGB0YLRgNC+0LnQutC4JyxcclxuICAgIGVkaXRXb3JkczogJ9Cg0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMINGB0LvQvtCy0LAnLFxyXG4gICAgZmlyc3Q6ICfQn9C10YDQstGL0LknLFxyXG4gICAgc2Vjb25kOiAn0JLRgtC+0YDQvtC5JyxcclxuICAgIHRoaXJkOiAn0KLRgNC10YLQuNC5JyxcclxuICAgIHNhdmVCdG46ICfQodC+0YXRgNCw0L3QuNGC0YwnLFxyXG4gICAgY2FuY2VsQnRuOiAn0J7RgtC80LXQvdC40YLRjCcsXHJcbiAgICBsYW5ndWFnZTogJ9Cv0LfRi9C6JyxcclxuICAgIGVuX0dCOiAnZW5nbGlzaCcsXHJcbiAgICBkZV9ERTogJ2RldXRzY2gnLFxyXG4gICAgcnVfUlU6ICfRgNGD0YHRgdC60LjQuScsXHJcbiAgICBlcnJvckVtcHR5OiAn0JLRgdC1INC/0L7Qu9GPINC+0LHRj9C30LDRgtC10LvRjNC90YsuJyxcclxuICAgIGVycm9yVmFsaWQ6ICfQktCy0LXQtNC10L3QvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQvdC10LLQsNC70LjQtNC90YsuJyxcclxuICAgIGVycm9yTm86ICfQndC+0LLRi9C1INC30L3QsNGH0LXQvdC40LUg0LHRi9C70Lgg0LfQsNC/0LjRgdCw0L3Riy4nLFxyXG4gICAgZXJyb3JOb1c6ICfQndC+0LLQvtC1INGB0LvQvtCy0L4g0LTQvtCx0LDQstC70LXQvdC+LicsXHJcbiAgICB0b3RhbFdvcmRzOiAn0JLRgdC10LPQviDRgdC70L7QsicsXHJcbiAgICBsZWFybldvcmRzTnVtOiAn0KHQu9C+0LIg0YPRh9C40YLRjCcsXHJcbiAgICByZXBlYXRXb3JkczogJ9Ch0LXQs9C+0LTQvdGPINC/0L7RgtC+0YDQuNGC0Ywg0YHQu9C+0LInLFxyXG4gICAgcmVtZW1iZXJCdG46ICfQl9Cw0L/QvtC80L3QuNC7JyxcclxuICAgIHJlcGVhdEJ0bjogJ9Cf0L7QstGC0L7RgNC40YLRjCcsXHJcbiAgICBrbm93bkJ0bjogJ9CX0L3QsNGOJyxcclxuICAgIGFsbFdvcmRzT2s6ICfQndC10YIg0LHQvtC70YzRiNC1INGB0LvQvtCyINC00LvRjyDQuNC30YPRh9C10L3QuNGPLicsXHJcbiAgICBpbnB1dFdvcmRMYmw6ICfQodC70L7QstC+JyxcclxuICAgIGlucHV0VHJhbnNsYXRlTGJsOiAn0J/QtdGA0LXQstC+0LQnLFxyXG4gICAgZW50ZXJCdG46ICfQn9GA0L7QstC10YDQuNGC0YwnLFxyXG4gICAgYWxsV29yZHNEb25lOiAn0J3QtdGCINCx0L7Qu9GM0YjQtSDRgdC70L7QsiDQtNC70Y8g0L/QvtCy0YLQvtGA0LXQvdC40Y8uJ1xyXG4gIH0sXHJcblxyXG4gIGRlX0RFOiB7XHJcbiAgICBzdW1tYXJ5OiAnU3VtbWUnLFxyXG4gICAgbGVhcm46ICdMZXJuZW4nLFxyXG4gICAgcmVwZWF0OiAnV2llZGVyaG9sZW4nLFxyXG4gICAgdm9jYWJ1bGFyeTogJ1Zva2FidWxhcicsXHJcbiAgICBzZXR0aW5nczogJ1JhaG1lbicsXHJcbiAgICBlZGl0V29yZHM6ICdXw7ZydGVyIMOkbmRlcm4nLFxyXG4gICAgZmlyc3Q6ICdFcnN0ZScsXHJcbiAgICBzZWNvbmQ6ICdad2VpdGUnLFxyXG4gICAgdGhpcmQ6ICdEcml0dGUnLFxyXG4gICAgc2F2ZUJ0bjogJ1NwZWljaGVybicsXHJcbiAgICBjYW5jZWxCdG46ICdTdG9ybmllcmVuJyxcclxuICAgIGxhbmd1YWdlOiAnU3ByYWNoZScsXHJcbiAgICBlbl9HQjogJ2VuZ2xpc2gnLFxyXG4gICAgZGVfREU6ICdkZXV0c2NoJyxcclxuICAgIHJ1X1JVOiAn0YDRg9GB0YHQutC40LknLFxyXG4gICAgZXJyb3JFbXB0eTogJ0FsbGUgRmVsZGVyIHNpbmQgZXJmb3JkZXJsaWNoLicsXHJcbiAgICBlcnJvclZhbGlkOiAnRWluZ2VnZWJlbmUgV2VydGUgc2luZCBmYWxzY2guJyxcclxuICAgIGVycm9yTm86ICdOZXVlIEVpbnN0ZWxsdW5nZW4gZ2VzcGVpY2hlcnQgd3VyZGUuJyxcclxuICAgIGVycm9yTm9XOiAnTmV1ZXMgV29ydCBoaW56dWdlZsO8Z3QuJyxcclxuICAgIHRvdGFsV29yZHM6ICdJbnNnZXNhbXQgV29ydGUnLFxyXG4gICAgbGVhcm5Xb3Jkc051bTogJ1fDtnJ0ZXIgenUgbGVybmVuJyxcclxuICAgIHJlcGVhdFdvcmRzOiAnV29ydGUgenUgd2llZGVyaG9sZW4nLFxyXG4gICAgcmVtZW1iZXJCdG46ICdNZXJrZW4nLFxyXG4gICAgcmVwZWF0QnRuOiAnV2llZGVyaG9sZW4nLFxyXG4gICAga25vd25CdG46ICdXaXNzZW4nLFxyXG4gICAgYWxsV29yZHNPazogJ0tlaW5lIFdvcnRlIG1laHIgZsO8ciBkYXMgTGVybmVuLicsXHJcbiAgICBpbnB1dFdvcmRMYmw6ICdXb3J0JyxcclxuICAgIGlucHV0VHJhbnNsYXRlTGJsOiAnw5xiZXJzZXR6ZW4nLFxyXG4gICAgZW50ZXJCdG46ICdQcsO8ZmVuJyxcclxuICAgIGFsbFdvcmRzRG9uZTogJ0tlaW5lIFdvcnRlIG1laHIgZsO8ciB3aWVkZXJob2xlbi4nXHJcbiAgfSxcclxuXHJcbiAgY2hhbmdlTG9jYWxDb250ZW50KCkge1xyXG4gICAgLy8gY2hhbmdlIGlubmVyIGNvbnRlbnRcclxuICAgIGNvbnN0IGxhbmdOb2RlID0gJCgnW2RhdGEtdG9nZ2xlPWxhbmddJyk7XHJcblxyXG4gICAgY29uc3QgbGFuZ1NlbGVjdCA9ICQoJ1tkYXRhLXR5cGU9bGFuZy1zZWxlY3RdJyk7XHJcblxyXG4gICAgJChsYW5nTm9kZSkuZWFjaCgoaSwgbm9kZSkgPT4ge1xyXG4gICAgICAkKG5vZGUpLnRleHQobG9jYWxbbG9jYWwuY3VycmVudExvY2FsXVskKG5vZGUpLmRhdGEoJ2xhbmcnKV0pO1xyXG4gICAgfSk7XHJcbiAgICAkKGxhbmdTZWxlY3QpLmVhY2goKGksIG5vZGUpID0+IHtcclxuICAgICAgJChub2RlKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIGxhbmdTZWxlY3QoKSB7IC8vY2hhbmdlIGxvY2FsaXphdGlvblxyXG4gICAgbG9jYWwuY3VycmVudExvY2FsID0gJCh0aGlzKS5kYXRhKCdsYW5nJyk7XHJcbiAgICAkKCcjbGFuZ1NlbGVjdCcpLmNsaWNrKCk7XHJcbiAgICAkKCcubmF2YmFyLXRvZ2dsZTp2aXNpYmxlJykuY2xpY2soKTtcclxuICAgIGxvY2FsLmNoYW5nZUxvY2FsQ29udGVudCgpO1xyXG4gICAgTFcuc3RvcmVJdGVtKGAke0xXLm5hbWV9LWxhbmd1YWdlYCwgbG9jYWwuY3VycmVudExvY2FsKTtcclxuICAgICQodGhpcykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIC8vIHZhciBzZXR0aW5ncyA9IExXLmdldFNldHRpbmdzKCk7IC8vIHRvIGZvcmNlIGluaXRpYWxpc2F0aW9uLlxyXG4gICAgdGhpcy5jdXJyZW50TG9jYWwgPSBMVy5yZWFkSXRlbShgJHtMVy5uYW1lfS1sYW5ndWFnZWApO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnW2RhdGEtdHlwZT1sYW5nLXNlbGVjdF0nLCBsb2NhbC5sYW5nU2VsZWN0KTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQge2xvY2FsfTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL2xvY2FsL2xvY2FsLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIHZvY2FidWxhcnkuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBlMXIwbmQuY3JnQGdtYWlsLmNvbVxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuLi91dGlscy9MVyc7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi8uLi91dGlscy91dGlscyc7XHJcbmltcG9ydCB7TGVhcm59IGZyb20gJy4vbGVhcm4nO1xyXG5pbXBvcnQge1JlcGVhdH0gZnJvbSAnLi9yZXBlYXQnO1xyXG5cclxuY29uc3QgVm9jYWJ1bGFyeSA9IHtcclxuICByb3dUZW1wbGF0ZTogJzxkaXYgaWQ9XCJ7e25vZGV9fVwiIGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImNvbC1tZC01IGNvbC1zbS01IGNvbC14cy00XCI+e3t0eHR9fTwvZGl2PicgK1xyXG4gICAgJzxkaXYgY2xhc3M9XCJjb2wtbWQtNSBjb2wtc20tNSBjb2wteHMtNFwiPnt7dHJhbnNsYXRlfX08L2Rpdj4nICtcclxuICAgICc8ZGl2IGNsYXNzPVwiY29sLW1kLTIgY29sLXNtLTIgY29sLXhzLTRcIj48YnV0dG9uIGRhdGEtbm9kZT1cInt7bm9kZX19XCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1pbmZvIGpzLWVkaXQtYnRuXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIj48L3NwYW4+PC9idXR0b24+PC9kaXY+JyArXHJcbiAgICAnPC9kaXY+JyArXHJcbiAgICAnPGRpdiBpZD1cInt7bm9kZX19RWRpdFwiIGNsYXNzPVwicm93IG5vZGlzcGxheVwiPjxmb3JtIGlkPVwiZm9ybS17e25vZGV9fVwiIHJvbGU9XCJmb3JtXCI+JyArXHJcbiAgICAnPGRpdiBjbGFzcz1cImNvbC1tZC01IGNvbC1zbS01IGNvbC14cy00XCI+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wLWZsZFwiIGlkPVwid29yZC17e25vZGV9fVwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgd29yZFwiIHZhbHVlPVwie3t0eHR9fVwiPjwvZGl2PicgK1xyXG4gICAgJzxkaXYgY2xhc3M9XCJjb2wtbWQtNSBjb2wtc20tNSBjb2wteHMtNFwiPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucC1mbGRcIiBpZD1cInRyYW5zbGF0ZS17e25vZGV9fVwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgdHJhbnNsYXRlXCIgdmFsdWU9XCJ7e3RyYW5zbGF0ZX19XCI+PC9kaXY+JyArXHJcbiAgICAnPGRpdiBjbGFzcz1cImNvbC1tZC0yIGNvbC1zbS0yIGNvbC14cy00XCI+PGJ1dHRvbiBkYXRhLW5vZGU9XCJ7e25vZGV9fVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyBqcy1zYXZlLWJ0blwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1va1wiPjwvc3Bhbj48L2J1dHRvbj4nICtcclxuICAgICc8YnV0dG9uIGlkPVwiZGVsLXt7bm9kZX19XCIgZGF0YS1ub2RlPVwie3tub2RlfX1cIiBkYXRhLWlkPVwie3tpbmRleH19XCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kYW5nZXIganMtZGVsLWJ0blwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+PC9idXR0b24+JyArXHJcbiAgICAnPC9kaXY+PC9mb3JtPicgK1xyXG4gICAgJzwvZGl2PicsXHJcblxyXG4gIHRvdGFsV29yZHNOdW06ICQoJyN0b3RhbFdvcmRzTnVtJyksXHJcbiAgdm9jYWJ1bGFyeUJveDogJCgnI3ZvY2FidWxhcnlCb3gnKSxcclxuICBlcnJvclZvY2FidWxhcnlCb3g6ICQoJyNlcnJvclZvY2FidWxhcnlCb3gnKSxcclxuICBlcnJvclZvY2FidWxhcnk6ICQoJyNlcnJvclZvY2FidWxhcnknKSxcclxuICBpbnB1dFdvcmRUeHQ6ICQoJyNpbnB1dFdvcmRUeHQnKSxcclxuICBpbnB1dFRyYW5zbGF0ZTogJCgnI2lucHV0VHJhbnNsYXRlJyksXHJcbiAgYWRkV29yZEZvcm06ICQoJyNhZGRXb3JkRm9ybScpLFxyXG5cclxuICB3b3JkczogW10sXHJcbiAgdHJhbnNsYXRlczogW10sXHJcblxyXG4gIHJlY291bnRUb3RhbCgpIHtcclxuICAgICQoVm9jYWJ1bGFyeS50b3RhbFdvcmRzTnVtKS50ZXh0KExXLmluZGV4Lmxlbmd0aCk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlV29yZChzZWxmLCBub3RSZWluZGV4KSB7XHJcbiAgICAvL3JlbW92ZSB3b3JkIGZyb20gdm9jYWJ1bGFyeVxyXG4gICAgY29uc3QgaWQgPSAkKHNlbGYpLmRhdGEoJ2lkJyk7XHJcblxyXG4gICAgY29uc3Qgbm9kZSA9ICQoc2VsZikuZGF0YSgnbm9kZScpO1xyXG5cclxuICAgIGlmICghbm90UmVpbmRleCkge1xyXG4gICAgICBMVy5pbmRleC5zcGxpY2UoaWQsIDEpOyAvL3JlbW92ZSBmcm9tIGluZGV4XHJcbiAgICAgIExXLnN0b3JlSXRlbShgJHtMVy5uYW1lfS13b3Jkc2AsIExXLmluZGV4LmpvaW4oKSk7XHJcbiAgICB9XHJcbiAgICBMVy5yZW1vdmVJdGVtKGAke0xXLm5hbWV9LSR7bm9kZX1gKTsgLy9yZW1vdmUgdGhpcyB3b3JkXHJcbiAgICAkKGAjJHtub2RlfWApLnJlbW92ZSgpO1xyXG4gICAgJChgIyR7bm9kZX1FZGl0YCkucmVtb3ZlKCk7XHJcbiAgICBWb2NhYnVsYXJ5LnJlY291bnRUb3RhbCgpO1xyXG4gICAgTGVhcm4ud29yZHNMZWFybiA9IFtdO1xyXG4gICAgTGVhcm4ucmVjb3VudEluZGV4TGVhcm4oKTtcclxuICAgIFJlcGVhdC53b3Jkc1JlcGVhdCA9IHtcclxuICAgICAgY3VycmVudEluZGV4Rmlyc3Q6IDAsXHJcbiAgICAgIGZpcnN0OiBbXSxcclxuICAgICAgY3VycmVudEluZGV4U2Vjb25kOiAwLFxyXG4gICAgICBzZWNvbmQ6IFtdLFxyXG4gICAgICBjdXJyZW50SW5kZXhUaGlyZDogMCxcclxuICAgICAgdGhpcmQ6IFtdXHJcbiAgICB9O1xyXG4gICAgUmVwZWF0LnJlY291bnRJbmRleFJlcGVhdCgpO1xyXG4gIH0sXHJcblxyXG4gIHZpZXdXb3JkKCkge1xyXG4gICAgbGV0IGNvbnRlbnRJbm5lciA9ICcnO1xyXG5cclxuICAgICQoTFcuaW5kZXgpLmVhY2goKGluZGV4LCBub2RlKSA9PiB7XHJcbiAgICAgIGxldCB0eHQ7XHJcbiAgICAgIGxldCB0cmFuc2xhdGU7XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSBMVy5yZWFkSXRlbShgJHtMVy5uYW1lfS0ke25vZGV9YCk7XHJcbiAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgdHh0ID0gaXRlbS53b3JkO1xyXG4gICAgICAgIHRyYW5zbGF0ZSA9IGl0ZW0udHJhbnNsYXRlO1xyXG5cclxuICAgICAgICBWb2NhYnVsYXJ5LndvcmRzLnB1c2godHh0KTtcclxuICAgICAgICBWb2NhYnVsYXJ5LnRyYW5zbGF0ZXMucHVzaCh0cmFuc2xhdGUpO1xyXG4gICAgICAgIGNvbnRlbnRJbm5lciArPSBWb2NhYnVsYXJ5LnJvd1RlbXBsYXRlLnJlcGxhY2UoL3t7bm9kZX19L2csIG5vZGUpLnJlcGxhY2UoL3t7dHh0fX0vZywgdHh0KS5yZXBsYWNlKC97e3RyYW5zbGF0ZX19L2csIHRyYW5zbGF0ZSkucmVwbGFjZSgve3tpbmRleH19L2csIGluZGV4KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJChWb2NhYnVsYXJ5LnZvY2FidWxhcnlCb3gpLmh0bWwoY29udGVudElubmVyKTtcclxuICAgIFZvY2FidWxhcnkucmVjb3VudFRvdGFsKCk7XHJcbiAgfSxcclxuXHJcbiAgYWRkU2F2ZVdvcmQod29yZFR4dCwgdHJhbnNsYXRlLCBhZGRGb3JtLCBhZGRXb3JkKSB7XHJcbiAgICBjb25zdCBpbnB1dFdvcmQgPSB3b3JkVHh0LnZhbCgpLnRyaW0oKTtcclxuICAgIGNvbnN0IGlucHV0VHJhbnNsYXRlID0gdHJhbnNsYXRlLnZhbCgpLnRyaW0oKTtcclxuICAgIGNvbnN0IGZvcm0gPSBhZGRGb3JtO1xyXG4gICAgbGV0IGVycm9yID0gZmFsc2U7XHJcbiAgICBsZXQgd29yZCA9IHt9O1xyXG5cclxuICAgIFV0aWxzLmNsZWFyRmllbGRzKCk7XHJcbiAgICAvL2NoZWNrIGZvciBlbXB0eSBmaWVsZHNcclxuICAgIGlmICghaW5wdXRXb3JkKSB7XHJcbiAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKSk7XHJcbiAgICB9IGVsc2UgaWYgKCFpbnB1dFRyYW5zbGF0ZSkge1xyXG4gICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykpO1xyXG4gICAgfVxyXG4gICAgaWYgKGVycm9yKSB7IC8vc2hvdyBlcnJvciBpZiBhbnlcclxuICAgICAgJChWb2NhYnVsYXJ5LmVycm9yVm9jYWJ1bGFyeUJveCkucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKFZvY2FidWxhcnkuZXJyb3JWb2NhYnVsYXJ5KS50ZXh0KGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JFbXB0eSk7XHJcbiAgICB9IGVsc2UgeyAvL290aGVyd2lzZSBzYXZlIG5ldyB3b3JkIHRvIFZvY2FidWxhcnlcclxuICAgICAgbGV0IG5ld0luZGV4VmFsO1xyXG4gICAgICBjb25zdCB0b2RheURhdGUgPSBVdGlscy5nZXRUb2RheSh0cnVlKTtcclxuICAgICAgd29yZCA9IHtcclxuICAgICAgICBpbmRleDogdG9kYXlEYXRlLFxyXG4gICAgICAgIHdvcmQ6IGlucHV0V29yZCxcclxuICAgICAgICB0cmFuc2xhdGU6IGlucHV0VHJhbnNsYXRlLFxyXG4gICAgICAgIHN0ZXA6IDAsXHJcbiAgICAgICAgZGF0ZTogMFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gc2F2ZSBuZXdseSBhZGRlZCB3b3JkXHJcbiAgICAgIG5ld0luZGV4VmFsID0gYGluZGV4JHtMVy5pbmRleC5sZW5ndGggKyAxfWA7XHJcbiAgICAgIExXLnN0b3JlSXRlbShgJHtMVy5uYW1lfS0ke25ld0luZGV4VmFsfWAsIHdvcmQpO1xyXG5cclxuICAgICAgY29uc3QgY29udGVudElubmVyID0gVm9jYWJ1bGFyeS5yb3dUZW1wbGF0ZS5yZXBsYWNlKC97e25vZGV9fS9nLCB0b2RheURhdGUpLnJlcGxhY2UoL3t7dHh0fX0vZywgaW5wdXRXb3JkKS5yZXBsYWNlKC97e3RyYW5zbGF0ZX19L2csIGlucHV0VHJhbnNsYXRlKS5yZXBsYWNlKC97e2luZGV4fX0vZywgKGFkZFdvcmQpID8gTFcuaW5kZXgubGVuZ3RoIDogTFcuaW5kZXguaW5kZXhPZihpbnB1dFdvcmQpKTtcclxuXHJcbiAgICAgIGlmIChhZGRXb3JkKSB7XHJcbiAgICAgICAgTFcuaW5kZXgucHVzaChuZXdJbmRleFZhbCk7XHJcbiAgICAgICAgd29yZFR4dC52YWwoJycpO1xyXG4gICAgICAgIHRyYW5zbGF0ZS52YWwoJycpO1xyXG4gICAgICAgICQoVm9jYWJ1bGFyeS5lcnJvclZvY2FidWxhcnlCb3gpLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgICAgICAkKFZvY2FidWxhcnkuZXJyb3JWb2NhYnVsYXJ5KS50ZXh0KGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JOb1cpO1xyXG4gICAgICAgICQoVm9jYWJ1bGFyeS52b2NhYnVsYXJ5Qm94KS5hcHBlbmQoY29udGVudElubmVyKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBpZCA9IHdvcmRUeHQuYXR0cignaWQnKS5zbGljZSg1KTtcclxuXHJcbiAgICAgICAgTFcuaW5kZXhbTFcuaW5kZXguaW5kZXhPZihpZCldID0gbmV3SW5kZXhWYWw7XHJcbiAgICAgICAgJChgIyR7aWR9YCkuYmVmb3JlKGNvbnRlbnRJbm5lcik7XHJcbiAgICAgICAgVm9jYWJ1bGFyeS5yZW1vdmVXb3JkKCQoYCNkZWwtJHtpZH1gKSwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIExXLnN0b3JlSXRlbShgJHtMVy5uYW1lfS13b3Jkc2AsIExXLmluZGV4LmpvaW4oKSk7IC8vYWRkIHdvcmQgdG8gVm9jYWJ1bGFyeSBsaXN0XHJcbiAgICAgIFV0aWxzLmNsZWFyRmllbGRzKCk7XHJcbiAgICAgIFZvY2FidWxhcnkucmVjb3VudFRvdGFsKCk7XHJcbiAgICAgIExlYXJuLndvcmRzTGVhcm4gPSBbXTtcclxuICAgICAgTGVhcm4ucmVjb3VudEluZGV4TGVhcm4oKTtcclxuICAgICAgTGVhcm4uc2hvd1dvcmQoKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbml0KCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI2FkZEJ0bicsICgpID0+IHtcclxuICAgICAgVm9jYWJ1bGFyeS5hZGRTYXZlV29yZCgkKFZvY2FidWxhcnkuaW5wdXRXb3JkVHh0KSwgJChWb2NhYnVsYXJ5LmlucHV0VHJhbnNsYXRlKSwgJChWb2NhYnVsYXJ5LmFkZFdvcmRGb3JtKSwgdHJ1ZSk7XHJcbiAgICB9KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJy5qcy1lZGl0LWJ0bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJChgIyR7JCh0aGlzKS5kYXRhKCdub2RlJyl9YCkuaGlkZSgpO1xyXG4gICAgICAkKGAjJHskKHRoaXMpLmRhdGEoJ25vZGUnKX1FZGl0YCkuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcuanMtc2F2ZS1idG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFZvY2FidWxhcnkuYWRkU2F2ZVdvcmQoJChgI3dvcmQtJHskKHRoaXMpLmRhdGEoJ25vZGUnKX1gKSwgJChgI3RyYW5zbGF0ZS0keyQodGhpcykuZGF0YSgnbm9kZScpfWApLCAkKGAjZm9ybS0keyQodGhpcykuZGF0YSgnbm9kZScpfWApKTtcclxuICAgIH0pO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLmpzLWRlbC1idG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFZvY2FidWxhcnkucmVtb3ZlV29yZCh0aGlzKTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCB7Vm9jYWJ1bGFyeX07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy9hY3Rpb25zL3ZvY2FidWxhcnkuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyBsZWFybi5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICpcclxuICogVXBkYXRlZCBieSBIYW5uZXMgSGlyemVsLCBOb3ZlbWJlciAyMDE2XHJcbiAqXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCBMV0NsYXNzIGZyb20gJy4uL3V0aWxzL0xXJztcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuLy4uL3V0aWxzL3V0aWxzJztcclxuXHJcbmNvbnN0IExlYXJuID0ge1xyXG4gIHdvcmRzTGVhcm46IFtdLFxyXG4gIGN1cnJlbnRJbmRleDogMCxcclxuXHJcbiAgbGVhcm5Xb3Jkc051bTogJCgnI2xlYXJuV29yZHNOdW0nKSxcclxuICBsZWFybldvcmRzVG9wTnVtOiAkKCcjbGVhcm5Xb3Jkc1RvcE51bScpLFxyXG4gIGxlYXJuV29yZHNUb3BTTnVtOiAkKCcjbGVhcm5Xb3Jkc1RvcFNOdW0nKSxcclxuXHJcbiAgbGVhcm5Xb3JkOiAkKCcjbGVhcm5Xb3JkJyksXHJcbiAgdHJhbnNsYXRlV29yZDogJCgnI3RyYW5zbGF0ZVdvcmQnKSxcclxuICBsZWFybldvcmRzR3JwOiAkKCcjbGVhcm5Xb3Jkc0dycCcpLFxyXG4gIG5vV29yZHNMZWZ0OiAkKCcjbm9Xb3Jkc0xlZnQnKSxcclxuICBhbGxXb3Jkc09rOiAkKCcjYWxsV29yZHNPaycpLFxyXG5cclxuICByZWNvdW50SW5kZXhMZWFybigpIHsgLy9jb3VudCB3b3JkcyB0byBsZWFyblxyXG4gICAgaWYgKCFMZWFybi53b3Jkc0xlYXJuLmxlbmd0aCkge1xyXG4gICAgICAkKExXLmluZGV4KS5lYWNoKChpbmRleCwgbm9kZSkgPT4geyAvL3RoZSBpbml0aWFsIGNvdW50aW5nXHJcbiAgICAgICAgY29uc3QgaXRlbSA9IExXLnJlYWRJdGVtKGAke0xXLm5hbWV9LSR7bm9kZX1gKTtcclxuICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgaWYgKDAgPT09IGl0ZW0uc3RlcCkge1xyXG4gICAgICAgICAgICBMZWFybi53b3Jkc0xlYXJuLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdMZWFybiByZWNvdW50SW5kZXhMZWFybicsIExlYXJuLndvcmRzTGVhcm4pO1xyXG4gICAgY29uc3Qgd29yZHNMZWFybkxlbmd0aCA9IChMZWFybi53b3Jkc0xlYXJuLmxlbmd0aCkgPyBMZWFybi53b3Jkc0xlYXJuLmxlbmd0aCA6ICcnO1xyXG5cclxuICAgICQobGVhcm5Xb3Jkc051bSkudGV4dCh3b3Jkc0xlYXJuTGVuZ3RoIHx8ICcwJyk7XHJcbiAgICAkKGxlYXJuV29yZHNUb3BOdW0pLnRleHQod29yZHNMZWFybkxlbmd0aCk7XHJcbiAgICAkKGxlYXJuV29yZHNUb3BTTnVtKS50ZXh0KHdvcmRzTGVhcm5MZW5ndGgpO1xyXG4gIH0sXHJcblxyXG4gIHNob3dXb3JkKCkgeyAvL3Nob3cgYSBuZXh0IHdvcmQgdG8gbGVhcm5cclxuICAgIGlmIChMZWFybi53b3Jkc0xlYXJuLmxlbmd0aCkge1xyXG4gICAgICAkKGxlYXJuV29yZCkudGV4dChMZWFybi53b3Jkc0xlYXJuW0xlYXJuLmN1cnJlbnRJbmRleF0ud29yZCk7XHJcbiAgICAgICQodHJhbnNsYXRlV29yZCkudGV4dChMZWFybi53b3Jkc0xlYXJuW0xlYXJuLmN1cnJlbnRJbmRleF0udHJhbnNsYXRlKTtcclxuICAgICAgJChsZWFybldvcmRzR3JwKS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICAgICQobm9Xb3Jkc0xlZnQpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoYWxsV29yZHNPaykudGV4dChsb2NhbFtsb2NhbC5jdXJyZW50TG9jYWxdLmFsbFdvcmRzT2spO1xyXG4gICAgICAkKG5vV29yZHNMZWZ0KS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICAgICQobGVhcm5Xb3Jkc0dycCkuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGFjdGlvbldvcmQoc3RlcCwgcmVpbmRleCkge1xyXG4gICAgaWYgKHN0ZXApIHtcclxuICAgICAgY29uc3Qgd29yZCA9IHtcclxuICAgICAgICBpbmRleDogTGVhcm4ud29yZHNMZWFybltMZWFybi5jdXJyZW50SW5kZXhdLmluZGV4LFxyXG4gICAgICAgIHdvcmQ6IExlYXJuLndvcmRzTGVhcm5bTGVhcm4uY3VycmVudEluZGV4XS53b3JkLFxyXG4gICAgICAgIHRyYW5zbGF0ZTogTGVhcm4ud29yZHNMZWFybltMZWFybi5jdXJyZW50SW5kZXhdLnRyYW5zbGF0ZSxcclxuICAgICAgICBzdGVwLFxyXG4gICAgICAgIGRhdGU6ICgxID09PSBzdGVwKSA/IChVdGlscy5nZXRUb2RheSgpICsgVXRpbHMuZGVsYXkgKiBTZXR0aW5ncy5wYXJhbXMuZmlyc3QpIDogMFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgTFcuc3RvcmVJdGVtKGAke0xXLm5hbWV9LSR7TGVhcm4ud29yZHNMZWFybltMZWFybi5jdXJyZW50SW5kZXhdLmluZGV4fWAsIHdvcmQpOyAvL3NhdmUgd29yZFxyXG5cclxuICAgICAgaWYgKHJlaW5kZXgpIHtcclxuICAgICAgICBMZWFybi53b3Jkc0xlYXJuLnNwbGljZShMZWFybi5jdXJyZW50SW5kZXgsIDEpOyAvL3JlbW92ZSBmcm9tIGluZGV4XHJcbiAgICAgICAgTGVhcm4ucmVjb3VudEluZGV4TGVhcm4oKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBMZWFybi5jdXJyZW50SW5kZXgrKztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgTGVhcm4uY3VycmVudEluZGV4Kys7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKExlYXJuLmN1cnJlbnRJbmRleCA+PSBMZWFybi53b3Jkc0xlYXJuLmxlbmd0aCkge1xyXG4gICAgICBMZWFybi5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgfVxyXG4gICAgTGVhcm4uc2hvd1dvcmQoKTtcclxuICB9LFxyXG5cclxuICByZW1lbWJlcldvcmQoKSB7XHJcbiAgICBMZWFybi5hY3Rpb25Xb3JkKDEsIHRydWUpO1xyXG4gIH0sXHJcblxyXG4gIHJlcGVhdFdvcmQoKSB7XHJcbiAgICBMZWFybi5hY3Rpb25Xb3JkKDApO1xyXG4gIH0sXHJcblxyXG4gIGtub3duV29yZCgpIHtcclxuICAgIExlYXJuLmFjdGlvbldvcmQoNCwgdHJ1ZSk7XHJcbiAgfSxcclxuXHJcbiAgaW5pdCgpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJyNyZW1lbWJlckJ0bicsIExlYXJuLnJlbWVtYmVyV29yZCk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcjcmVwZWF0QnRuJywgTGVhcm4ucmVwZWF0V29yZCk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcja25vd25CdG4nLCBMZWFybi5rbm93bldvcmQpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCB7TGVhcm59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvYWN0aW9ucy9sZWFybi5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyByZXBlYXQuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBlMXIwbmQuY3JnQGdtYWlsLmNvbVxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuLi91dGlscy9MVyc7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi8uLi91dGlscy91dGlscyc7XHJcbmltcG9ydCB7TGVhcm59IGZyb20gJy4vbGVhcm4nO1xyXG5cclxuaW1wb3J0IFNldHRpbmdzQ2xhc3MgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncyc7XHJcbmNvbnN0IFNldHRpbmdzID0gbmV3IFNldHRpbmdzQ2xhc3MoKTtcclxuXHJcbmNvbnN0IFJlcGVhdCA9IHtcclxuICB3b3Jkc1JlcGVhdDoge1xyXG4gICAgZmlyc3Q6IFtdLFxyXG4gICAgc2Vjb25kOiBbXSxcclxuICAgIHRoaXJkOiBbXVxyXG4gIH0sXHJcblxyXG4gIHJlcGVhdFdvcmRzTnVtOiAkKCcjcmVwZWF0V29yZHNOdW0nKSxcclxuICByZXBlYXRXb3Jkc1RvcE51bTogJCgnI3JlcGVhdFdvcmRzVG9wTnVtJyksXHJcbiAgcmVwZWF0V29yZHNUb3BTTnVtOiAkKCcjcmVwZWF0V29yZHNUb3BTTnVtJyksXHJcbiAgY2hlY2tXb3JkOiAkKCcjY2hlY2tXb3JkJyksXHJcbiAgY2hlY2tXb3JkSW5wOiAkKCcjY2hlY2tXb3JkSW5wJyksXHJcbiAgZW50ZXJXb3JkOiAkKCcjZW50ZXJXb3JkJyksXHJcbiAgaW5wdXRXb3JkOiAkKCcjaW5wdXRXb3JkJyksXHJcbiAgbm9Xb3Jkc1JlcGVhdDogJCgnI25vV29yZHNSZXBlYXQnKSxcclxuICBlbnRlckJ0bjogJCgnI2VudGVyQnRuJyksXHJcblxyXG4gIHJlY291bnRJbmRleFJlcGVhdCgpIHtcclxuICAgIC8vY291bnQgd29yZHMgdG8gUmVwZWF0XHJcbiAgICBpZiAoIVJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGggJiYgIVJlcGVhdC53b3Jkc1JlcGVhdC5zZWNvbmQubGVuZ3RoICYmICFSZXBlYXQud29yZHNSZXBlYXQudGhpcmQubGVuZ3RoKSB7XHJcbiAgICAgICQoTFcuaW5kZXgpLmVhY2goKGluZGV4LCBub2RlKSA9PiB7IC8vdGhlIGluaXRpYWwgY291bnRpbmdcclxuICAgICAgICBjb25zdCBpdGVtID0gTFcucmVhZEl0ZW0oYCR7TFcubmFtZX0tJHtub2RlfWApO1xyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICBpZiAoVXRpbHMuZ2V0VG9kYXkoKSA+IGl0ZW0uZGF0ZSkgeyAvL2lmIHRoaXMgd29yZCBpcyBmb3IgdG9kYXlcclxuICAgICAgICAgICAgaWYgKDEgPT09IGl0ZW0uc3RlcCkge1xyXG4gICAgICAgICAgICAgIFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKDIgPT09IGl0ZW0uc3RlcCkge1xyXG4gICAgICAgICAgICAgIFJlcGVhdC53b3Jkc1JlcGVhdC5zZWNvbmQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoMyA9PT0gaXRlbS5zdGVwKSB7XHJcbiAgICAgICAgICAgICAgUmVwZWF0LndvcmRzUmVwZWF0LnRoaXJkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgd29yZHNSZXBlYXRUb3RhbCA9IFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGggKyBSZXBlYXQud29yZHNSZXBlYXQuc2Vjb25kLmxlbmd0aCArIFJlcGVhdC53b3Jkc1JlcGVhdC50aGlyZC5sZW5ndGg7XHJcbiAgICBjb25zdCB3b3Jkc1JlcGVhdExlbmd0aCA9ICh3b3Jkc1JlcGVhdFRvdGFsKSA/IHdvcmRzUmVwZWF0VG90YWwgOiAnJztcclxuXHJcbiAgICAkKHJlcGVhdFdvcmRzTnVtKS50ZXh0KHdvcmRzUmVwZWF0TGVuZ3RoIHx8ICcwJyk7XHJcbiAgICAkKHJlcGVhdFdvcmRzVG9wTnVtKS50ZXh0KHdvcmRzUmVwZWF0TGVuZ3RoKTtcclxuICAgICQocmVwZWF0V29yZHNUb3BTTnVtKS50ZXh0KHdvcmRzUmVwZWF0TGVuZ3RoKTtcclxuICB9LFxyXG5cclxuICBnZXRXb3JkKGluZGV4LCBhcnJXb3Jkcykge1xyXG4gICAgLy9pZiBpbmRleCBpcyAwIHdlIGdldCB0aGUgY29ycmVjdCB3b3JkLiBUaGUgb3RoZXIgd29yZHMgYXJlIHJhbmRvbVxyXG4gICAgaWYgKDAgPT09IGluZGV4KSB7XHJcbiAgICAgIHdvcmRQbGFjZWhvbGRlciA9IFJlcGVhdC53b3Jkc1JlcGVhdFsoUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCkgPyAnZmlyc3QnIDogJ3NlY29uZCddWzBdWyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICd0cmFuc2xhdGUnIDogJ3dvcmQnXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdvcmRQbGFjZWhvbGRlciA9IFZvY2FidWxhcnlbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ3RyYW5zbGF0ZXMnIDogJ3dvcmRzJ11bVXRpbHMuZ2V0UmFuZG9tSW50KDAsIFZvY2FidWxhcnlbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ3RyYW5zbGF0ZXMnIDogJ3dvcmRzJ10ubGVuZ3RoIC0gMSldO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhcnJXb3Jkcy5pbmNsdWRlcyh3b3JkUGxhY2Vob2xkZXIpKSB7XHJcbiAgICAgIFJlcGVhdC5nZXRXb3JkKGluZGV4LCBhcnJXb3Jkcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHdvcmRQbGFjZWhvbGRlcjtcclxuICB9LFxyXG5cclxuICBzaG93V29yZCgpIHsgLy9zaG93IGEgbmV4dCB3b3JkIHRvIFJlcGVhdFxyXG4gICAgaWYgKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGggfHwgUmVwZWF0LndvcmRzUmVwZWF0LnNlY29uZC5sZW5ndGgpIHtcclxuICAgICAgY29uc3QgaWQgPSBSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXVswXS5pbmRleDtcclxuICAgICAgbGV0IHdvcmRQbGFjZWhvbGRlciA9ICcnO1xyXG4gICAgICBjb25zdCBhcnJXb3JkcyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAkKGNoZWNrV29yZElucCkudGV4dChSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXVswXVsoUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCkgPyAnd29yZCcgOiAndHJhbnNsYXRlJ10pLmRhdGEoJ2lkJywgaWQpO1xyXG5cclxuICAgICAgY29uc3QgYXJyT3B0aW9uQnV0dG9ucyA9ICQoJ1tkYXRhLXR5cGU9Y2hlY2tXb3JkQnRuXScpO1xyXG4gICAgICAvL3RoZSBhbnN3ZXIgYnV0dG9ucyBhcmUgc2h1ZmZsZWQgc28gdGhhdCB3ZSBkb24ndCBrbm93IHdoaWNoIG9uZSBpcyB0aGUgY29ycmVjdCB3b3JkLlxyXG4gICAgICBVdGlscy5zaHVmZmxlKGFyck9wdGlvbkJ1dHRvbnMpO1xyXG5cclxuICAgICAgYXJyT3B0aW9uQnV0dG9ucy5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG5cclxuICAgICAgICB3b3JkUGxhY2Vob2xkZXIgPSBSZXBlYXQuZ2V0V29yZChpbmRleCwgYXJyV29yZHMpO1xyXG5cclxuICAgICAgICBhcnJXb3Jkc1tpbmRleF0gPSB3b3JkUGxhY2Vob2xkZXI7XHJcblxyXG4gICAgICAgICQodGhpcykudGV4dCh3b3JkUGxhY2Vob2xkZXIpO1xyXG4gICAgICB9KTtcclxuICAgICAgJChlbnRlckJ0bikuZGF0YSgnZGlyZWN0aW9uJywgdHJ1ZSk7XHJcbiAgICAgICQoY2hlY2tXb3JkKS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICAgICQoZW50ZXJXb3JkKS5hZGRDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICAgICQobm9Xb3Jkc1JlcGVhdCkuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgfSBlbHNlIGlmIChSZXBlYXQud29yZHNSZXBlYXQudGhpcmQubGVuZ3RoKSB7XHJcbiAgICAgICQoZW50ZXJXb3JkSW5wKS50ZXh0KFJlcGVhdC53b3Jkc1JlcGVhdC50aGlyZFswXS50cmFuc2xhdGUpO1xyXG4gICAgICAkKGNoZWNrV29yZCkuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKGVudGVyV29yZCkucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKG5vV29yZHNSZXBlYXQpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoY2hlY2tXb3JkKS5hZGRDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICAgICQoZW50ZXJXb3JkKS5hZGRDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICAgICQobm9Xb3Jkc1JlcGVhdCkucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGFjdGlvbldvcmQoc3RlcCwgcmVpbmRleCkge1xyXG4gICAgaWYgKHN0ZXApIHtcclxuXHJcbiAgICAgIExXLnN0b3JlSXRlbShgJHtMVy5uYW1lfS0ke1JlcGVhdC53b3Jkc1JlcGVhdFtSZXBlYXQuY3VycmVudEluZGV4XS53b3JkfWAsIHdvcmQpOyAvL3NhdmUgd29yZFxyXG5cclxuICAgICAgaWYgKHJlaW5kZXgpIHtcclxuICAgICAgICBSZXBlYXQud29yZHNSZXBlYXQuc3BsaWNlKFJlcGVhdC5jdXJyZW50SW5kZXgsIDEpOyAvL3JlbW92ZSBmcm9tIGluZGV4XHJcbiAgICAgICAgUmVwZWF0LnJlY291bnRJbmRleFJlcGVhdCgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFJlcGVhdC5jdXJyZW50SW5kZXgrKztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgUmVwZWF0LmN1cnJlbnRJbmRleCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChSZXBlYXQuY3VycmVudEluZGV4ID49IFJlcGVhdC53b3Jkc1JlcGVhdC5sZW5ndGgpIHtcclxuICAgICAgUmVwZWF0LmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICB9XHJcbiAgICBSZXBlYXQuc2hvd1dvcmQoUmVwZWF0LmN1cnJlbnRJbmRleCk7XHJcbiAgfSxcclxuXHJcbiAgY2hlY2tXb3JkKHNlbGYpIHtcclxuICAgIGNvbnN0IHdvcmQgPSB7XHJcbiAgICAgIGluZGV4OiBSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXVswXS5pbmRleCxcclxuICAgICAgd29yZDogUmVwZWF0LndvcmRzUmVwZWF0WyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICdmaXJzdCcgOiAnc2Vjb25kJ11bMF0ud29yZCxcclxuICAgICAgdHJhbnNsYXRlOiBSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXVswXS50cmFuc2xhdGUsXHJcbiAgICAgIHN0ZXA6IFJlcGVhdC53b3Jkc1JlcGVhdFsoUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCkgPyAnZmlyc3QnIDogJ3NlY29uZCddWzBdLnN0ZXAsXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICgkKHNlbGYpLnRleHQoKSA9PT0gKChSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/IHdvcmQudHJhbnNsYXRlIDogd29yZC53b3JkKSkge1xyXG4gICAgICB3b3JkLnN0ZXArKztcclxuICAgICAgd29yZC5kYXRlID0gVXRpbHMuZ2V0VG9kYXkoKSArIFV0aWxzLmRlbGF5ICogU2V0dGluZ3MucGFyYW1zWyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICdzZWNvbmQnIDogJ3RoaXJkJ107XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3b3JkLnN0ZXAtLTtcclxuICAgICAgd29yZC5kYXRlID0gKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gMCA6IFV0aWxzLmdldFRvZGF5KCkgKyBVdGlscy5kZWxheSAqIFNldHRpbmdzLnBhcmFtcy5maXJzdDtcclxuICAgIH1cclxuICAgIExXLnN0b3JlSXRlbShgJHtMVy5uYW1lfS0ke3dvcmQuaW5kZXh9YCwgd29yZCk7IC8vc2F2ZSB3b3JkXHJcbiAgICBSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXS5zcGxpY2UoMCwgMSk7IC8vcmVtb3ZlIGZyb20gaW5kZXhcclxuICAgIExlYXJuLndvcmRzTGVhcm4gPSBbXTtcclxuICAgIExlYXJuLnJlY291bnRJbmRleExlYXJuKCk7XHJcbiAgICBMZWFybi5zaG93V29yZCgpO1xyXG4gICAgUmVwZWF0LnJlY291bnRJbmRleFJlcGVhdCgpO1xyXG4gICAgUmVwZWF0LnNob3dXb3JkKCk7XHJcbiAgfSxcclxuXHJcbiAgcmVwZWF0V29yZCgpIHtcclxuICAgIGNvbnN0IHdvcmQgPSB7XHJcbiAgICAgIGluZGV4OiBSZXBlYXQud29yZHNSZXBlYXQudGhpcmRbMF0uaW5kZXgsXHJcbiAgICAgIHdvcmQ6IFJlcGVhdC53b3Jkc1JlcGVhdC50aGlyZFswXS53b3JkLFxyXG4gICAgICB0cmFuc2xhdGU6IFJlcGVhdC53b3Jkc1JlcGVhdC50aGlyZFswXS50cmFuc2xhdGUsXHJcbiAgICAgIHN0ZXA6IFJlcGVhdC53b3Jkc1JlcGVhdC50aGlyZFswXS5zdGVwLFxyXG4gICAgfTtcclxuICAgIGlmICgkKGVudGVyV29yZElucCkudmFsKCkgPT09IHdvcmQud29yZCkge1xyXG4gICAgICB3b3JkLnN0ZXArKztcclxuICAgICAgd29yZC5kYXRlID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdvcmQuc3RlcC0tO1xyXG4gICAgICB3b3JkLmRhdGUgPSBVdGlscy5nZXRUb2RheSgpICsgVXRpbHMuZGVsYXkgKiBTZXR0aW5ncy5wYXJhbXMuc2Vjb25kO1xyXG4gICAgfTtcclxuICAgIExXLnN0b3JlSXRlbShgJHtMVy5uYW1lfS0ke3dvcmQuaW5kZXh9YCwgd29yZCk7IC8vc2F2ZSB3b3JkXHJcbiAgICBSZXBlYXQud29yZHNSZXBlYXQudGhpcmQuc3BsaWNlKDAsIDEpOyAvL3JlbW92ZSBmcm9tIGluZGV4XHJcbiAgICBMZWFybi53b3Jkc0xlYXJuID0gW107XHJcbiAgICBMZWFybi5yZWNvdW50SW5kZXhMZWFybigpO1xyXG4gICAgTGVhcm4uc2hvd1dvcmQoKTtcclxuICAgIFJlcGVhdC5yZWNvdW50SW5kZXhSZXBlYXQoKTtcclxuICAgIFJlcGVhdC5zaG93V29yZCgpO1xyXG4gIH0sXHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICdbZGF0YS10eXBlPWNoZWNrV29yZEJ0bl0nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFJlcGVhdC5jaGVja1dvcmQodGhpcyk7XHJcbiAgICB9KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJyNlbnRlckJ0bicsIFJlcGVhdC5yZXBlYXRXb3JkKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQge1JlcGVhdH07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy9hY3Rpb25zL3JlcGVhdC5qcyJdLCJzb3VyY2VSb290IjoiIn0=