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
	
	var _rowWord = __webpack_require__(10);
	
	var _rowWord2 = _interopRequireDefault(_rowWord);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var LW = new _LW2.default('LWdb'); /**************************************************
	                                    * Learn Words // vocabulary.js
	                                    * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	                                    * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	                                    * Placed in public domain.
	                                    **************************************************/
	
	
	var Vocabulary = {
	  rowTemplate: _rowWord2.default,
	
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

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<div id=\"{{node}}\" class=\"row\">\r\n  <div class=\"col-md-5 col-sm-5 col-xs-4\">{{txt}}</div>\r\n  <div class=\"col-md-5 col-sm-5 col-xs-4\">{{translate}}</div>\r\n  <div class=\"col-md-2 col-sm-2 col-xs-4\">\r\n    <button data-node=\"{{node}}\" type=\"button\" class=\"btn btn-info js-edit-btn\">\r\n      <span class=\"glyphicon glyphicon-edit\"></span>\r\n    </button>\r\n  </div>\r\n</div>\r\n<div id=\"{{node}}Edit\" class=\"row nodisplay\">\r\n  <form id=\"form-{{node}}\" role=\"form\">\r\n    <div class=\"col-md-5 col-sm-5 col-xs-4\">\r\n      <input type=\"text\" class=\"form-control inp-fld\" id=\"word-{{node}}\" placeholder=\"Enter word\" value=\"{{txt}}\">\r\n    </div>\r\n    <div class=\"col-md-5 col-sm-5 col-xs-4\">\r\n      <input type=\"text\" class=\"form-control inp-fld\" id=\"translate-{{node}}\" placeholder=\"Enter translate\" value=\"{{translate}}\">\r\n    </div>\r\n    <div class=\"col-md-2 col-sm-2 col-xs-4\">\r\n      <button data-node=\"{{node}}\" type=\"button\" class=\"btn btn-success js-save-btn\">\r\n        <span class=\"glyphicon glyphicon-ok\">\r\n        </span>\r\n      </button>\r\n      <button id=\"del-{{node}}\" data-node=\"{{node}}\" data-id=\"{{index}}\" type=\"button\" class=\"btn btn-danger js-del-btn\">\r\n        <span class=\"glyphicon glyphicon-remove\"></span>\r\n      </button>\r\n    </div>\r\n  </form>\r\n</div>\r\n";

/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvTFcuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pzL3V0aWxzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL2FwcC9qcy91dGlscy9tZW1vcnlzdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvbmF2aWdhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvbG9jYWwvbG9jYWwuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pzL2FjdGlvbnMvdm9jYWJ1bGFyeS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvYWN0aW9ucy9sZWFybi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvYWN0aW9ucy9yZXBlYXQuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NvbXBvbmVudHMvcm93LXdvcmQvcm93LXdvcmQuaHRtbCJdLCJuYW1lcyI6WyJMVyIsImNvbnNvbGUiLCJsb2ciLCJpc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSIsIlNldHRpbmdzIiwiaXNPSyIsImlzRW1wdHkiLCJsb2FkV29yZHMiLCJpbml0Iiwidmlld1dvcmQiLCJyZWNvdW50SW5kZXhMZWFybiIsInNob3dXb3JkIiwicmVjb3VudEluZGV4UmVwZWF0IiwiZ2V0U2V0dGluZ3MiLCJjdXJyZW50TG9jYWwiLCIkIiwiZGF0YSIsImNsaWNrIiwiY2xvc2VNb2JNZW51IiwiTFdDbGFzcyIsImRiTmFtZSIsImFsZXJ0IiwibmFtZSIsImluZGV4Iiwic3RySW5kZXgiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic3BsaXQiLCJ3aW5kb3ciLCJlIiwia2V5IiwiSlNPTiIsInBhcnNlIiwicmVtb3ZlSXRlbSIsInZhbHVlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsIlFVT1RBX0VYQ0VFREVEX0VSUiIsInRoZVNldHRpbmdzT2JqIiwic3RvcmVJdGVtIiwic2V0dGluZ3MiLCJyZWFkSXRlbSIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJ0aGVXb3JkcyIsImkiLCJhcnJheU9mS2V5cyIsInN0b3JlRWFjaEVsZW1lbnQiLCJlbGVtZW50Iiwic3RlcCIsImRhdGUiLCJwdXNoIiwiZm9yRWFjaCIsImJpbmQiLCJqb2luIiwibGVuZ3RoIiwic3RyVmFsdWUiLCJyZXN1bHQiLCJwcmVmaXhGb3JOdW1iZXIiLCJsYXN0SW5kZXhPZiIsImFLZXlQcmVmaXgiLCJrZXlzVG9EZWxldGUiLCJzdCIsImFLZXkiLCJyZW1vdmVPYmplY3RzIiwiU2V0dGluZ3NDbGFzcyIsImlucHV0Rmlyc3RDaGVjayIsImlucHV0U2Vjb25kQ2hlY2siLCJpbnB1dFRoaXJkQ2hlY2siLCJzZXR0aW5nRnJvbSIsImVycm9yU2V0dGluZ3MiLCJwYXJhbXMiLCJkb2N1bWVudCIsIm9uIiwic2F2ZVNldHRpbmciLCJjYW5jZWxTZXR0aW5nIiwic3RvcmVkU2V0dGluZ3MiLCJ2YWwiLCJ0cmltIiwiZm9ybSIsImVycm9yTmFtZSIsImVycm9yIiwiVXRpbHMiLCJjbGVhckZpZWxkcyIsInNldEZpZWxkRXJyb3IiLCJjaGlsZHJlbiIsImlzTnVtYmVyIiwiZXJyb3JUeHQiLCJsb2NhbCIsImVycm9yRW1wdHkiLCJlcnJvclZhbGlkIiwicmVtb3ZlQ2xhc3MiLCJ0ZXh0IiwicHV0U2V0dGluZ3MiLCJlcnJvck5vIiwic3RyIiwid2l0aERvdCIsIk51bWJlclJlZyIsIk51bWJlcldpdGhEb3RSZWciLCJ0ZXN0IiwiZWFjaCIsIm5vZGUiLCJhZGRDbGFzcyIsInNlbGYiLCJnZXRSYW5kb21JbnQiLCJtaW4iLCJtYXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZXRUb2RheSIsImZ1bGxEYXRlIiwibm93IiwiRGF0ZSIsInZhbHVlT2YiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImhhc0NsYXNzIiwic2h1ZmZsZSIsImEiLCJqIiwieCIsIm1vZHVsZSIsImV4cG9ydHMiLCJNZW1vcnlzdG9yZSIsIk5hdmlnYXRpb24iLCJoYXNoZ3VhcmQiLCJoYXNoIiwibG9jYXRpb24iLCJ0cmlnZ2VyIiwic2V0VGltZW91dCIsImhhc2hicmVhayIsImhhc2hVcmwiLCJzbGljZSIsIm5hdlNlbGVjdCIsInBhcmVudCIsImVuX0dCIiwic3VtbWFyeSIsImxlYXJuIiwicmVwZWF0Iiwidm9jYWJ1bGFyeSIsImVkaXRXb3JkcyIsInNhdmVCdG4iLCJjYW5jZWxCdG4iLCJsYW5ndWFnZSIsImRlX0RFIiwicnVfUlUiLCJlcnJvck5vVyIsInRvdGFsV29yZHMiLCJsZWFybldvcmRzTnVtIiwicmVwZWF0V29yZHMiLCJyZW1lbWJlckJ0biIsInJlcGVhdEJ0biIsImtub3duQnRuIiwiYWxsV29yZHNPayIsImlucHV0V29yZExibCIsImlucHV0VHJhbnNsYXRlTGJsIiwiZW50ZXJCdG4iLCJhbGxXb3Jkc0RvbmUiLCJjaGFuZ2VMb2NhbENvbnRlbnQiLCJsYW5nTm9kZSIsImxhbmdTZWxlY3QiLCJWb2NhYnVsYXJ5Iiwicm93VGVtcGxhdGUiLCJ0b3RhbFdvcmRzTnVtIiwidm9jYWJ1bGFyeUJveCIsImVycm9yVm9jYWJ1bGFyeUJveCIsImVycm9yVm9jYWJ1bGFyeSIsImlucHV0V29yZFR4dCIsImlucHV0VHJhbnNsYXRlIiwiYWRkV29yZEZvcm0iLCJ3b3JkcyIsInRyYW5zbGF0ZXMiLCJyZWNvdW50VG90YWwiLCJyZW1vdmVXb3JkIiwibm90UmVpbmRleCIsImlkIiwic3BsaWNlIiwicmVtb3ZlIiwid29yZHNMZWFybiIsIndvcmRzUmVwZWF0IiwiY3VycmVudEluZGV4Rmlyc3QiLCJjdXJyZW50SW5kZXhTZWNvbmQiLCJjdXJyZW50SW5kZXhUaGlyZCIsImNvbnRlbnRJbm5lciIsInR4dCIsInRyYW5zbGF0ZSIsIml0ZW0iLCJ3b3JkIiwicmVwbGFjZSIsImh0bWwiLCJhZGRTYXZlV29yZCIsIndvcmRUeHQiLCJhZGRGb3JtIiwiYWRkV29yZCIsImlucHV0V29yZCIsIm5ld0luZGV4VmFsIiwidG9kYXlEYXRlIiwiaW5kZXhPZiIsImFwcGVuZCIsImF0dHIiLCJiZWZvcmUiLCJoaWRlIiwic2hvdyIsIkxlYXJuIiwiY3VycmVudEluZGV4IiwibGVhcm5Xb3Jkc1RvcE51bSIsImxlYXJuV29yZHNUb3BTTnVtIiwibGVhcm5Xb3JkIiwidHJhbnNsYXRlV29yZCIsImxlYXJuV29yZHNHcnAiLCJub1dvcmRzTGVmdCIsIndvcmRzTGVhcm5MZW5ndGgiLCJhY3Rpb25Xb3JkIiwicmVpbmRleCIsImRlbGF5IiwicmVtZW1iZXJXb3JkIiwicmVwZWF0V29yZCIsImtub3duV29yZCIsIlJlcGVhdCIsInJlcGVhdFdvcmRzTnVtIiwicmVwZWF0V29yZHNUb3BOdW0iLCJyZXBlYXRXb3Jkc1RvcFNOdW0iLCJjaGVja1dvcmQiLCJjaGVja1dvcmRJbnAiLCJlbnRlcldvcmQiLCJub1dvcmRzUmVwZWF0Iiwid29yZHNSZXBlYXRUb3RhbCIsIndvcmRzUmVwZWF0TGVuZ3RoIiwiZ2V0V29yZCIsImFycldvcmRzIiwid29yZFBsYWNlaG9sZGVyIiwiaW5jbHVkZXMiLCJBcnJheSIsImFyck9wdGlvbkJ1dHRvbnMiLCJlbnRlcldvcmRJbnAiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7OztBQU1BOztBQUVBOzs7O0FBSUE7Ozs7QUFHQTs7QUFFQTs7QUFRQTs7QUFHQTs7QUFHQTs7QUFJQTs7QUFLQTs7OztBQS9CQSxLQUFNQSxLQUFLLGlCQUFZLE1BQVosQ0FBWDtBQUNBQyxTQUFRQyxHQUFSLENBQVlGLEdBQUdHLHVCQUFILEVBQVo7O0FBR0EsS0FBTUMsV0FBVyx3QkFBakI7O0FBS0E7QUFDQSxLQUFJSixHQUFHSyxJQUFILElBQVdMLEdBQUdNLE9BQWxCLEVBQTJCO0FBQ3pCTCxXQUFRQyxHQUFSLENBQVksa0NBQVo7QUFDQUYsTUFBR08sU0FBSDtBQUNBTixXQUFRQyxHQUFSLENBQVkscUNBQVo7QUFDRDs7QUFHRCx3QkFBV00sSUFBWDs7QUFHQSxjQUFNQSxJQUFOOztB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RUFBWUMsRUFBWixDQUFlLGtCQUFmLEVBQW1DLDBCQUFuQyxFQUErRCxZQUFZO0FBQ3pFbUosWUFBT0ksU0FBUCxDQUFpQixJQUFqQjtBQUNELElBRkQ7QUFHQWxOLEtBQUUwRCxRQUFGLEVBQVlDLEVBQVosQ0FBZSxrQkFBZixFQUFtQyxXQUFuQyxFQUFnRG1KLE9BQU9GLFVBQXZEO0FBQ0QsRUF2S0csV0FBTjs7U0EwS1FFLE0sR0FBQUEsTTs7Ozs7O0FDeExSLCtCQUE4QixNQUFNLG1FQUFtRSxLQUFLLHdEQUF3RCxXQUFXLG9GQUFvRixNQUFNLHVLQUF1SyxNQUFNLHVEQUF1RCxNQUFNLDZJQUE2SSxNQUFNLHdDQUF3QyxLQUFLLGtKQUFrSixNQUFNLDZDQUE2QyxXQUFXLG1HQUFtRyxNQUFNLCtLQUErSyxNQUFNLGlCQUFpQixNQUFNLGVBQWUsT0FBTyxtTCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiogTGVhcm4gV29yZHMgLy8gbWFpbi5qc1xyXG4qIGNvZGVkIGJ5IEFuYXRvbCBNYXJlemhhbnlpIGFrYSBlMXIwbmQvL1tDUkddIC0gSmFudWFyeSAyMDE3XHJcbiogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBMV0NsYXNzIGZyb20gJy4vdXRpbHMvTFcnO1xyXG5jb25zdCBMVyA9IG5ldyBMV0NsYXNzKCdMV2RiJyk7XHJcbmNvbnNvbGUubG9nKExXLmlzTG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkpO1xyXG5cclxuaW1wb3J0IFNldHRpbmdzQ2xhc3MgZnJvbSAnLi4vY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncyc7XHJcbmNvbnN0IFNldHRpbmdzID0gbmV3IFNldHRpbmdzQ2xhc3MoKTtcclxuXHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMvdXRpbHMnO1xyXG5cclxuaW1wb3J0IHtNZW1vcnlzdG9yZX0gZnJvbSAnLi91dGlscy9tZW1vcnlzdG9yZSc7XHJcbi8vIGxvYWQgdGhlIGRlZmF1bHQgd29yZHMgc2V0IGlmIG5lZWRlZFxyXG5pZiAoTFcuaXNPSyAmJiBMVy5pc0VtcHR5KSB7XHJcbiAgY29uc29sZS5sb2coJ21lbW9yeXN0b3JlOiBzdGFydCBsb2FkaW5nIHdvcmRzJyk7XHJcbiAgTFcubG9hZFdvcmRzKE1lbW9yeXN0b3JlKTtcclxuICBjb25zb2xlLmxvZygnbWVtb3J5c3RvcmU6IHdvcmRzIGhhdmUgYmVlbiBsb2FkZWQnKTtcclxufVxyXG5cclxuaW1wb3J0IHtOYXZpZ2F0aW9ufSBmcm9tICcuL3V0aWxzL25hdmlnYXRpb24nO1xyXG5OYXZpZ2F0aW9uLmluaXQoKTtcclxuXHJcbmltcG9ydCB7bG9jYWx9IGZyb20gJy4vbG9jYWwvbG9jYWwnO1xyXG5sb2NhbC5pbml0KCk7XHJcblxyXG5pbXBvcnQge1ZvY2FidWxhcnl9IGZyb20gJy4vYWN0aW9ucy92b2NhYnVsYXJ5JztcclxuVm9jYWJ1bGFyeS5pbml0KCk7XHJcblZvY2FidWxhcnkudmlld1dvcmQoKTtcclxuXHJcbmltcG9ydCB7TGVhcm59IGZyb20gJy4vYWN0aW9ucy9sZWFybic7XHJcbkxlYXJuLmluaXQoKTtcclxuTGVhcm4ucmVjb3VudEluZGV4TGVhcm4oKTtcclxuTGVhcm4uc2hvd1dvcmQoKTtcclxuXHJcbmltcG9ydCB7UmVwZWF0fSBmcm9tICcuL2FjdGlvbnMvcmVwZWF0JztcclxuUmVwZWF0LmluaXQoKTtcclxuUmVwZWF0LnJlY291bnRJbmRleFJlcGVhdCgpO1xyXG5SZXBlYXQuc2hvd1dvcmQoKTtcclxuXHJcbmlmICgnZGV2ZWxvcG1lbnQnID09PSBOT0RFX0VOVikge1xyXG4gIGNvbnNvbGUubG9nKGBkZXZlbG9wbWVudCBlbnZpcm9ubWVudCAke05PREVfRU5WfWApO1xyXG59XHJcbi8vIHJlYWQgc2V0dGluZ3NcclxuU2V0dGluZ3MuZ2V0U2V0dGluZ3MoKTtcclxuXHJcbi8vIHNldCB1c2VyIHNhdmVkIGxvY2FsXHJcbmlmIChsb2NhbC5jdXJyZW50TG9jYWwgIT09ICQoJ1tkYXRhLXR5cGU9bGFuZy1zZWxlY3RdLnNlbGVjdGVkJykuZGF0YSgnbGFuZycpKSB7XHJcblx0JChgW2RhdGEtbGFuZz0ke2xvY2FsLmN1cnJlbnRMb2NhbH1dYCkuY2xpY2soKTtcclxufTtcclxuXHJcblV0aWxzLmNsb3NlTW9iTWVudSgpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvbWFpbi5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyBsb2NhbHN0b3JhZ2UuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueUBnbWFpbC5jb21cclxuICpcclxuICogVXBkYXRlZCBieSBIYW5uZXMgSGlyemVsLCBOb3ZlbWJlciAyMDE2XHJcbiAqXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExXQ2xhc3Mge1xyXG4gY29uc3RydWN0b3IoZGJOYW1lKSB7XHJcbiAgIHRoaXMuaXNPSyA9IGZhbHNlO1xyXG4gICBpZiAoIXRoaXMuaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSkge1xyXG4gICAgIGFsZXJ0KCdMb2NhbCBTdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUuJyk7XHJcbiAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICB9O1xyXG4gICB0aGlzLm5hbWUgPSBkYk5hbWU7XHJcbiAgIC8vIGdldCBpbmRleFxyXG4gICB0aGlzLmluZGV4ID0gW107XHJcbiAgIGNvbnN0IHN0ckluZGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5uYW1lfS13b3Jkc2ApO1xyXG4gICBpZiAoc3RySW5kZXgpIHtcclxuICAgICB0aGlzLmluZGV4ID0gc3RySW5kZXguc3BsaXQoJywnKTtcclxuICAgfTtcclxuICAgdGhpcy5pc09LID0gdHJ1ZTtcclxuIH1cclxuXHJcbiBpc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSgpIHtcclxuICAgdHJ5IHtcclxuICAgICByZXR1cm4gd2luZG93ICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcbiAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICByZXR1cm4gZmFsc2U7XHJcbiAgIH1cclxuIH1cclxuXHJcbiByZWFkSXRlbShrZXkpIHtcclxuICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gICB9XHJcbiB9XHJcblxyXG4gcmVtb3ZlSXRlbShrZXkpIHtcclxuICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgIH1cclxuIH1cclxuXHJcbiBzdG9yZUl0ZW0oa2V5LCB2YWx1ZSkge1xyXG4gICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgdHJ5IHtcclxuICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICBpZiAoZSA9PT0gUVVPVEFfRVhDRUVERURfRVJSKSB7XHJcbiAgICAgICAgIGFsZXJ0KCdMb2NhbCBTdG9yYWdlIGlzIGZ1bGwnKTtcclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICB9XHJcbiAgIH1cclxuIH1cclxuXHJcbiBwdXRTZXR0aW5ncyh0aGVTZXR0aW5nc09iaikge1xyXG4gICB0aGlzLnN0b3JlSXRlbShgJHt0aGlzLm5hbWV9LXdvcmRzLXNldHRpbmdzYCwgdGhlU2V0dGluZ3NPYmopO1xyXG4gfVxyXG5cclxuIGdldFNldHRpbmdzKCkge1xyXG5cclxuICAgbGV0IHNldHRpbmdzID0gdGhpcy5yZWFkSXRlbShgJHt0aGlzLm5hbWV9LXdvcmRzLXNldHRpbmdzYCk7XHJcbiAgIGlmICghc2V0dGluZ3MpIHtcclxuICAgICAvLyB0aGUgYXBwIHJ1bnMgZm9yIHRoZSBmaXJzdCB0aW1lLCB0aHVzXHJcbiAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgc2V0dGluZyBvYmplY3QgbmVlZWRzIHRvIGJlIGluaXRpYWxpemVkXHJcbiAgICAgLy8gd2l0aCBkZWZhdWx0IHZhbHVlcy5cclxuXHJcbiAgICAgLy8gZmlyc3QgaXMgZm9yIGJveCAob3Igc3RlcCkgMSBpbiB0aGUgTGVpdG5lciBib3g7XHJcbiAgICAgLy8gICAgICAgYXNrIHRoZSB3b3JkIGFnYWluIGFmdGVyIDEgZGF5XHJcbiAgICAgLy8gc2Vjb25kIGlzIGZvciBib3ggMiA7IGFzayB0aGUgd29yZCBhZ2FpbiBhZnRlciAzIGRheXNcclxuICAgICAvLyB0aGlyZCBpcyBmb3IgYm94IDMgOyBhc2sgdGhlIHdvcmQgYWdhaW4gYWZ0ZXIgNyBkYXlzXHJcblxyXG4gICAgIC8vIE5vdGU6IGJveCAwIGlzIGZvciB0aGUgTGVhcm4gbW9kZSBhbmQgaXQgbm90IHNldFxyXG4gICAgIC8vIGFzIHRoZSB3b3JkcyBhcmUgYWNjZXNzaWJsZSBhbGwgdGhlIHRpbWVcclxuICAgICBjb25zb2xlLmxvZygnaW5pdGlhbGl6ZSBzZXR0aW5ncycpO1xyXG4gICAgIHNldHRpbmdzID0ge1xyXG4gICAgICAgZmlyc3Q6IDEsXHJcbiAgICAgICBzZWNvbmQ6IDMsXHJcbiAgICAgICB0aGlyZDogN1xyXG4gICAgIH07XHJcbiAgICAgdGhpcy5zdG9yZUl0ZW0oYCR7dGhpcy5uYW1lfS1zZXR0aW5nc2AsIHNldHRpbmdzKTtcclxuICAgICB0aGlzLnN0b3JlSXRlbShgJHt0aGlzLm5hbWV9LWxhbmd1YWdlYCwgJ2VuX0dCJyk7XHJcblxyXG4gICB9O1xyXG5cclxuICAgcmV0dXJuIHNldHRpbmdzO1xyXG4gfVxyXG5cclxuIGxvYWRXb3Jkcyh0aGVXb3Jkcykge1xyXG4gICBsZXQgaSA9IDA7XHJcbiAgIGNvbnN0IGFycmF5T2ZLZXlzID0gW107XHJcbiAgIGNvbnN0IHN0b3JlRWFjaEVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgIGVsZW1lbnQuaW5kZXggPSBgaW5kZXgkeysraX1gO1xyXG4gICAgIGVsZW1lbnQuc3RlcCA9IGVsZW1lbnQuZGF0ZSA9IDA7XHJcbiAgICAgdGhpcy5zdG9yZUl0ZW0oYCR7dGhpcy5uYW1lfS0ke2VsZW1lbnQuaW5kZXh9YCwgZWxlbWVudCk7XHJcbiAgICAgYXJyYXlPZktleXMucHVzaChlbGVtZW50LmluZGV4KTtcclxuICAgfTtcclxuXHJcbiAgIHRoZVdvcmRzLmZvckVhY2goc3RvcmVFYWNoRWxlbWVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgIHRoaXMuc3RvcmVJdGVtKGAke3RoaXMubmFtZX0td29yZHNgLCBhcnJheU9mS2V5cy5qb2luKCkpO1xyXG4gICB0aGlzLmluZGV4ID0gYXJyYXlPZktleXM7XHJcblxyXG4gICBjb25zb2xlLmxvZyhgJHthcnJheU9mS2V5cy5sZW5ndGh9IHdvcmRzIGhhdmUgYmVlbiBsb2FkZWRgKTtcclxuIH1cclxuXHJcbiBpc0VtcHR5KC8qa2V5Ki8pIHtcclxuICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgIHJldHVybiAoIXRoaXMuaW5kZXgubGVuZ3RoKSA/IHRydWUgOiBmYWxzZTtcclxuICAgfVxyXG4gfVxyXG5cclxuIGR1bXBXb3JkcygvKmFLZXlQcmVmaXgqLykge1xyXG4gICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgbGV0IGtleTtcclxuICAgICBsZXQgc3RyVmFsdWU7XHJcbiAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgIGNvbnN0IHByZWZpeEZvck51bWJlciA9IGAke3RoaXMubmFtZX0taW5kZXhgO1xyXG5cclxuICAgICAvLyBnbyB0aHJvdWdoIGFsbCBrZXlzIHN0YXJ0aW5nIHdpdGggdGhlIG5hbWVcclxuICAgICAvLyBvZiB0aGUgZGF0YWJhc2UsIGkuZSAnbGVhcm5Xb3Jkcy1pbmRleDE0J1xyXG4gICAgIC8vIGNvbGxlY3QgdGhlIG1hdGNoaW5nIG9iamVjdHMgaW50byBhcnJcclxuICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcclxuICAgICAgIHN0clZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuXHJcbiAgICAgICBpZiAoMCA9PT0ga2V5Lmxhc3RJbmRleE9mKHByZWZpeEZvck51bWJlciwgMCkpIHtcclxuICAgICAgICAgcmVzdWx0LnB1c2goSlNPTi5wYXJzZShzdHJWYWx1ZSkpO1xyXG4gICAgICAgfTtcclxuICAgICB9XHJcblxyXG4gICAgIC8vIER1bXAgdGhlIGFycmF5IGFzIEpTT04gY29kZSAoZm9yIHNlbGVjdCBhbGwgLyBjb3B5KVxyXG4gICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xyXG4gICB9XHJcbiB9XHJcblxyXG4gcmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KSB7XHJcbiAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICBsZXQga2V5O1xyXG4gICAgIC8vIHZhciBzdDtcclxuICAgICBjb25zdCBrZXlzVG9EZWxldGUgPSBbXTtcclxuXHJcbiAgICAgLy8gZ28gdGhyb3VnaCBhbGwga2V5cyBzdGFydGluZyB3aXRoIHRoZSBuYW1lXHJcbiAgICAgLy8gb2YgdGhlIGRhdGFiYXNlLCBpLmUgJ2xlYXJuV29yZHMtaW5kZXgxNCdcclxuICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcclxuICAgICAgIHN0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuXHJcbiAgICAgICBpZiAoMCA9PT0ga2V5Lmxhc3RJbmRleE9mKGFLZXlQcmVmaXgsIDApKSB7XHJcbiAgICAgICAgIGtleXNUb0RlbGV0ZS5wdXNoKGtleSk7XHJcbiAgICAgICB9O1xyXG4gICAgIH07XHJcbiAgICAgLy8gbm93IHdlIGhhdmUgYWxsIHRoZSBrZXlzIHdoaWNoIHNob3VsZCBiZSBkZWxldGVkXHJcbiAgICAgLy8gaW4gdGhlIGFycmF5IGtleXNUb0RlbGV0ZS5cclxuICAgICBjb25zb2xlLmxvZyhrZXlzVG9EZWxldGUpO1xyXG4gICAgIGtleXNUb0RlbGV0ZS5mb3JFYWNoKGFLZXkgPT4ge1xyXG4gICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oYUtleSk7XHJcbiAgICAgfSk7XHJcbiAgIH1cclxuIH1cclxuXHJcbiByZW1vdmVXb3JkcygpIHtcclxuICAgY29uc3QgYUtleVByZWZpeCA9IGAke3RoaXMubmFtZX0taW5kZXhgO1xyXG5cclxuICAgdGhpcy5yZW1vdmVPYmplY3RzKGFLZXlQcmVmaXgpO1xyXG4gICAvLyByZXNldCBpbmRleFxyXG4gICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLm5hbWV9LXdvcmRzYCwgJycpO1xyXG4gICAvLyB0aGlzIG9uZSB0cmlnZ2VycyB0aGF0IG1lbW9yeXN0b3JlIGlzIGV4ZWN1dGVkXHJcbiAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGAke3RoaXMubmFtZX0tc2V0dGluZ3NgKTtcclxuIH1cclxuXHJcbiBkZXN0cm95KCkge1xyXG4gICBjb25zdCBhS2V5UHJlZml4ID0gdGhpcy5uYW1lO1xyXG5cclxuICAgdGhpcy5yZW1vdmVPYmplY3RzKGFLZXlQcmVmaXgpO1xyXG4gfVxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvdXRpbHMvTFcuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyBzZXR0aW5ncy5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICpcclxuICogVXBkYXRlZCBieSBIYW5uZXMgSGlyemVsLCBOb3ZlbWJlciAyMDE2XHJcbiAqXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCBMV0NsYXNzIGZyb20gJy4uLy4uL2pzL3V0aWxzL0xXJztcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3NDbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmlucHV0Rmlyc3RDaGVjayA9ICQoJyNpbnB1dEZpcnN0Q2hlY2snKTtcclxuICAgIHRoaXMuaW5wdXRTZWNvbmRDaGVjayA9ICQoJyNpbnB1dFNlY29uZENoZWNrJyk7XHJcbiAgICB0aGlzLmlucHV0VGhpcmRDaGVjayA9ICQoJyNpbnB1dFRoaXJkQ2hlY2snKTtcclxuICAgIHRoaXMuc2V0dGluZ0Zyb20gPSAkKCcjc2V0dGluZ0Zyb20nKTtcclxuICAgIHRoaXMuZXJyb3JTZXR0aW5ncyA9ICQoJyNlcnJvclNldHRpbmdzJyk7XHJcblxyXG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcjc2F2ZVNldHRpbmdzJywgdGhpcy5zYXZlU2V0dGluZyk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcjY2FuY2VsU2V0dGluZ3MnLCB0aGlzLmNhbmNlbFNldHRpbmcpO1xyXG4gIH1cclxuICBnZXRTZXR0aW5ncygpIHsgLy9yZWFkIHNldHRpbmcncyB2YWx1ZXNcclxuICAgIGNvbnN0IHN0b3JlZFNldHRpbmdzID0gTFcuZ2V0U2V0dGluZ3MoKTtcclxuXHJcbiAgICAkKHRoaXMuaW5wdXRGaXJzdENoZWNrKS52YWwoc3RvcmVkU2V0dGluZ3MuZmlyc3QpO1xyXG4gICAgJCh0aGlzLmlucHV0U2Vjb25kQ2hlY2spLnZhbChzdG9yZWRTZXR0aW5ncy5zZWNvbmQpO1xyXG4gICAgJCh0aGlzLmlucHV0VGhpcmRDaGVjaykudmFsKHN0b3JlZFNldHRpbmdzLnRoaXJkKTtcclxuXHJcbiAgICB0aGlzLnBhcmFtcyA9IHN0b3JlZFNldHRpbmdzOyAvL3N0b3JlIGxvY2FsXHJcbiAgfVxyXG5cclxuICBzYXZlU2V0dGluZygpIHtcclxuICAgIC8vc2F2ZSBzZXR0aW5nJ3MgdmFsdWVzIHRvIERCXHJcbiAgICBjb25zdCBmaXJzdCA9ICQodGhpcy5pbnB1dEZpcnN0Q2hlY2spLnZhbCgpLnRyaW0oKTtcclxuXHJcbiAgICBjb25zdCBzZWNvbmQgPSAkKHRoaXMuaW5wdXRTZWNvbmRDaGVjaykudmFsKCkudHJpbSgpO1xyXG4gICAgY29uc3QgdGhpcmQgPSAkKHRoaXMuaW5wdXRUaGlyZENoZWNrKS52YWwoKS50cmltKCk7XHJcbiAgICBjb25zdCBmb3JtID0gJCh0aGlzLnNldHRpbmdGcm9tKTtcclxuICAgIGxldCBlcnJvck5hbWUgPSAnJztcclxuICAgIGxldCBlcnJvciA9IGZhbHNlO1xyXG5cclxuICAgIFV0aWxzLmNsZWFyRmllbGRzKCk7XHJcbiAgICAvL2NoZWNrIGZvciBlbXB0eSBmaWVsZHNcclxuICAgIGlmICghZmlyc3QpIHtcclxuICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKSk7XHJcbiAgICAgIGVycm9yTmFtZSA9ICdlbXB0eSc7XHJcbiAgICB9IGVsc2UgaWYgKCFzZWNvbmQpIHtcclxuICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKSk7XHJcbiAgICAgIGVycm9yTmFtZSA9ICdlbXB0eSc7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlyZCkge1xyXG4gICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpKTtcclxuICAgICAgZXJyb3JOYW1lID0gJ2VtcHR5JztcclxuICAgIH0gZWxzZSB7IC8vb25seSBkaWdpdHMgaXMgdmFsaWRcclxuICAgICAgaWYgKCFVdGlscy5pc051bWJlcihmaXJzdCkpIHtcclxuICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpKTtcclxuICAgICAgICBlcnJvck5hbWUgPSAnbnVtYmVyJztcclxuICAgICAgfTtcclxuICAgICAgaWYgKCFVdGlscy5pc051bWJlcihzZWNvbmQpKSB7XHJcbiAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKSk7XHJcbiAgICAgICAgZXJyb3JOYW1lID0gJ251bWJlcic7XHJcbiAgICAgIH07XHJcbiAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIodGhpcmQpKSB7XHJcbiAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKSk7XHJcbiAgICAgICAgZXJyb3JOYW1lID0gJ251bWJlcic7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBpZiAoZXJyb3IpIHsgLy9zaG93IGVycm9yIGlmIGFueVxyXG4gICAgICBjb25zdCBlcnJvclR4dCA9ICgnZW1wdHknID09PSBlcnJvck5hbWUpID8gbG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5lcnJvckVtcHR5IDogbG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5lcnJvclZhbGlkO1xyXG4gICAgICAkKHRoaXMuZXJyb3JTZXR0aW5ncykucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpLnRleHQoZXJyb3JUeHQpO1xyXG4gICAgfSBlbHNlIHsgLy9vdGhlcndpc2Ugc2F2ZSBuZXcgc2V0dGluZ3NcclxuICAgICAgc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgZmlyc3QsXHJcbiAgICAgICAgc2Vjb25kLFxyXG4gICAgICAgIHRoaXJkXHJcbiAgICAgIH07XHJcbiAgICAgIExXLnB1dFNldHRpbmdzKHNldHRpbmdzKTtcclxuICAgICAgJCh0aGlzLmVycm9yU2V0dGluZ3MpLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKS50ZXh0KGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JObyk7XHJcblxyXG4gICAgICB0aGlzLnBhcmFtcyA9IHNldHRpbmdzOyAvL3N0b3JlIGxvY2FsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAgIGNhbmNlbFNldHRpbmcoKSB7XHJcbiAgICAgIFV0aWxzLmNsZWFyRmllbGRzKCk7XHJcbiAgICAgIHRoaXMuZ2V0U2V0dGluZ3MoKTtcclxuICAgIH1cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gdXRpbHMuanNcclxuICogY29kZWQgYnkgQW5hdG9saWkgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGUxcjBuZC5jcmdAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxudmFyIFV0aWxzID0ge307XHJcblxyXG5VdGlscyA9IHtcclxuICBpc051bWJlcihzdHIsIHdpdGhEb3QpIHtcclxuICAgIC8vdmFsaWRhdGUgZmlsZWQgZm9yIG51bWJlciB2YWx1ZVxyXG4gICAgY29uc3QgTnVtYmVyUmVnID0gL15cXGQrJC87XHJcbiAgICBjb25zdCBOdW1iZXJXaXRoRG90UmVnID0gL15bLStdP1swLTldKlxcLj9bMC05XSskLztcclxuXHJcbiAgICByZXR1cm4gd2l0aERvdCA/IE51bWJlcldpdGhEb3RSZWcudGVzdChzdHIpIDogTnVtYmVyUmVnLnRlc3Qoc3RyKTtcclxuICB9LFxyXG5cclxuICBjbGVhckZpZWxkcygpIHtcclxuICAgICQoJy5mb3JtLWdyb3VwJykuZWFjaCgoaSwgbm9kZSkgPT4geyAvL2NsZWFyIGFsbCBlcnJvciBzdHlsZXNcclxuICAgICAgJChub2RlKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XHJcbiAgICB9KTtcclxuICAgICQoJyNlcnJvclNldHRpbmdzJykuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gIH0sXHJcblxyXG4gIHNldEZpZWxkRXJyb3Ioc2VsZikgeyAvL3NldCB0aGUgZXJyb3Igc3R5bGUgZm9yIHRoZSBjdXJyZW50IGlucHV0IGZpZWxkXHJcbiAgICAkKHNlbGYpLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0sXHJcblxyXG4gIGdldFJhbmRvbUludChtaW4sIG1heCkge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgfSxcclxuXHJcbiAgZ2V0VG9kYXkoZnVsbERhdGUpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgaWYgKGZ1bGxEYXRlKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCkpLnZhbHVlT2YoKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjbG9zZU1vYk1lbnUoKSB7XHJcbiAgICBpZiAoJCgnI2JzLWV4YW1wbGUtbmF2YmFyLWNvbGxhcHNlLTEnKS5oYXNDbGFzcygnaW4nKSkge1xyXG4gICAgICAkKCcjbmF2YmFyVG9nZ2xlJykuY2xpY2soKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBzaHVmZmxlKGEpIHtcclxuICAgIGxldCBqO1xyXG4gICAgbGV0IHg7XHJcbiAgICBsZXQgaTtcclxuICAgIGZvciAoaSA9IGEubGVuZ3RoOyBpOyBpLS0pIHtcclxuICAgICAgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGkpO1xyXG4gICAgICB4ID0gYVtpIC0gMV07XHJcbiAgICAgIGFbaSAtIDFdID0gYVtqXTtcclxuICAgICAgYVtqXSA9IHg7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICE9IG51bGwpIHtcclxuICAgIGV4cG9ydHMuVXRpbHMgPSBVdGlscztcclxufVxyXG5cclxuZXhwb3J0IHtVdGlsc307XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy91dGlscy91dGlscy5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyBtZW1vcnlzdG9yZS5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIEphbnVhcnkgMjAxN1xyXG4gKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gYS5tZXJlemhhbnlpQGdtYWlsLmNvbVxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5leHBvcnQgY29uc3QgTWVtb3J5c3RvcmUgPSBbXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MScsXHJcbiAgICAnd29yZCc6ICdkYXMgQXV0bycsXHJcbiAgICAndHJhbnNsYXRlJzogJ2NhcicsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDInLFxyXG4gICAgJ3dvcmQnOiAnbGF1ZmVuJyxcclxuICAgICd0cmFuc2xhdGUnOiAncnVuJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MycsXHJcbiAgICAnd29yZCc6ICdhbHQnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdvbGQnLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg0JyxcclxuICAgICd3b3JkJzogJ2tyYW5rJyxcclxuICAgICd0cmFuc2xhdGUnOiAnc2ljaycsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LCB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg1JyxcclxuICAgICd3b3JkJzogJ2hldXRlJyxcclxuICAgICd0cmFuc2xhdGUnOiAndG9kYXknLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSwge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4NicsXHJcbiAgICAnd29yZCc6ICdzY2hyZWliZW4nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICd3cml0ZScsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LCB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg3JyxcclxuICAgICd3b3JkJzogJ2hlbGwnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdsaWdodCcsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDgnLFxyXG4gICAgJ3dvcmQnOiAncmVpY2gnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdyaWNoJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4OScsXHJcbiAgICAnd29yZCc6ICdzw7zDnycsXHJcbiAgICAndHJhbnNsYXRlJzogJ3N3ZWV0JyxcclxuICAgICdzdGVwJzogMSxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MTAnLFxyXG4gICAgJ3dvcmQnOiAnd2VpYmxpY2gnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdmZW1hbGUnLFxyXG4gICAgJ3N0ZXAnOiAxLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSwge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MTEnLFxyXG4gICAgJ3dvcmQnOiAnYmVzdGVsbGVuJyxcclxuICAgICd0cmFuc2xhdGUnOiAnb3JkZXInLFxyXG4gICAgJ3N0ZXAnOiAxLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgxMicsXHJcbiAgICAnd29yZCc6ICdrYWx0JyxcclxuICAgICd0cmFuc2xhdGUnOiAnY29sZCcsXHJcbiAgICAnc3RlcCc6IDIsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDEzJyxcclxuICAgICd3b3JkJzogJ3NhdWVyJyxcclxuICAgICd0cmFuc2xhdGUnOiAnc291cicsXHJcbiAgICAnc3RlcCc6IDIsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDE0JyxcclxuICAgICd3b3JkJzogJ2ZsaWVnZW4nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdmbHknLFxyXG4gICAgJ3N0ZXAnOiAzLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfVxyXG5dO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvdXRpbHMvbWVtb3J5c3RvcmUuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gbmF2aWdhdGlvbi5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscyc7XHJcbmxldCBOYXZpZ2F0aW9uID0ge307XHJcblxyXG5OYXZpZ2F0aW9uID0ge1xyXG4gIGhhc2hndWFyZChpbml0KSB7IC8vb25IYXNoQ2hhbmdlXHJcbiAgICBpZiAoaW5pdCkge1xyXG4gICAgICB0aGlzLmhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmhhc2ggIT09IHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XHJcbiAgICAgICQod2luZG93KS50cmlnZ2VyKCdoYXNoYnJlYWsnLCB7XHJcbiAgICAgICAgJ3ByZXZoYXNoJzogdGhpcy5oYXNoXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQodGhpcy5oYXNoZ3VhcmQuYmluZCh0aGlzKSwgNTApO1xyXG4gIH0sXHJcblxyXG4gIGhhc2hicmVhaygpIHsgLy9oYXNoY2hhbmdlIGV2ZW50XHJcbiAgICBjb25zdCBoYXNoVXJsID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMyk7XHJcblxyXG4gICAgaWYgKGhhc2hVcmwpIHtcclxuICAgICAgJChgW2RhdGEtdGFyZ2V0PSR7d2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMyl9XWApLmNsaWNrKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCdbZGF0YS10YXJnZXQ9c3VtbWFyeV0nKS5jbGljaygpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG5hdlNlbGVjdCgpIHtcclxuICAgICQoJ1tkYXRhLXRvZ2dsZT1uYXZdJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgfSk7XHJcbiAgICAkKCdbZGF0YS10eXBlPW5hdi1zZWxlY3QtbGldJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoYCMkeyQodGhpcykuZGF0YSgndGFyZ2V0Jyl9YCkucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgVXRpbHMuY2xvc2VNb2JNZW51KCk7XHJcbiAgfSxcclxuXHJcbiAgaW5pdCgpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJ1tkYXRhLXR5cGU9bmF2LXNlbGVjdF0nLCB0aGlzLm5hdlNlbGVjdCk7XHJcbiAgICAkKHdpbmRvdykuYmluZCgnaGFzaGJyZWFrJywgdGhpcy5oYXNoYnJlYWspO1xyXG4gICAgdGhpcy5oYXNoZ3VhcmQoZmFsc2UpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCB7TmF2aWdhdGlvbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy91dGlscy9uYXZpZ2F0aW9uLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIGxvY2FsLmpzXHJcbiAqIGNvZGVkIGJ5IEFuYXRvbCBNYXJlemhhbnlpIGFrYSBlMXIwbmQvL1tDUkddIC0gTWFyY2ggMjAxNFxyXG4gKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gYS5tZXJlemhhbnlpQGdtYWlsLmNvbVxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuLi91dGlscy9MVyc7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuXHJcbmNvbnNvbGUubG9nKCdkZWZpbmUgbG9jYWwnKTtcclxuY29uc3QgbG9jYWwgPSB7XHJcbiAgZW5fR0I6IHtcclxuICAgIHN1bW1hcnk6ICdTdW1tYXJ5JyxcclxuICAgIGxlYXJuOiAnTGVhcm4nLFxyXG4gICAgcmVwZWF0OiAnUmVwZWF0JyxcclxuICAgIHZvY2FidWxhcnk6ICdWb2NhYnVsYXJ5JyxcclxuICAgIHNldHRpbmdzOiAnU2V0dGluZ3MnLFxyXG4gICAgZWRpdFdvcmRzOiAnRWRpdCB3b3JkcycsXHJcbiAgICBmaXJzdDogJ0ZpcnN0JyxcclxuICAgIHNlY29uZDogJ1NlY29uZCcsXHJcbiAgICB0aGlyZDogJ1RoaXJkJyxcclxuICAgIHNhdmVCdG46ICdTYXZlJyxcclxuICAgIGNhbmNlbEJ0bjogJ0NhbmNlbCcsXHJcbiAgICBsYW5ndWFnZTogJ0xhbmd1YWdlJyxcclxuICAgIGVuX0dCOiAnZW5nbGlzaCcsXHJcbiAgICBkZV9ERTogJ2RldXRzY2gnLFxyXG4gICAgcnVfUlU6ICfRgNGD0YHRgdC60LjQuScsXHJcbiAgICBlcnJvckVtcHR5OiAnQWxsIGZpZWxkcyBhcmUgcmVxdWlyZWQuJyxcclxuICAgIGVycm9yVmFsaWQ6ICdFbnRlcmVkIHZhbHVlcyBhcmUgaW5jb3JyZWN0LicsXHJcbiAgICBlcnJvck5vOiAnTmV3IHNldHRpbmdzIHdhcyBzYXZlZC4nLFxyXG4gICAgZXJyb3JOb1c6ICdOZXcgd29yZCB3YXMgYWRkZWQuJyxcclxuICAgIHRvdGFsV29yZHM6ICdUb3RhbCB3b3JkcycsXHJcbiAgICBsZWFybldvcmRzTnVtOiAnV29yZHMgdG8gbGVhcm4nLFxyXG4gICAgcmVwZWF0V29yZHM6ICdXb3JkcyB0byByZXBlYXQnLFxyXG4gICAgcmVtZW1iZXJCdG46ICdSZW1lbWJlcicsXHJcbiAgICByZXBlYXRCdG46ICdSZXBlYXQnLFxyXG4gICAga25vd25CdG46ICdLbm93JyxcclxuICAgIGFsbFdvcmRzT2s6ICdObyBtb3JlIHdvcmRzIGZvciBsZWFybmluZy4nLFxyXG4gICAgaW5wdXRXb3JkTGJsOiAnV29yZCcsXHJcbiAgICBpbnB1dFRyYW5zbGF0ZUxibDogJ1RyYW5zbGF0ZScsXHJcbiAgICBlbnRlckJ0bjogJ0NoZWNrJyxcclxuICAgIGFsbFdvcmRzRG9uZTogJ05vIG1vcmUgd29yZHMgZm9yIHJlcGVhdC4nXHJcbiAgfSxcclxuXHJcbiAgcnVfUlU6IHtcclxuICAgIHN1bW1hcnk6ICfQodCy0L7QtNC60LAnLFxyXG4gICAgbGVhcm46ICfQo9GH0LjRgtGMJyxcclxuICAgIHJlcGVhdDogJ9Cf0L7QstGC0L7RgNGP0YLRjCcsXHJcbiAgICB2b2NhYnVsYXJ5OiAn0KHQu9C+0LLQsNGA0YwnLFxyXG4gICAgc2V0dGluZ3M6ICfQndCw0YHRgtGA0L7QudC60LgnLFxyXG4gICAgZWRpdFdvcmRzOiAn0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Ywg0YHQu9C+0LLQsCcsXHJcbiAgICBmaXJzdDogJ9Cf0LXRgNCy0YvQuScsXHJcbiAgICBzZWNvbmQ6ICfQktGC0L7RgNC+0LknLFxyXG4gICAgdGhpcmQ6ICfQotGA0LXRgtC40LknLFxyXG4gICAgc2F2ZUJ0bjogJ9Ch0L7RhdGA0LDQvdC40YLRjCcsXHJcbiAgICBjYW5jZWxCdG46ICfQntGC0LzQtdC90LjRgtGMJyxcclxuICAgIGxhbmd1YWdlOiAn0K/Qt9GL0LonLFxyXG4gICAgZW5fR0I6ICdlbmdsaXNoJyxcclxuICAgIGRlX0RFOiAnZGV1dHNjaCcsXHJcbiAgICBydV9SVTogJ9GA0YPRgdGB0LrQuNC5JyxcclxuICAgIGVycm9yRW1wdHk6ICfQktGB0LUg0L/QvtC70Y8g0L7QsdGP0LfQsNGC0LXQu9GM0L3Riy4nLFxyXG4gICAgZXJyb3JWYWxpZDogJ9CS0LLQtdC00LXQvdC90YvQtSDQt9C90LDRh9C10L3QuNGPINC90LXQstCw0LvQuNC00L3Riy4nLFxyXG4gICAgZXJyb3JObzogJ9Cd0L7QstGL0LUg0LfQvdCw0YfQtdC90LjQtSDQsdGL0LvQuCDQt9Cw0L/QuNGB0LDQvdGLLicsXHJcbiAgICBlcnJvck5vVzogJ9Cd0L7QstC+0LUg0YHQu9C+0LLQviDQtNC+0LHQsNCy0LvQtdC90L4uJyxcclxuICAgIHRvdGFsV29yZHM6ICfQktGB0LXQs9C+INGB0LvQvtCyJyxcclxuICAgIGxlYXJuV29yZHNOdW06ICfQodC70L7QsiDRg9GH0LjRgtGMJyxcclxuICAgIHJlcGVhdFdvcmRzOiAn0KHQtdCz0L7QtNC90Y8g0L/QvtGC0L7RgNC40YLRjCDRgdC70L7QsicsXHJcbiAgICByZW1lbWJlckJ0bjogJ9CX0LDQv9C+0LzQvdC40LsnLFxyXG4gICAgcmVwZWF0QnRuOiAn0J/QvtCy0YLQvtGA0LjRgtGMJyxcclxuICAgIGtub3duQnRuOiAn0JfQvdCw0Y4nLFxyXG4gICAgYWxsV29yZHNPazogJ9Cd0LXRgiDQsdC+0LvRjNGI0LUg0YHQu9C+0LIg0LTQu9GPINC40LfRg9GH0LXQvdC40Y8uJyxcclxuICAgIGlucHV0V29yZExibDogJ9Ch0LvQvtCy0L4nLFxyXG4gICAgaW5wdXRUcmFuc2xhdGVMYmw6ICfQn9C10YDQtdCy0L7QtCcsXHJcbiAgICBlbnRlckJ0bjogJ9Cf0YDQvtCy0LXRgNC40YLRjCcsXHJcbiAgICBhbGxXb3Jkc0RvbmU6ICfQndC10YIg0LHQvtC70YzRiNC1INGB0LvQvtCyINC00LvRjyDQv9C+0LLRgtC+0YDQtdC90LjRjy4nXHJcbiAgfSxcclxuXHJcbiAgZGVfREU6IHtcclxuICAgIHN1bW1hcnk6ICdTdW1tZScsXHJcbiAgICBsZWFybjogJ0xlcm5lbicsXHJcbiAgICByZXBlYXQ6ICdXaWVkZXJob2xlbicsXHJcbiAgICB2b2NhYnVsYXJ5OiAnVm9rYWJ1bGFyJyxcclxuICAgIHNldHRpbmdzOiAnUmFobWVuJyxcclxuICAgIGVkaXRXb3JkczogJ1fDtnJ0ZXIgw6RuZGVybicsXHJcbiAgICBmaXJzdDogJ0Vyc3RlJyxcclxuICAgIHNlY29uZDogJ1p3ZWl0ZScsXHJcbiAgICB0aGlyZDogJ0RyaXR0ZScsXHJcbiAgICBzYXZlQnRuOiAnU3BlaWNoZXJuJyxcclxuICAgIGNhbmNlbEJ0bjogJ1N0b3JuaWVyZW4nLFxyXG4gICAgbGFuZ3VhZ2U6ICdTcHJhY2hlJyxcclxuICAgIGVuX0dCOiAnZW5nbGlzaCcsXHJcbiAgICBkZV9ERTogJ2RldXRzY2gnLFxyXG4gICAgcnVfUlU6ICfRgNGD0YHRgdC60LjQuScsXHJcbiAgICBlcnJvckVtcHR5OiAnQWxsZSBGZWxkZXIgc2luZCBlcmZvcmRlcmxpY2guJyxcclxuICAgIGVycm9yVmFsaWQ6ICdFaW5nZWdlYmVuZSBXZXJ0ZSBzaW5kIGZhbHNjaC4nLFxyXG4gICAgZXJyb3JObzogJ05ldWUgRWluc3RlbGx1bmdlbiBnZXNwZWljaGVydCB3dXJkZS4nLFxyXG4gICAgZXJyb3JOb1c6ICdOZXVlcyBXb3J0IGhpbnp1Z2Vmw7xndC4nLFxyXG4gICAgdG90YWxXb3JkczogJ0luc2dlc2FtdCBXb3J0ZScsXHJcbiAgICBsZWFybldvcmRzTnVtOiAnV8O2cnRlciB6dSBsZXJuZW4nLFxyXG4gICAgcmVwZWF0V29yZHM6ICdXb3J0ZSB6dSB3aWVkZXJob2xlbicsXHJcbiAgICByZW1lbWJlckJ0bjogJ01lcmtlbicsXHJcbiAgICByZXBlYXRCdG46ICdXaWVkZXJob2xlbicsXHJcbiAgICBrbm93bkJ0bjogJ1dpc3NlbicsXHJcbiAgICBhbGxXb3Jkc09rOiAnS2VpbmUgV29ydGUgbWVociBmw7xyIGRhcyBMZXJuZW4uJyxcclxuICAgIGlucHV0V29yZExibDogJ1dvcnQnLFxyXG4gICAgaW5wdXRUcmFuc2xhdGVMYmw6ICfDnGJlcnNldHplbicsXHJcbiAgICBlbnRlckJ0bjogJ1Byw7xmZW4nLFxyXG4gICAgYWxsV29yZHNEb25lOiAnS2VpbmUgV29ydGUgbWVociBmw7xyIHdpZWRlcmhvbGVuLidcclxuICB9LFxyXG5cclxuICBjaGFuZ2VMb2NhbENvbnRlbnQoKSB7XHJcbiAgICAvLyBjaGFuZ2UgaW5uZXIgY29udGVudFxyXG4gICAgY29uc3QgbGFuZ05vZGUgPSAkKCdbZGF0YS10b2dnbGU9bGFuZ10nKTtcclxuXHJcbiAgICBjb25zdCBsYW5nU2VsZWN0ID0gJCgnW2RhdGEtdHlwZT1sYW5nLXNlbGVjdF0nKTtcclxuXHJcbiAgICAkKGxhbmdOb2RlKS5lYWNoKChpLCBub2RlKSA9PiB7XHJcbiAgICAgICQobm9kZSkudGV4dChsb2NhbFtsb2NhbC5jdXJyZW50TG9jYWxdWyQobm9kZSkuZGF0YSgnbGFuZycpXSk7XHJcbiAgICB9KTtcclxuICAgICQobGFuZ1NlbGVjdCkuZWFjaCgoaSwgbm9kZSkgPT4ge1xyXG4gICAgICAkKG5vZGUpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgbGFuZ1NlbGVjdCgpIHsgLy9jaGFuZ2UgbG9jYWxpemF0aW9uXHJcbiAgICBsb2NhbC5jdXJyZW50TG9jYWwgPSAkKHRoaXMpLmRhdGEoJ2xhbmcnKTtcclxuICAgICQoJyNsYW5nU2VsZWN0JykuY2xpY2soKTtcclxuICAgICQoJy5uYXZiYXItdG9nZ2xlOnZpc2libGUnKS5jbGljaygpO1xyXG4gICAgbG9jYWwuY2hhbmdlTG9jYWxDb250ZW50KCk7XHJcbiAgICBMVy5zdG9yZUl0ZW0oYCR7TFcubmFtZX0tbGFuZ3VhZ2VgLCBsb2NhbC5jdXJyZW50TG9jYWwpO1xyXG4gICAgJCh0aGlzKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG5cclxuICBpbml0KCkge1xyXG4gICAgLy8gdmFyIHNldHRpbmdzID0gTFcuZ2V0U2V0dGluZ3MoKTsgLy8gdG8gZm9yY2UgaW5pdGlhbGlzYXRpb24uXHJcbiAgICB0aGlzLmN1cnJlbnRMb2NhbCA9IExXLnJlYWRJdGVtKGAke0xXLm5hbWV9LWxhbmd1YWdlYCk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICdbZGF0YS10eXBlPWxhbmctc2VsZWN0XScsIGxvY2FsLmxhbmdTZWxlY3QpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCB7bG9jYWx9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvbG9jYWwvbG9jYWwuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gdm9jYWJ1bGFyeS5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGUxcjBuZC5jcmdAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCBMV0NsYXNzIGZyb20gJy4uL3V0aWxzL0xXJztcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuLy4uL3V0aWxzL3V0aWxzJztcclxuaW1wb3J0IHtMZWFybn0gZnJvbSAnLi9sZWFybic7XHJcbmltcG9ydCB7UmVwZWF0fSBmcm9tICcuL3JlcGVhdCc7XHJcblxyXG5pbXBvcnQgcm93VGVtcGxhdGUgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9yb3ctd29yZC9yb3ctd29yZC5odG1sJztcclxuXHJcbmNvbnN0IFZvY2FidWxhcnkgPSB7XHJcbiAgcm93VGVtcGxhdGU6IHJvd1RlbXBsYXRlLFxyXG5cclxuICB0b3RhbFdvcmRzTnVtOiAkKCcjdG90YWxXb3Jkc051bScpLFxyXG4gIHZvY2FidWxhcnlCb3g6ICQoJyN2b2NhYnVsYXJ5Qm94JyksXHJcbiAgZXJyb3JWb2NhYnVsYXJ5Qm94OiAkKCcjZXJyb3JWb2NhYnVsYXJ5Qm94JyksXHJcbiAgZXJyb3JWb2NhYnVsYXJ5OiAkKCcjZXJyb3JWb2NhYnVsYXJ5JyksXHJcbiAgaW5wdXRXb3JkVHh0OiAkKCcjaW5wdXRXb3JkVHh0JyksXHJcbiAgaW5wdXRUcmFuc2xhdGU6ICQoJyNpbnB1dFRyYW5zbGF0ZScpLFxyXG4gIGFkZFdvcmRGb3JtOiAkKCcjYWRkV29yZEZvcm0nKSxcclxuXHJcbiAgd29yZHM6IFtdLFxyXG4gIHRyYW5zbGF0ZXM6IFtdLFxyXG5cclxuICByZWNvdW50VG90YWwoKSB7XHJcbiAgICAkKFZvY2FidWxhcnkudG90YWxXb3Jkc051bSkudGV4dChMVy5pbmRleC5sZW5ndGgpO1xyXG4gIH0sXHJcblxyXG4gIHJlbW92ZVdvcmQoc2VsZiwgbm90UmVpbmRleCkge1xyXG4gICAgLy9yZW1vdmUgd29yZCBmcm9tIHZvY2FidWxhcnlcclxuICAgIGNvbnN0IGlkID0gJChzZWxmKS5kYXRhKCdpZCcpO1xyXG5cclxuICAgIGNvbnN0IG5vZGUgPSAkKHNlbGYpLmRhdGEoJ25vZGUnKTtcclxuXHJcbiAgICBpZiAoIW5vdFJlaW5kZXgpIHtcclxuICAgICAgTFcuaW5kZXguc3BsaWNlKGlkLCAxKTsgLy9yZW1vdmUgZnJvbSBpbmRleFxyXG4gICAgICBMVy5zdG9yZUl0ZW0oYCR7TFcubmFtZX0td29yZHNgLCBMVy5pbmRleC5qb2luKCkpO1xyXG4gICAgfVxyXG4gICAgTFcucmVtb3ZlSXRlbShgJHtMVy5uYW1lfS0ke25vZGV9YCk7IC8vcmVtb3ZlIHRoaXMgd29yZFxyXG4gICAgJChgIyR7bm9kZX1gKS5yZW1vdmUoKTtcclxuICAgICQoYCMke25vZGV9RWRpdGApLnJlbW92ZSgpO1xyXG4gICAgVm9jYWJ1bGFyeS5yZWNvdW50VG90YWwoKTtcclxuICAgIExlYXJuLndvcmRzTGVhcm4gPSBbXTtcclxuICAgIExlYXJuLnJlY291bnRJbmRleExlYXJuKCk7XHJcbiAgICBSZXBlYXQud29yZHNSZXBlYXQgPSB7XHJcbiAgICAgIGN1cnJlbnRJbmRleEZpcnN0OiAwLFxyXG4gICAgICBmaXJzdDogW10sXHJcbiAgICAgIGN1cnJlbnRJbmRleFNlY29uZDogMCxcclxuICAgICAgc2Vjb25kOiBbXSxcclxuICAgICAgY3VycmVudEluZGV4VGhpcmQ6IDAsXHJcbiAgICAgIHRoaXJkOiBbXVxyXG4gICAgfTtcclxuICAgIFJlcGVhdC5yZWNvdW50SW5kZXhSZXBlYXQoKTtcclxuICB9LFxyXG5cclxuICB2aWV3V29yZCgpIHtcclxuICAgIGxldCBjb250ZW50SW5uZXIgPSAnJztcclxuXHJcbiAgICAkKExXLmluZGV4KS5lYWNoKChpbmRleCwgbm9kZSkgPT4ge1xyXG4gICAgICBsZXQgdHh0O1xyXG4gICAgICBsZXQgdHJhbnNsYXRlO1xyXG4gICAgICBjb25zdCBpdGVtID0gTFcucmVhZEl0ZW0oYCR7TFcubmFtZX0tJHtub2RlfWApO1xyXG4gICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgIHR4dCA9IGl0ZW0ud29yZDtcclxuICAgICAgICB0cmFuc2xhdGUgPSBpdGVtLnRyYW5zbGF0ZTtcclxuXHJcbiAgICAgICAgVm9jYWJ1bGFyeS53b3Jkcy5wdXNoKHR4dCk7XHJcbiAgICAgICAgVm9jYWJ1bGFyeS50cmFuc2xhdGVzLnB1c2godHJhbnNsYXRlKTtcclxuICAgICAgICBjb250ZW50SW5uZXIgKz0gVm9jYWJ1bGFyeS5yb3dUZW1wbGF0ZS5yZXBsYWNlKC97e25vZGV9fS9nLCBub2RlKS5yZXBsYWNlKC97e3R4dH19L2csIHR4dCkucmVwbGFjZSgve3t0cmFuc2xhdGV9fS9nLCB0cmFuc2xhdGUpLnJlcGxhY2UoL3t7aW5kZXh9fS9nLCBpbmRleCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoVm9jYWJ1bGFyeS52b2NhYnVsYXJ5Qm94KS5odG1sKGNvbnRlbnRJbm5lcik7XHJcbiAgICBWb2NhYnVsYXJ5LnJlY291bnRUb3RhbCgpO1xyXG4gIH0sXHJcblxyXG4gIGFkZFNhdmVXb3JkKHdvcmRUeHQsIHRyYW5zbGF0ZSwgYWRkRm9ybSwgYWRkV29yZCkge1xyXG4gICAgY29uc3QgaW5wdXRXb3JkID0gd29yZFR4dC52YWwoKS50cmltKCk7XHJcbiAgICBjb25zdCBpbnB1dFRyYW5zbGF0ZSA9IHRyYW5zbGF0ZS52YWwoKS50cmltKCk7XHJcbiAgICBjb25zdCBmb3JtID0gYWRkRm9ybTtcclxuICAgIGxldCBlcnJvciA9IGZhbHNlO1xyXG4gICAgbGV0IHdvcmQgPSB7fTtcclxuXHJcbiAgICBVdGlscy5jbGVhckZpZWxkcygpO1xyXG4gICAgLy9jaGVjayBmb3IgZW1wdHkgZmllbGRzXHJcbiAgICBpZiAoIWlucHV0V29yZCkge1xyXG4gICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykpO1xyXG4gICAgfSBlbHNlIGlmICghaW5wdXRUcmFuc2xhdGUpIHtcclxuICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpKTtcclxuICAgIH1cclxuICAgIGlmIChlcnJvcikgeyAvL3Nob3cgZXJyb3IgaWYgYW55XHJcbiAgICAgICQoVm9jYWJ1bGFyeS5lcnJvclZvY2FidWxhcnlCb3gpLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgICAgJChWb2NhYnVsYXJ5LmVycm9yVm9jYWJ1bGFyeSkudGV4dChsb2NhbFtsb2NhbC5jdXJyZW50TG9jYWxdLmVycm9yRW1wdHkpO1xyXG4gICAgfSBlbHNlIHsgLy9vdGhlcndpc2Ugc2F2ZSBuZXcgd29yZCB0byBWb2NhYnVsYXJ5XHJcbiAgICAgIGxldCBuZXdJbmRleFZhbDtcclxuICAgICAgY29uc3QgdG9kYXlEYXRlID0gVXRpbHMuZ2V0VG9kYXkodHJ1ZSk7XHJcbiAgICAgIHdvcmQgPSB7XHJcbiAgICAgICAgaW5kZXg6IHRvZGF5RGF0ZSxcclxuICAgICAgICB3b3JkOiBpbnB1dFdvcmQsXHJcbiAgICAgICAgdHJhbnNsYXRlOiBpbnB1dFRyYW5zbGF0ZSxcclxuICAgICAgICBzdGVwOiAwLFxyXG4gICAgICAgIGRhdGU6IDBcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIHNhdmUgbmV3bHkgYWRkZWQgd29yZFxyXG4gICAgICBuZXdJbmRleFZhbCA9IGBpbmRleCR7TFcuaW5kZXgubGVuZ3RoICsgMX1gO1xyXG4gICAgICBMVy5zdG9yZUl0ZW0oYCR7TFcubmFtZX0tJHtuZXdJbmRleFZhbH1gLCB3b3JkKTtcclxuXHJcbiAgICAgIGNvbnN0IGNvbnRlbnRJbm5lciA9IFZvY2FidWxhcnkucm93VGVtcGxhdGUucmVwbGFjZSgve3tub2RlfX0vZywgdG9kYXlEYXRlKS5yZXBsYWNlKC97e3R4dH19L2csIGlucHV0V29yZCkucmVwbGFjZSgve3t0cmFuc2xhdGV9fS9nLCBpbnB1dFRyYW5zbGF0ZSkucmVwbGFjZSgve3tpbmRleH19L2csIChhZGRXb3JkKSA/IExXLmluZGV4Lmxlbmd0aCA6IExXLmluZGV4LmluZGV4T2YoaW5wdXRXb3JkKSk7XHJcblxyXG4gICAgICBpZiAoYWRkV29yZCkge1xyXG4gICAgICAgIExXLmluZGV4LnB1c2gobmV3SW5kZXhWYWwpO1xyXG4gICAgICAgIHdvcmRUeHQudmFsKCcnKTtcclxuICAgICAgICB0cmFuc2xhdGUudmFsKCcnKTtcclxuICAgICAgICAkKFZvY2FidWxhcnkuZXJyb3JWb2NhYnVsYXJ5Qm94KS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICAgICAgJChWb2NhYnVsYXJ5LmVycm9yVm9jYWJ1bGFyeSkudGV4dChsb2NhbFtsb2NhbC5jdXJyZW50TG9jYWxdLmVycm9yTm9XKTtcclxuICAgICAgICAkKFZvY2FidWxhcnkudm9jYWJ1bGFyeUJveCkuYXBwZW5kKGNvbnRlbnRJbm5lcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgaWQgPSB3b3JkVHh0LmF0dHIoJ2lkJykuc2xpY2UoNSk7XHJcblxyXG4gICAgICAgIExXLmluZGV4W0xXLmluZGV4LmluZGV4T2YoaWQpXSA9IG5ld0luZGV4VmFsO1xyXG4gICAgICAgICQoYCMke2lkfWApLmJlZm9yZShjb250ZW50SW5uZXIpO1xyXG4gICAgICAgIFZvY2FidWxhcnkucmVtb3ZlV29yZCgkKGAjZGVsLSR7aWR9YCksIHRydWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBMVy5zdG9yZUl0ZW0oYCR7TFcubmFtZX0td29yZHNgLCBMVy5pbmRleC5qb2luKCkpOyAvL2FkZCB3b3JkIHRvIFZvY2FidWxhcnkgbGlzdFxyXG4gICAgICBVdGlscy5jbGVhckZpZWxkcygpO1xyXG4gICAgICBWb2NhYnVsYXJ5LnJlY291bnRUb3RhbCgpO1xyXG4gICAgICBMZWFybi53b3Jkc0xlYXJuID0gW107XHJcbiAgICAgIExlYXJuLnJlY291bnRJbmRleExlYXJuKCk7XHJcbiAgICAgIExlYXJuLnNob3dXb3JkKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgaW5pdCgpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJyNhZGRCdG4nLCAoKSA9PiB7XHJcbiAgICAgIFZvY2FidWxhcnkuYWRkU2F2ZVdvcmQoJChWb2NhYnVsYXJ5LmlucHV0V29yZFR4dCksICQoVm9jYWJ1bGFyeS5pbnB1dFRyYW5zbGF0ZSksICQoVm9jYWJ1bGFyeS5hZGRXb3JkRm9ybSksIHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcuanMtZWRpdC1idG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoYCMkeyQodGhpcykuZGF0YSgnbm9kZScpfWApLmhpZGUoKTtcclxuICAgICAgJChgIyR7JCh0aGlzKS5kYXRhKCdub2RlJyl9RWRpdGApLnNob3coKTtcclxuICAgIH0pO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLmpzLXNhdmUtYnRuJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBWb2NhYnVsYXJ5LmFkZFNhdmVXb3JkKCQoYCN3b3JkLSR7JCh0aGlzKS5kYXRhKCdub2RlJyl9YCksICQoYCN0cmFuc2xhdGUtJHskKHRoaXMpLmRhdGEoJ25vZGUnKX1gKSwgJChgI2Zvcm0tJHskKHRoaXMpLmRhdGEoJ25vZGUnKX1gKSk7XHJcbiAgICB9KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJy5qcy1kZWwtYnRuJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBWb2NhYnVsYXJ5LnJlbW92ZVdvcmQodGhpcyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQge1ZvY2FidWxhcnl9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvYWN0aW9ucy92b2NhYnVsYXJ5LmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gbGVhcm4uanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiAqXHJcbiAqIFVwZGF0ZWQgYnkgSGFubmVzIEhpcnplbCwgTm92ZW1iZXIgMjAxNlxyXG4gKlxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuLi91dGlscy9MVyc7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi8uLi91dGlscy91dGlscyc7XHJcblxyXG5jb25zdCBMZWFybiA9IHtcclxuICB3b3Jkc0xlYXJuOiBbXSxcclxuICBjdXJyZW50SW5kZXg6IDAsXHJcblxyXG4gIGxlYXJuV29yZHNOdW06ICQoJyNsZWFybldvcmRzTnVtJyksXHJcbiAgbGVhcm5Xb3Jkc1RvcE51bTogJCgnI2xlYXJuV29yZHNUb3BOdW0nKSxcclxuICBsZWFybldvcmRzVG9wU051bTogJCgnI2xlYXJuV29yZHNUb3BTTnVtJyksXHJcblxyXG4gIGxlYXJuV29yZDogJCgnI2xlYXJuV29yZCcpLFxyXG4gIHRyYW5zbGF0ZVdvcmQ6ICQoJyN0cmFuc2xhdGVXb3JkJyksXHJcbiAgbGVhcm5Xb3Jkc0dycDogJCgnI2xlYXJuV29yZHNHcnAnKSxcclxuICBub1dvcmRzTGVmdDogJCgnI25vV29yZHNMZWZ0JyksXHJcbiAgYWxsV29yZHNPazogJCgnI2FsbFdvcmRzT2snKSxcclxuXHJcbiAgcmVjb3VudEluZGV4TGVhcm4oKSB7IC8vY291bnQgd29yZHMgdG8gbGVhcm5cclxuICAgIGlmICghTGVhcm4ud29yZHNMZWFybi5sZW5ndGgpIHtcclxuICAgICAgJChMVy5pbmRleCkuZWFjaCgoaW5kZXgsIG5vZGUpID0+IHsgLy90aGUgaW5pdGlhbCBjb3VudGluZ1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBMVy5yZWFkSXRlbShgJHtMVy5uYW1lfS0ke25vZGV9YCk7XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgIGlmICgwID09PSBpdGVtLnN0ZXApIHtcclxuICAgICAgICAgICAgTGVhcm4ud29yZHNMZWFybi5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygnTGVhcm4gcmVjb3VudEluZGV4TGVhcm4nLCBMZWFybi53b3Jkc0xlYXJuKTtcclxuICAgIGNvbnN0IHdvcmRzTGVhcm5MZW5ndGggPSAoTGVhcm4ud29yZHNMZWFybi5sZW5ndGgpID8gTGVhcm4ud29yZHNMZWFybi5sZW5ndGggOiAnJztcclxuXHJcbiAgICAkKGxlYXJuV29yZHNOdW0pLnRleHQod29yZHNMZWFybkxlbmd0aCB8fCAnMCcpO1xyXG4gICAgJChsZWFybldvcmRzVG9wTnVtKS50ZXh0KHdvcmRzTGVhcm5MZW5ndGgpO1xyXG4gICAgJChsZWFybldvcmRzVG9wU051bSkudGV4dCh3b3Jkc0xlYXJuTGVuZ3RoKTtcclxuICB9LFxyXG5cclxuICBzaG93V29yZCgpIHsgLy9zaG93IGEgbmV4dCB3b3JkIHRvIGxlYXJuXHJcbiAgICBpZiAoTGVhcm4ud29yZHNMZWFybi5sZW5ndGgpIHtcclxuICAgICAgJChsZWFybldvcmQpLnRleHQoTGVhcm4ud29yZHNMZWFybltMZWFybi5jdXJyZW50SW5kZXhdLndvcmQpO1xyXG4gICAgICAkKHRyYW5zbGF0ZVdvcmQpLnRleHQoTGVhcm4ud29yZHNMZWFybltMZWFybi5jdXJyZW50SW5kZXhdLnRyYW5zbGF0ZSk7XHJcbiAgICAgICQobGVhcm5Xb3Jkc0dycCkucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKG5vV29yZHNMZWZ0KS5hZGRDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKGFsbFdvcmRzT2spLnRleHQobG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5hbGxXb3Jkc09rKTtcclxuICAgICAgJChub1dvcmRzTGVmdCkucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKGxlYXJuV29yZHNHcnApLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBhY3Rpb25Xb3JkKHN0ZXAsIHJlaW5kZXgpIHtcclxuICAgIGlmIChzdGVwKSB7XHJcbiAgICAgIGNvbnN0IHdvcmQgPSB7XHJcbiAgICAgICAgaW5kZXg6IExlYXJuLndvcmRzTGVhcm5bTGVhcm4uY3VycmVudEluZGV4XS5pbmRleCxcclxuICAgICAgICB3b3JkOiBMZWFybi53b3Jkc0xlYXJuW0xlYXJuLmN1cnJlbnRJbmRleF0ud29yZCxcclxuICAgICAgICB0cmFuc2xhdGU6IExlYXJuLndvcmRzTGVhcm5bTGVhcm4uY3VycmVudEluZGV4XS50cmFuc2xhdGUsXHJcbiAgICAgICAgc3RlcCxcclxuICAgICAgICBkYXRlOiAoMSA9PT0gc3RlcCkgPyAoVXRpbHMuZ2V0VG9kYXkoKSArIFV0aWxzLmRlbGF5ICogU2V0dGluZ3MucGFyYW1zLmZpcnN0KSA6IDBcclxuICAgICAgfTtcclxuXHJcbiAgICAgIExXLnN0b3JlSXRlbShgJHtMVy5uYW1lfS0ke0xlYXJuLndvcmRzTGVhcm5bTGVhcm4uY3VycmVudEluZGV4XS5pbmRleH1gLCB3b3JkKTsgLy9zYXZlIHdvcmRcclxuXHJcbiAgICAgIGlmIChyZWluZGV4KSB7XHJcbiAgICAgICAgTGVhcm4ud29yZHNMZWFybi5zcGxpY2UoTGVhcm4uY3VycmVudEluZGV4LCAxKTsgLy9yZW1vdmUgZnJvbSBpbmRleFxyXG4gICAgICAgIExlYXJuLnJlY291bnRJbmRleExlYXJuKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTGVhcm4uY3VycmVudEluZGV4Kys7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIExlYXJuLmN1cnJlbnRJbmRleCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChMZWFybi5jdXJyZW50SW5kZXggPj0gTGVhcm4ud29yZHNMZWFybi5sZW5ndGgpIHtcclxuICAgICAgTGVhcm4uY3VycmVudEluZGV4ID0gMDtcclxuICAgIH1cclxuICAgIExlYXJuLnNob3dXb3JkKCk7XHJcbiAgfSxcclxuXHJcbiAgcmVtZW1iZXJXb3JkKCkge1xyXG4gICAgTGVhcm4uYWN0aW9uV29yZCgxLCB0cnVlKTtcclxuICB9LFxyXG5cclxuICByZXBlYXRXb3JkKCkge1xyXG4gICAgTGVhcm4uYWN0aW9uV29yZCgwKTtcclxuICB9LFxyXG5cclxuICBrbm93bldvcmQoKSB7XHJcbiAgICBMZWFybi5hY3Rpb25Xb3JkKDQsIHRydWUpO1xyXG4gIH0sXHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcjcmVtZW1iZXJCdG4nLCBMZWFybi5yZW1lbWJlcldvcmQpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI3JlcGVhdEJ0bicsIExlYXJuLnJlcGVhdFdvcmQpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI2tub3duQnRuJywgTGVhcm4ua25vd25Xb3JkKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQge0xlYXJufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL2FjdGlvbnMvbGVhcm4uanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gcmVwZWF0LmpzXHJcbiAqIGNvZGVkIGJ5IEFuYXRvbCBNYXJlemhhbnlpIGFrYSBlMXIwbmQvL1tDUkddIC0gTWFyY2ggMjAxNFxyXG4gKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gZTFyMG5kLmNyZ0BnbWFpbC5jb21cclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuaW1wb3J0IExXQ2xhc3MgZnJvbSAnLi4vdXRpbHMvTFcnO1xyXG5jb25zdCBMVyA9IG5ldyBMV0NsYXNzKCdMV2RiJyk7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vLi4vdXRpbHMvdXRpbHMnO1xyXG5pbXBvcnQge0xlYXJufSBmcm9tICcuL2xlYXJuJztcclxuXHJcbmltcG9ydCBTZXR0aW5nc0NsYXNzIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MnO1xyXG5jb25zdCBTZXR0aW5ncyA9IG5ldyBTZXR0aW5nc0NsYXNzKCk7XHJcblxyXG5jb25zdCBSZXBlYXQgPSB7XHJcbiAgd29yZHNSZXBlYXQ6IHtcclxuICAgIGZpcnN0OiBbXSxcclxuICAgIHNlY29uZDogW10sXHJcbiAgICB0aGlyZDogW11cclxuICB9LFxyXG5cclxuICByZXBlYXRXb3Jkc051bTogJCgnI3JlcGVhdFdvcmRzTnVtJyksXHJcbiAgcmVwZWF0V29yZHNUb3BOdW06ICQoJyNyZXBlYXRXb3Jkc1RvcE51bScpLFxyXG4gIHJlcGVhdFdvcmRzVG9wU051bTogJCgnI3JlcGVhdFdvcmRzVG9wU051bScpLFxyXG4gIGNoZWNrV29yZDogJCgnI2NoZWNrV29yZCcpLFxyXG4gIGNoZWNrV29yZElucDogJCgnI2NoZWNrV29yZElucCcpLFxyXG4gIGVudGVyV29yZDogJCgnI2VudGVyV29yZCcpLFxyXG4gIGlucHV0V29yZDogJCgnI2lucHV0V29yZCcpLFxyXG4gIG5vV29yZHNSZXBlYXQ6ICQoJyNub1dvcmRzUmVwZWF0JyksXHJcbiAgZW50ZXJCdG46ICQoJyNlbnRlckJ0bicpLFxyXG5cclxuICByZWNvdW50SW5kZXhSZXBlYXQoKSB7XHJcbiAgICAvL2NvdW50IHdvcmRzIHRvIFJlcGVhdFxyXG4gICAgaWYgKCFSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoICYmICFSZXBlYXQud29yZHNSZXBlYXQuc2Vjb25kLmxlbmd0aCAmJiAhUmVwZWF0LndvcmRzUmVwZWF0LnRoaXJkLmxlbmd0aCkge1xyXG4gICAgICAkKExXLmluZGV4KS5lYWNoKChpbmRleCwgbm9kZSkgPT4geyAvL3RoZSBpbml0aWFsIGNvdW50aW5nXHJcbiAgICAgICAgY29uc3QgaXRlbSA9IExXLnJlYWRJdGVtKGAke0xXLm5hbWV9LSR7bm9kZX1gKTtcclxuICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgaWYgKFV0aWxzLmdldFRvZGF5KCkgPiBpdGVtLmRhdGUpIHsgLy9pZiB0aGlzIHdvcmQgaXMgZm9yIHRvZGF5XHJcbiAgICAgICAgICAgIGlmICgxID09PSBpdGVtLnN0ZXApIHtcclxuICAgICAgICAgICAgICBSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgyID09PSBpdGVtLnN0ZXApIHtcclxuICAgICAgICAgICAgICBSZXBlYXQud29yZHNSZXBlYXQuc2Vjb25kLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKDMgPT09IGl0ZW0uc3RlcCkge1xyXG4gICAgICAgICAgICAgIFJlcGVhdC53b3Jkc1JlcGVhdC50aGlyZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnN0IHdvcmRzUmVwZWF0VG90YWwgPSBSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoICsgUmVwZWF0LndvcmRzUmVwZWF0LnNlY29uZC5sZW5ndGggKyBSZXBlYXQud29yZHNSZXBlYXQudGhpcmQubGVuZ3RoO1xyXG4gICAgY29uc3Qgd29yZHNSZXBlYXRMZW5ndGggPSAod29yZHNSZXBlYXRUb3RhbCkgPyB3b3Jkc1JlcGVhdFRvdGFsIDogJyc7XHJcblxyXG4gICAgJChyZXBlYXRXb3Jkc051bSkudGV4dCh3b3Jkc1JlcGVhdExlbmd0aCB8fCAnMCcpO1xyXG4gICAgJChyZXBlYXRXb3Jkc1RvcE51bSkudGV4dCh3b3Jkc1JlcGVhdExlbmd0aCk7XHJcbiAgICAkKHJlcGVhdFdvcmRzVG9wU051bSkudGV4dCh3b3Jkc1JlcGVhdExlbmd0aCk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0V29yZChpbmRleCwgYXJyV29yZHMpIHtcclxuICAgIC8vaWYgaW5kZXggaXMgMCB3ZSBnZXQgdGhlIGNvcnJlY3Qgd29yZC4gVGhlIG90aGVyIHdvcmRzIGFyZSByYW5kb21cclxuICAgIGlmICgwID09PSBpbmRleCkge1xyXG4gICAgICB3b3JkUGxhY2Vob2xkZXIgPSBSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXVswXVsoUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCkgPyAndHJhbnNsYXRlJyA6ICd3b3JkJ107XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3b3JkUGxhY2Vob2xkZXIgPSBWb2NhYnVsYXJ5WyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICd0cmFuc2xhdGVzJyA6ICd3b3JkcyddW1V0aWxzLmdldFJhbmRvbUludCgwLCBWb2NhYnVsYXJ5WyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICd0cmFuc2xhdGVzJyA6ICd3b3JkcyddLmxlbmd0aCAtIDEpXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXJyV29yZHMuaW5jbHVkZXMod29yZFBsYWNlaG9sZGVyKSkge1xyXG4gICAgICBSZXBlYXQuZ2V0V29yZChpbmRleCwgYXJyV29yZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB3b3JkUGxhY2Vob2xkZXI7XHJcbiAgfSxcclxuXHJcbiAgc2hvd1dvcmQoKSB7IC8vc2hvdyBhIG5leHQgd29yZCB0byBSZXBlYXRcclxuICAgIGlmIChSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoIHx8IFJlcGVhdC53b3Jkc1JlcGVhdC5zZWNvbmQubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnN0IGlkID0gUmVwZWF0LndvcmRzUmVwZWF0WyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICdmaXJzdCcgOiAnc2Vjb25kJ11bMF0uaW5kZXg7XHJcbiAgICAgIGxldCB3b3JkUGxhY2Vob2xkZXIgPSAnJztcclxuICAgICAgY29uc3QgYXJyV29yZHMgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgJChjaGVja1dvcmRJbnApLnRleHQoUmVwZWF0LndvcmRzUmVwZWF0WyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICdmaXJzdCcgOiAnc2Vjb25kJ11bMF1bKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ3dvcmQnIDogJ3RyYW5zbGF0ZSddKS5kYXRhKCdpZCcsIGlkKTtcclxuXHJcbiAgICAgIGNvbnN0IGFyck9wdGlvbkJ1dHRvbnMgPSAkKCdbZGF0YS10eXBlPWNoZWNrV29yZEJ0bl0nKTtcclxuICAgICAgLy90aGUgYW5zd2VyIGJ1dHRvbnMgYXJlIHNodWZmbGVkIHNvIHRoYXQgd2UgZG9uJ3Qga25vdyB3aGljaCBvbmUgaXMgdGhlIGNvcnJlY3Qgd29yZC5cclxuICAgICAgVXRpbHMuc2h1ZmZsZShhcnJPcHRpb25CdXR0b25zKTtcclxuXHJcbiAgICAgIGFyck9wdGlvbkJ1dHRvbnMuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuXHJcbiAgICAgICAgd29yZFBsYWNlaG9sZGVyID0gUmVwZWF0LmdldFdvcmQoaW5kZXgsIGFycldvcmRzKTtcclxuXHJcbiAgICAgICAgYXJyV29yZHNbaW5kZXhdID0gd29yZFBsYWNlaG9sZGVyO1xyXG5cclxuICAgICAgICAkKHRoaXMpLnRleHQod29yZFBsYWNlaG9sZGVyKTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoZW50ZXJCdG4pLmRhdGEoJ2RpcmVjdGlvbicsIHRydWUpO1xyXG4gICAgICAkKGNoZWNrV29yZCkucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKGVudGVyV29yZCkuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKG5vV29yZHNSZXBlYXQpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH0gZWxzZSBpZiAoUmVwZWF0LndvcmRzUmVwZWF0LnRoaXJkLmxlbmd0aCkge1xyXG4gICAgICAkKGVudGVyV29yZElucCkudGV4dChSZXBlYXQud29yZHNSZXBlYXQudGhpcmRbMF0udHJhbnNsYXRlKTtcclxuICAgICAgJChjaGVja1dvcmQpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgICAgJChlbnRlcldvcmQpLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgICAgJChub1dvcmRzUmVwZWF0KS5hZGRDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKGNoZWNrV29yZCkuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKGVudGVyV29yZCkuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKG5vV29yZHNSZXBlYXQpLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBhY3Rpb25Xb3JkKHN0ZXAsIHJlaW5kZXgpIHtcclxuICAgIGlmIChzdGVwKSB7XHJcblxyXG4gICAgICBMVy5zdG9yZUl0ZW0oYCR7TFcubmFtZX0tJHtSZXBlYXQud29yZHNSZXBlYXRbUmVwZWF0LmN1cnJlbnRJbmRleF0ud29yZH1gLCB3b3JkKTsgLy9zYXZlIHdvcmRcclxuXHJcbiAgICAgIGlmIChyZWluZGV4KSB7XHJcbiAgICAgICAgUmVwZWF0LndvcmRzUmVwZWF0LnNwbGljZShSZXBlYXQuY3VycmVudEluZGV4LCAxKTsgLy9yZW1vdmUgZnJvbSBpbmRleFxyXG4gICAgICAgIFJlcGVhdC5yZWNvdW50SW5kZXhSZXBlYXQoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBSZXBlYXQuY3VycmVudEluZGV4Kys7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFJlcGVhdC5jdXJyZW50SW5kZXgrKztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoUmVwZWF0LmN1cnJlbnRJbmRleCA+PSBSZXBlYXQud29yZHNSZXBlYXQubGVuZ3RoKSB7XHJcbiAgICAgIFJlcGVhdC5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgfVxyXG4gICAgUmVwZWF0LnNob3dXb3JkKFJlcGVhdC5jdXJyZW50SW5kZXgpO1xyXG4gIH0sXHJcblxyXG4gIGNoZWNrV29yZChzZWxmKSB7XHJcbiAgICBjb25zdCB3b3JkID0ge1xyXG4gICAgICBpbmRleDogUmVwZWF0LndvcmRzUmVwZWF0WyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICdmaXJzdCcgOiAnc2Vjb25kJ11bMF0uaW5kZXgsXHJcbiAgICAgIHdvcmQ6IFJlcGVhdC53b3Jkc1JlcGVhdFsoUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCkgPyAnZmlyc3QnIDogJ3NlY29uZCddWzBdLndvcmQsXHJcbiAgICAgIHRyYW5zbGF0ZTogUmVwZWF0LndvcmRzUmVwZWF0WyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICdmaXJzdCcgOiAnc2Vjb25kJ11bMF0udHJhbnNsYXRlLFxyXG4gICAgICBzdGVwOiBSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXVswXS5zdGVwLFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoJChzZWxmKS50ZXh0KCkgPT09ICgoUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCkgPyB3b3JkLnRyYW5zbGF0ZSA6IHdvcmQud29yZCkpIHtcclxuICAgICAgd29yZC5zdGVwKys7XHJcbiAgICAgIHdvcmQuZGF0ZSA9IFV0aWxzLmdldFRvZGF5KCkgKyBVdGlscy5kZWxheSAqIFNldHRpbmdzLnBhcmFtc1soUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCkgPyAnc2Vjb25kJyA6ICd0aGlyZCddO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd29yZC5zdGVwLS07XHJcbiAgICAgIHdvcmQuZGF0ZSA9IChSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/IDAgOiBVdGlscy5nZXRUb2RheSgpICsgVXRpbHMuZGVsYXkgKiBTZXR0aW5ncy5wYXJhbXMuZmlyc3Q7XHJcbiAgICB9XHJcbiAgICBMVy5zdG9yZUl0ZW0oYCR7TFcubmFtZX0tJHt3b3JkLmluZGV4fWAsIHdvcmQpOyAvL3NhdmUgd29yZFxyXG4gICAgUmVwZWF0LndvcmRzUmVwZWF0WyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICdmaXJzdCcgOiAnc2Vjb25kJ10uc3BsaWNlKDAsIDEpOyAvL3JlbW92ZSBmcm9tIGluZGV4XHJcbiAgICBMZWFybi53b3Jkc0xlYXJuID0gW107XHJcbiAgICBMZWFybi5yZWNvdW50SW5kZXhMZWFybigpO1xyXG4gICAgTGVhcm4uc2hvd1dvcmQoKTtcclxuICAgIFJlcGVhdC5yZWNvdW50SW5kZXhSZXBlYXQoKTtcclxuICAgIFJlcGVhdC5zaG93V29yZCgpO1xyXG4gIH0sXHJcblxyXG4gIHJlcGVhdFdvcmQoKSB7XHJcbiAgICBjb25zdCB3b3JkID0ge1xyXG4gICAgICBpbmRleDogUmVwZWF0LndvcmRzUmVwZWF0LnRoaXJkWzBdLmluZGV4LFxyXG4gICAgICB3b3JkOiBSZXBlYXQud29yZHNSZXBlYXQudGhpcmRbMF0ud29yZCxcclxuICAgICAgdHJhbnNsYXRlOiBSZXBlYXQud29yZHNSZXBlYXQudGhpcmRbMF0udHJhbnNsYXRlLFxyXG4gICAgICBzdGVwOiBSZXBlYXQud29yZHNSZXBlYXQudGhpcmRbMF0uc3RlcCxcclxuICAgIH07XHJcbiAgICBpZiAoJChlbnRlcldvcmRJbnApLnZhbCgpID09PSB3b3JkLndvcmQpIHtcclxuICAgICAgd29yZC5zdGVwKys7XHJcbiAgICAgIHdvcmQuZGF0ZSA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3b3JkLnN0ZXAtLTtcclxuICAgICAgd29yZC5kYXRlID0gVXRpbHMuZ2V0VG9kYXkoKSArIFV0aWxzLmRlbGF5ICogU2V0dGluZ3MucGFyYW1zLnNlY29uZDtcclxuICAgIH07XHJcbiAgICBMVy5zdG9yZUl0ZW0oYCR7TFcubmFtZX0tJHt3b3JkLmluZGV4fWAsIHdvcmQpOyAvL3NhdmUgd29yZFxyXG4gICAgUmVwZWF0LndvcmRzUmVwZWF0LnRoaXJkLnNwbGljZSgwLCAxKTsgLy9yZW1vdmUgZnJvbSBpbmRleFxyXG4gICAgTGVhcm4ud29yZHNMZWFybiA9IFtdO1xyXG4gICAgTGVhcm4ucmVjb3VudEluZGV4TGVhcm4oKTtcclxuICAgIExlYXJuLnNob3dXb3JkKCk7XHJcbiAgICBSZXBlYXQucmVjb3VudEluZGV4UmVwZWF0KCk7XHJcbiAgICBSZXBlYXQuc2hvd1dvcmQoKTtcclxuICB9LFxyXG5cclxuICBpbml0KCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnW2RhdGEtdHlwZT1jaGVja1dvcmRCdG5dJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBSZXBlYXQuY2hlY2tXb3JkKHRoaXMpO1xyXG4gICAgfSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcjZW50ZXJCdG4nLCBSZXBlYXQucmVwZWF0V29yZCk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHtSZXBlYXR9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvYWN0aW9ucy9yZXBlYXQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1cXFwie3tub2RlfX1cXFwiIGNsYXNzPVxcXCJyb3dcXFwiPlxcclxcbiAgPGRpdiBjbGFzcz1cXFwiY29sLW1kLTUgY29sLXNtLTUgY29sLXhzLTRcXFwiPnt7dHh0fX08L2Rpdj5cXHJcXG4gIDxkaXYgY2xhc3M9XFxcImNvbC1tZC01IGNvbC1zbS01IGNvbC14cy00XFxcIj57e3RyYW5zbGF0ZX19PC9kaXY+XFxyXFxuICA8ZGl2IGNsYXNzPVxcXCJjb2wtbWQtMiBjb2wtc20tMiBjb2wteHMtNFxcXCI+XFxyXFxuICAgIDxidXR0b24gZGF0YS1ub2RlPVxcXCJ7e25vZGV9fVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1pbmZvIGpzLWVkaXQtYnRuXFxcIj5cXHJcXG4gICAgICA8c3BhbiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XFxcIj48L3NwYW4+XFxyXFxuICAgIDwvYnV0dG9uPlxcclxcbiAgPC9kaXY+XFxyXFxuPC9kaXY+XFxyXFxuPGRpdiBpZD1cXFwie3tub2RlfX1FZGl0XFxcIiBjbGFzcz1cXFwicm93IG5vZGlzcGxheVxcXCI+XFxyXFxuICA8Zm9ybSBpZD1cXFwiZm9ybS17e25vZGV9fVxcXCIgcm9sZT1cXFwiZm9ybVxcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1tZC01IGNvbC1zbS01IGNvbC14cy00XFxcIj5cXHJcXG4gICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbCBpbnAtZmxkXFxcIiBpZD1cXFwid29yZC17e25vZGV9fVxcXCIgcGxhY2Vob2xkZXI9XFxcIkVudGVyIHdvcmRcXFwiIHZhbHVlPVxcXCJ7e3R4dH19XFxcIj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbC1tZC01IGNvbC1zbS01IGNvbC14cy00XFxcIj5cXHJcXG4gICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbCBpbnAtZmxkXFxcIiBpZD1cXFwidHJhbnNsYXRlLXt7bm9kZX19XFxcIiBwbGFjZWhvbGRlcj1cXFwiRW50ZXIgdHJhbnNsYXRlXFxcIiB2YWx1ZT1cXFwie3t0cmFuc2xhdGV9fVxcXCI+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbWQtMiBjb2wtc20tMiBjb2wteHMtNFxcXCI+XFxyXFxuICAgICAgPGJ1dHRvbiBkYXRhLW5vZGU9XFxcInt7bm9kZX19XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXN1Y2Nlc3MganMtc2F2ZS1idG5cXFwiPlxcclxcbiAgICAgICAgPHNwYW4gY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tb2tcXFwiPlxcclxcbiAgICAgICAgPC9zcGFuPlxcclxcbiAgICAgIDwvYnV0dG9uPlxcclxcbiAgICAgIDxidXR0b24gaWQ9XFxcImRlbC17e25vZGV9fVxcXCIgZGF0YS1ub2RlPVxcXCJ7e25vZGV9fVxcXCIgZGF0YS1pZD1cXFwie3tpbmRleH19XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRhbmdlciBqcy1kZWwtYnRuXFxcIj5cXHJcXG4gICAgICAgIDxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVxcXCI+PC9zcGFuPlxcclxcbiAgICAgIDwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gIDwvZm9ybT5cXHJcXG48L2Rpdj5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2FwcC9jb21wb25lbnRzL3Jvdy13b3JkL3Jvdy13b3JkLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=