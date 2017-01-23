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
	    var langNode = $('[data-toggle=lang]'),
	        langSelect = $('[data-type=lang-select]');
	
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

	/**************************************************
	 * Learn Words // vocabulary.js
	 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	 * Placed in public domain.
	 **************************************************/
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
	
	var LW = new _LW2.default('LWdb');
	
	
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
	    var id = $(self).data('id'),
	        node = $(self).data('node');
	
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
	      "use strict";
	
	      var txt, translate;
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
	    "use strict";
	
	    var inputWord = wordTxt.val().trim(),
	        inputTranslate = translate.val().trim(),
	        form = addForm,
	        error = false,
	        word = {};
	
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
	      var newIndexVal;
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
	    };
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

	/**********************************************
	 * Learn Words // learn.js
	 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	 * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
	 *
	 * Updated by Hannes Hirzel, November 2016
	 *
	 * Placed in public domain.
	 **************************************************/
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Learn = undefined;
	
	var _LW = __webpack_require__(1);
	
	var _LW2 = _interopRequireDefault(_LW);
	
	var _utils = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var LW = new _LW2.default('LWdb');
	
	
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

	/**************************************************
	 * Learn Words // repeat.js
	 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
	 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	 * Placed in public domain.
	 **************************************************/
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
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
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
	    var wordsRepeatTotal = Repeat.wordsRepeat.first.length + Repeat.wordsRepeat.second.length + Repeat.wordsRepeat.third.length,
	        wordsRepeatLength = wordsRepeatTotal ? wordsRepeatTotal : '';
	
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
	
	    if (arrWords.indexOf(wordPlaceholder) >= 0) {
	      Repeat.getWord(index, arrWords);
	    }
	
	    return wordPlaceholder;
	  },
	
	  showWord: function showWord() {
	    //show a next word to Repeat
	    if (Repeat.wordsRepeat.first.length || Repeat.wordsRepeat.second.length) {
	      var id = Repeat.wordsRepeat[Repeat.wordsRepeat.first.length ? 'first' : 'second'][0].index,
	          wordPlaceholder = '';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvTFcuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pzL3V0aWxzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL2FwcC9qcy91dGlscy9tZW1vcnlzdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvbmF2aWdhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvbG9jYWwvbG9jYWwuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pzL2FjdGlvbnMvdm9jYWJ1bGFyeS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvYWN0aW9ucy9sZWFybi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvYWN0aW9ucy9yZXBlYXQuanMiXSwibmFtZXMiOlsiTFciLCJjb25zb2xlIiwibG9nIiwiaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUiLCJTZXR0aW5ncyIsImlzT0siLCJpc0VtcHR5IiwibG9hZFdvcmRzIiwiaW5pdCIsInZpZXdXb3JkIiwicmVjb3VudEluZGV4TGVhcm4iLCJzaG93V29yZCIsInJlY291bnRJbmRleFJlcGVhdCIsImdldFNldHRpbmdzIiwiY3VycmVudExvY2FsIiwiJCIsImRhdGEiLCJjbGljayIsImNsb3NlTW9iTWVudSIsIkxXQ2xhc3MiLCJkYk5hbWUiLCJhbGVydCIsIm5hbWUiLCJpbmRleCIsInN0ckluZGV4IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNwbGl0Iiwid2luZG93IiwiZSIsImtleSIsIkpTT04iLCJwYXJzZSIsInJlbW92ZUl0ZW0iLCJ2YWx1ZSIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJRVU9UQV9FWENFRURFRF9FUlIiLCJ0aGVTZXR0aW5nc09iaiIsInN0b3JlSXRlbSIsInNldHRpbmdzIiwicmVhZEl0ZW0iLCJmaXJzdCIsInNlY29uZCIsInRoaXJkIiwidGhlV29yZHMiLCJpIiwiYXJyYXlPZktleXMiLCJzdG9yZUVhY2hFbGVtZW50IiwiZWxlbWVudCIsInN0ZXAiLCJkYXRlIiwicHVzaCIsImZvckVhY2giLCJiaW5kIiwiam9pbiIsImxlbmd0aCIsInN0clZhbHVlIiwicmVzdWx0IiwicHJlZml4Rm9yTnVtYmVyIiwibGFzdEluZGV4T2YiLCJhS2V5UHJlZml4Iiwia2V5c1RvRGVsZXRlIiwic3QiLCJhS2V5IiwicmVtb3ZlT2JqZWN0cyIsIlNldHRpbmdzQ2xhc3MiLCJpbnB1dEZpcnN0Q2hlY2siLCJpbnB1dFNlY29uZENoZWNrIiwiaW5wdXRUaGlyZENoZWNrIiwic2V0dGluZ0Zyb20iLCJlcnJvclNldHRpbmdzIiwicGFyYW1zIiwiZG9jdW1lbnQiLCJvbiIsInNhdmVTZXR0aW5nIiwiY2FuY2VsU2V0dGluZyIsInN0b3JlZFNldHRpbmdzIiwidmFsIiwidHJpbSIsImZvcm0iLCJlcnJvck5hbWUiLCJlcnJvciIsIlV0aWxzIiwiY2xlYXJGaWVsZHMiLCJzZXRGaWVsZEVycm9yIiwiY2hpbGRyZW4iLCJpc051bWJlciIsImVycm9yVHh0IiwibG9jYWwiLCJlcnJvckVtcHR5IiwiZXJyb3JWYWxpZCIsInJlbW92ZUNsYXNzIiwidGV4dCIsInB1dFNldHRpbmdzIiwiZXJyb3JObyIsInN0ciIsIndpdGhEb3QiLCJOdW1iZXJSZWciLCJOdW1iZXJXaXRoRG90UmVnIiwidGVzdCIsImVhY2giLCJub2RlIiwiYWRkQ2xhc3MiLCJzZWxmIiwiZ2V0UmFuZG9tSW50IiwibWluIiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ2V0VG9kYXkiLCJmdWxsRGF0ZSIsIm5vdyIsIkRhdGUiLCJ2YWx1ZU9mIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJoYXNDbGFzcyIsInNodWZmbGUiLCJhIiwiaiIsIngiLCJtb2R1bGUiLCJleHBvcnRzIiwiTWVtb3J5c3RvcmUiLCJOYXZpZ2F0aW9uIiwiaGFzaGd1YXJkIiwiaGFzaCIsImxvY2F0aW9uIiwidHJpZ2dlciIsInNldFRpbWVvdXQiLCJoYXNoYnJlYWsiLCJoYXNoVXJsIiwic2xpY2UiLCJuYXZTZWxlY3QiLCJwYXJlbnQiLCJlbl9HQiIsInN1bW1hcnkiLCJsZWFybiIsInJlcGVhdCIsInZvY2FidWxhcnkiLCJlZGl0V29yZHMiLCJzYXZlQnRuIiwiY2FuY2VsQnRuIiwibGFuZ3VhZ2UiLCJkZV9ERSIsInJ1X1JVIiwiZXJyb3JOb1ciLCJ0b3RhbFdvcmRzIiwibGVhcm5Xb3Jkc051bSIsInJlcGVhdFdvcmRzIiwicmVtZW1iZXJCdG4iLCJyZXBlYXRCdG4iLCJrbm93bkJ0biIsImFsbFdvcmRzT2siLCJpbnB1dFdvcmRMYmwiLCJpbnB1dFRyYW5zbGF0ZUxibCIsImVudGVyQnRuIiwiYWxsV29yZHNEb25lIiwiY2hhbmdlTG9jYWxDb250ZW50IiwibGFuZ05vZGUiLCJsYW5nU2VsZWN0IiwiVm9jYWJ1bGFyeSIsInJvd1RlbXBsYXRlIiwidG90YWxXb3Jkc051bSIsInZvY2FidWxhcnlCb3giLCJlcnJvclZvY2FidWxhcnlCb3giLCJlcnJvclZvY2FidWxhcnkiLCJpbnB1dFdvcmRUeHQiLCJpbnB1dFRyYW5zbGF0ZSIsImFkZFdvcmRGb3JtIiwid29yZHMiLCJ0cmFuc2xhdGVzIiwicmVjb3VudFRvdGFsIiwicmVtb3ZlV29yZCIsIm5vdFJlaW5kZXgiLCJpZCIsInNwbGljZSIsInJlbW92ZSIsIndvcmRzTGVhcm4iLCJ3b3Jkc1JlcGVhdCIsImN1cnJlbnRJbmRleEZpcnN0IiwiY3VycmVudEluZGV4U2Vjb25kIiwiY3VycmVudEluZGV4VGhpcmQiLCJjb250ZW50SW5uZXIiLCJ0eHQiLCJ0cmFuc2xhdGUiLCJpdGVtIiwid29yZCIsInJlcGxhY2UiLCJodG1sIiwiYWRkU2F2ZVdvcmQiLCJ3b3JkVHh0IiwiYWRkRm9ybSIsImFkZFdvcmQiLCJpbnB1dFdvcmQiLCJuZXdJbmRleFZhbCIsInRvZGF5RGF0ZSIsImluZGV4T2YiLCJhcHBlbmQiLCJhdHRyIiwiYmVmb3JlIiwiaGlkZSIsInNob3ciLCJMZWFybiIsImN1cnJlbnRJbmRleCIsImxlYXJuV29yZHNUb3BOdW0iLCJsZWFybldvcmRzVG9wU051bSIsImxlYXJuV29yZCIsInRyYW5zbGF0ZVdvcmQiLCJsZWFybldvcmRzR3JwIiwibm9Xb3Jkc0xlZnQiLCJ3b3Jkc0xlYXJuTGVuZ3RoIiwiYWN0aW9uV29yZCIsInJlaW5kZXgiLCJkZWxheSIsInJlbWVtYmVyV29yZCIsInJlcGVhdFdvcmQiLCJrbm93bldvcmQiLCJSZXBlYXQiLCJyZXBlYXRXb3Jkc051bSIsInJlcGVhdFdvcmRzVG9wTnVtIiwicmVwZWF0V29yZHNUb3BTTnVtIiwiY2hlY2tXb3JkIiwiY2hlY2tXb3JkSW5wIiwiZW50ZXJXb3JkIiwibm9Xb3Jkc1JlcGVhdCIsIndvcmRzUmVwZWF0VG90YWwiLCJ3b3Jkc1JlcGVhdExlbmd0aCIsImdldFdvcmQiLCJhcnJXb3JkcyIsIndvcmRQbGFjZWhvbGRlciIsIkFycmF5IiwiYXJyT3B0aW9uQnV0dG9ucyIsImVudGVyV29yZElucCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7QUFJQTs7OztBQUdBOztBQUVBOztBQVFBOztBQUdBOztBQUdBOztBQUlBOztBQUtBOzs7O0FBL0JBLEtBQU1BLEtBQUssaUJBQVksTUFBWixDQUFYO0FBQ0FDLFNBQVFDLEdBQVIsQ0FBWUYsR0FBR0csdUJBQUgsRUFBWjs7QUFHQSxLQUFNQyxXQUFXLHdCQUFqQjs7QUFLQTtBQUNBLEtBQUlKLEdBQUdLLElBQUgsSUFBV0wsR0FBR00sT0FBbEIsRUFBMkI7QUFDekJMLFdBQVFDLEdBQVIsQ0FBWSxrQ0FBWjtBQUNBRixNQUFHTyxTQUFIO0FBQ0FOLFdBQVFDLEdBQVIsQ0FBWSxxQ0FBWjtBQUNEOztBQUdELHdCQUFXTSxJQUFYOztBQUdBLGNBQU1BLElBQU47O0FBR0Esd0JBQVdBLElBQVg7QUFDQSx3QkFBV0MsUUFBWDs7QUFHQSxjQUFNRCxJQUFOO0FBQ0EsY0FBTUUsaUJB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LEVBQXlDO0FBQ3ZDQSxVQUFLNUksSUFBTDtBQUNBNEksVUFBSzNJLElBQUwsR0FBWSxDQUFaO0FBQ0QsSUFIRCxNQUdPO0FBQ0wySSxVQUFLNUksSUFBTDtBQUNBNEksVUFBSzNJLElBQUwsR0FBWSxhQUFNNEQsUUFBTixLQUFtQixhQUFNMEcsS0FBTixHQUFjck4sU0FBU29FLE1BQVQsQ0FBZ0I3QixNQUE3RDtBQUNEO0FBQ0QzQyxNQUFHdUMsU0FBSCxDQUFhdkMsR0FBR3NCLElBQUgsR0FBVSxHQUFWLEdBQWdCd0ssS0FBS3ZLLEtBQWxDLEVBQXlDdUssSUFBekMsRUFkc0IsQ0FjMEI7QUFDaEQrQixVQUFPdkMsV0FBUCxDQUFtQjFJLEtBQW5CLENBQXlCdUksTUFBekIsQ0FBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkMsRUFmc0IsQ0FlaUI7QUFDdkMsZ0JBQU1FLFVBQU4sR0FBbUIsRUFBbkI7QUFDQSxnQkFBTTNLLGlCQUFOO0FBQ0EsZ0JBQU1DLFFBQU47QUFDQWtOLFVBQU9qTixrQkFBUDtBQUNBaU4sVUFBT2xOLFFBQVA7QUFDRCxFQWhLRyxvQ0FrS0UsZ0JBQVk7QUFDaEJJLEtBQUUwRCxRQUFGLEVBQVlDLEVBQVosQ0FBZSxrQkFBZixFQUFtQywwQkFBbkMsRUFBK0QsWUFBWTtBQUN6RW1KLFlBQU9JLFNBQVAsQ0FBaUIsSUFBakI7QUFDRCxJQUZEO0FBR0FsTixLQUFFMEQsUUFBRixFQUFZQyxFQUFaLENBQWUsa0JBQWYsRUFBbUMsV0FBbkMsRUFBZ0RtSixPQUFPRixVQUF2RDtBQUNELEVBdktHLFdBQU47O1NBMEtRRSxNLEdBQUFBLE0iLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4qIExlYXJuIFdvcmRzIC8vIG1haW4uanNcclxuKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIEphbnVhcnkgMjAxN1xyXG4qIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuL3V0aWxzL0xXJztcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG5jb25zb2xlLmxvZyhMVy5pc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSgpKTtcclxuXHJcbmltcG9ydCBTZXR0aW5nc0NsYXNzIGZyb20gJy4uL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MnO1xyXG5jb25zdCBTZXR0aW5ncyA9IG5ldyBTZXR0aW5nc0NsYXNzKCk7XHJcblxyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzL3V0aWxzJztcclxuXHJcbmltcG9ydCB7TWVtb3J5c3RvcmV9IGZyb20gJy4vdXRpbHMvbWVtb3J5c3RvcmUnO1xyXG4vLyBsb2FkIHRoZSBkZWZhdWx0IHdvcmRzIHNldCBpZiBuZWVkZWRcclxuaWYgKExXLmlzT0sgJiYgTFcuaXNFbXB0eSkge1xyXG4gIGNvbnNvbGUubG9nKCdtZW1vcnlzdG9yZTogc3RhcnQgbG9hZGluZyB3b3JkcycpO1xyXG4gIExXLmxvYWRXb3JkcyhNZW1vcnlzdG9yZSk7XHJcbiAgY29uc29sZS5sb2coJ21lbW9yeXN0b3JlOiB3b3JkcyBoYXZlIGJlZW4gbG9hZGVkJyk7XHJcbn1cclxuXHJcbmltcG9ydCB7TmF2aWdhdGlvbn0gZnJvbSAnLi91dGlscy9uYXZpZ2F0aW9uJztcclxuTmF2aWdhdGlvbi5pbml0KCk7XHJcblxyXG5pbXBvcnQge2xvY2FsfSBmcm9tICcuL2xvY2FsL2xvY2FsJztcclxubG9jYWwuaW5pdCgpO1xyXG5cclxuaW1wb3J0IHtWb2NhYnVsYXJ5fSBmcm9tICcuL2FjdGlvbnMvdm9jYWJ1bGFyeSc7XHJcblZvY2FidWxhcnkuaW5pdCgpO1xyXG5Wb2NhYnVsYXJ5LnZpZXdXb3JkKCk7XHJcblxyXG5pbXBvcnQge0xlYXJufSBmcm9tICcuL2FjdGlvbnMvbGVhcm4nO1xyXG5MZWFybi5pbml0KCk7XHJcbkxlYXJuLnJlY291bnRJbmRleExlYXJuKCk7XHJcbkxlYXJuLnNob3dXb3JkKCk7XHJcblxyXG5pbXBvcnQge1JlcGVhdH0gZnJvbSAnLi9hY3Rpb25zL3JlcGVhdCc7XHJcblJlcGVhdC5pbml0KCk7XHJcblJlcGVhdC5yZWNvdW50SW5kZXhSZXBlYXQoKTtcclxuUmVwZWF0LnNob3dXb3JkKCk7XHJcblxyXG5pZiAoJ2RldmVsb3BtZW50JyA9PT0gTk9ERV9FTlYpIHtcclxuICBjb25zb2xlLmxvZyhgZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnQgJHtOT0RFX0VOVn1gKTtcclxufVxyXG4vLyByZWFkIHNldHRpbmdzXHJcblNldHRpbmdzLmdldFNldHRpbmdzKCk7XHJcblxyXG4vLyBzZXQgdXNlciBzYXZlZCBsb2NhbFxyXG5pZiAobG9jYWwuY3VycmVudExvY2FsICE9PSAkKCdbZGF0YS10eXBlPWxhbmctc2VsZWN0XS5zZWxlY3RlZCcpLmRhdGEoJ2xhbmcnKSkge1xyXG5cdCQoJ1tkYXRhLWxhbmc9JyArIGxvY2FsLmN1cnJlbnRMb2NhbCArICddJykuY2xpY2soKTtcclxufTtcclxuVXRpbHMuY2xvc2VNb2JNZW51KCk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy9tYWluLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIGxvY2Fsc3RvcmFnZS5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55QGdtYWlsLmNvbVxyXG4gKlxyXG4gKiBVcGRhdGVkIGJ5IEhhbm5lcyBIaXJ6ZWwsIE5vdmVtYmVyIDIwMTZcclxuICpcclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTFdDbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoZGJOYW1lKSB7XHJcbiAgICB0aGlzLmlzT0sgPSBmYWxzZTtcclxuICAgIGlmICghdGhpcy5pc0xvY2FsU3RvcmFnZUF2YWlsYWJsZSgpKSB7XHJcbiAgICAgIGFsZXJ0KCdMb2NhbCBTdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUuJyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICB0aGlzLm5hbWUgPSBkYk5hbWU7XHJcbiAgICAvLyBnZXQgaW5kZXhcclxuICAgIHRoaXMuaW5kZXggPSBbXTtcclxuICAgIHZhciBzdHJJbmRleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSArICctd29yZHMnKTtcclxuICAgIGlmIChzdHJJbmRleCkge1xyXG4gICAgICB0aGlzLmluZGV4ID0gc3RySW5kZXguc3BsaXQoJywnKTtcclxuICAgIH07XHJcbiAgICB0aGlzLmlzT0sgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gd2luZG93ICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlYWRJdGVtKGtleSkge1xyXG4gICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbW92ZUl0ZW0oa2V5KSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdG9yZUl0ZW0oa2V5LCB2YWx1ZSkge1xyXG4gICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlID09PSBRVU9UQV9FWENFRURFRF9FUlIpIHtcclxuICAgICAgICAgIGFsZXJ0KCdMb2NhbCBTdG9yYWdlIGlzIGZ1bGwnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdXRTZXR0aW5ncyh0aGVTZXR0aW5nc09iaikge1xyXG4gICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy13b3Jkcy1zZXR0aW5ncycsIHRoZVNldHRpbmdzT2JqKTtcclxuICB9XHJcblxyXG4gIGdldFNldHRpbmdzKCkge1xyXG5cclxuICAgIHZhciBzZXR0aW5ncyA9IHRoaXMucmVhZEl0ZW0odGhpcy5uYW1lICsgJy13b3Jkcy1zZXR0aW5ncycpO1xyXG4gICAgaWYgKCFzZXR0aW5ncykge1xyXG4gICAgICAvLyB0aGUgYXBwIHJ1bnMgZm9yIHRoZSBmaXJzdCB0aW1lLCB0aHVzXHJcbiAgICAgIC8vIGluaXRpYWxpemUgdGhlIHNldHRpbmcgb2JqZWN0IG5lZWVkcyB0byBiZSBpbml0aWFsaXplZFxyXG4gICAgICAvLyB3aXRoIGRlZmF1bHQgdmFsdWVzLlxyXG5cclxuICAgICAgLy8gZmlyc3QgaXMgZm9yIGJveCAob3Igc3RlcCkgMSBpbiB0aGUgTGVpdG5lciBib3g7XHJcbiAgICAgIC8vICAgICAgIGFzayB0aGUgd29yZCBhZ2FpbiBhZnRlciAxIGRheVxyXG4gICAgICAvLyBzZWNvbmQgaXMgZm9yIGJveCAyIDsgYXNrIHRoZSB3b3JkIGFnYWluIGFmdGVyIDMgZGF5c1xyXG4gICAgICAvLyB0aGlyZCBpcyBmb3IgYm94IDMgOyBhc2sgdGhlIHdvcmQgYWdhaW4gYWZ0ZXIgNyBkYXlzXHJcblxyXG4gICAgICAvLyBOb3RlOiBib3ggMCBpcyBmb3IgdGhlIExlYXJuIG1vZGUgYW5kIGl0IG5vdCBzZXRcclxuICAgICAgLy8gYXMgdGhlIHdvcmRzIGFyZSBhY2Nlc3NpYmxlIGFsbCB0aGUgdGltZVxyXG4gICAgICBjb25zb2xlLmxvZygnaW5pdGlhbGl6ZSBzZXR0aW5ncycpO1xyXG4gICAgICBzZXR0aW5ncyA9IHtcclxuICAgICAgICBmaXJzdDogMSxcclxuICAgICAgICBzZWNvbmQ6IDMsXHJcbiAgICAgICAgdGhpcmQ6IDdcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy1zZXR0aW5ncycsIHNldHRpbmdzKTtcclxuICAgICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy1sYW5ndWFnZScsICdlbl9HQicpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNldHRpbmdzO1xyXG4gIH1cclxuXHJcbiAgbG9hZFdvcmRzKHRoZVdvcmRzKSB7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB2YXIgYXJyYXlPZktleXMgPSBbXTtcclxuICAgIGNvbnN0IHN0b3JlRWFjaEVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LmluZGV4ID0gJ2luZGV4JyArICsraTtcclxuICAgICAgZWxlbWVudC5zdGVwID0gZWxlbWVudC5kYXRlID0gMDtcclxuICAgICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy0nICsgZWxlbWVudC5pbmRleCwgZWxlbWVudCk7XHJcbiAgICAgIGFycmF5T2ZLZXlzLnB1c2goZWxlbWVudC5pbmRleCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoZVdvcmRzLmZvckVhY2goc3RvcmVFYWNoRWxlbWVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnN0b3JlSXRlbSh0aGlzLm5hbWUgKyAnLXdvcmRzJywgYXJyYXlPZktleXMuam9pbigpKTtcclxuICAgIHRoaXMuaW5kZXggPSBhcnJheU9mS2V5cztcclxuXHJcbiAgICBjb25zb2xlLmxvZyhhcnJheU9mS2V5cy5sZW5ndGggKyAnIHdvcmRzIGhhdmUgYmVlbiBsb2FkZWQnKTtcclxuICB9XHJcblxyXG4gIGlzRW1wdHkoLyprZXkqLykge1xyXG4gICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgICByZXR1cm4gKCF0aGlzLmluZGV4Lmxlbmd0aCkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkdW1wV29yZHMoLyphS2V5UHJlZml4Ki8pIHtcclxuICAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgICB2YXIga2V5O1xyXG4gICAgICB2YXIgc3RyVmFsdWU7XHJcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgIHZhciBwcmVmaXhGb3JOdW1iZXIgPSB0aGlzLm5hbWUgKyAnLWluZGV4JztcclxuXHJcbiAgICAgIC8vIGdvIHRocm91Z2ggYWxsIGtleXMgc3RhcnRpbmcgd2l0aCB0aGUgbmFtZVxyXG4gICAgICAvLyBvZiB0aGUgZGF0YWJhc2UsIGkuZSAnbGVhcm5Xb3Jkcy1pbmRleDE0J1xyXG4gICAgICAvLyBjb2xsZWN0IHRoZSBtYXRjaGluZyBvYmplY3RzIGludG8gYXJyXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcclxuICAgICAgICBzdHJWYWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblxyXG4gICAgICAgIGlmICgwID09PSBrZXkubGFzdEluZGV4T2YocHJlZml4Rm9yTnVtYmVyLCAwKSkge1xyXG4gICAgICAgICAgcmVzdWx0LnB1c2goSlNPTi5wYXJzZShzdHJWYWx1ZSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBEdW1wIHRoZSBhcnJheSBhcyBKU09OIGNvZGUgKGZvciBzZWxlY3QgYWxsIC8gY29weSlcclxuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW1vdmVPYmplY3RzKGFLZXlQcmVmaXgpIHtcclxuICAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICAgdmFyIGtleTtcclxuICAgICAgLy8gdmFyIHN0O1xyXG4gICAgICB2YXIga2V5c1RvRGVsZXRlID0gW107XHJcblxyXG4gICAgICAvLyBnbyB0aHJvdWdoIGFsbCBrZXlzIHN0YXJ0aW5nIHdpdGggdGhlIG5hbWVcclxuICAgICAgLy8gb2YgdGhlIGRhdGFiYXNlLCBpLmUgJ2xlYXJuV29yZHMtaW5kZXgxNCdcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBrZXkgPSBsb2NhbFN0b3JhZ2Uua2V5KGkpO1xyXG4gICAgICAgIHN0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuXHJcbiAgICAgICAgaWYgKDAgPT09IGtleS5sYXN0SW5kZXhPZihhS2V5UHJlZml4LCAwKSkge1xyXG4gICAgICAgICAga2V5c1RvRGVsZXRlLnB1c2goa2V5KTtcclxuICAgICAgICB9O1xyXG4gICAgICB9O1xyXG4gICAgICAvLyBub3cgd2UgaGF2ZSBhbGwgdGhlIGtleXMgd2hpY2ggc2hvdWxkIGJlIGRlbGV0ZWRcclxuICAgICAgLy8gaW4gdGhlIGFycmF5IGtleXNUb0RlbGV0ZS5cclxuICAgICAgY29uc29sZS5sb2coa2V5c1RvRGVsZXRlKTtcclxuICAgICAga2V5c1RvRGVsZXRlLmZvckVhY2goZnVuY3Rpb24gKGFLZXkpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShhS2V5KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW1vdmVXb3JkcygpIHtcclxuICAgIHZhciBhS2V5UHJlZml4ID0gdGhpcy5uYW1lICsgJy1pbmRleCc7XHJcblxyXG4gICAgdGhpcy5yZW1vdmVPYmplY3RzKGFLZXlQcmVmaXgpO1xyXG4gICAgLy8gcmVzZXQgaW5kZXhcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZSArICctd29yZHMnLCAnJyk7XHJcbiAgICAvLyB0aGlzIG9uZSB0cmlnZ2VycyB0aGF0IG1lbW9yeXN0b3JlIGlzIGV4ZWN1dGVkXHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLm5hbWUgKyAnLXNldHRpbmdzJyk7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95KCkge1xyXG4gICAgdmFyIGFLZXlQcmVmaXggPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgdGhpcy5yZW1vdmVPYmplY3RzKGFLZXlQcmVmaXgpO1xyXG4gIH1cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL3V0aWxzL0xXLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gdGhpcy5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICpcclxuICogVXBkYXRlZCBieSBIYW5uZXMgSGlyemVsLCBOb3ZlbWJlciAyMDE2XHJcbiAqXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCBMV0NsYXNzIGZyb20gJy4uLy4uL2pzL3V0aWxzL0xXJztcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3NDbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmlucHV0Rmlyc3RDaGVjayA9ICQoJyNpbnB1dEZpcnN0Q2hlY2snKTtcclxuICAgIHRoaXMuaW5wdXRTZWNvbmRDaGVjayA9ICQoJyNpbnB1dFNlY29uZENoZWNrJyk7XHJcbiAgICB0aGlzLmlucHV0VGhpcmRDaGVjayA9ICQoJyNpbnB1dFRoaXJkQ2hlY2snKTtcclxuICAgIHRoaXMuc2V0dGluZ0Zyb20gPSAkKCcjc2V0dGluZ0Zyb20nKTtcclxuICAgIHRoaXMuZXJyb3JTZXR0aW5ncyA9ICQoJyNlcnJvclNldHRpbmdzJyk7XHJcblxyXG4gICAgdGhpcy5wYXJhbXMgPSB7fTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcjc2F2ZVNldHRpbmdzJywgdGhpcy5zYXZlU2V0dGluZyk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcjY2FuY2VsU2V0dGluZ3MnLCB0aGlzLmNhbmNlbFNldHRpbmcpO1xyXG4gIH1cclxuICBnZXRTZXR0aW5ncygpIHsgLy9yZWFkIHNldHRpbmcncyB2YWx1ZXNcclxuICAgIHZhciBzdG9yZWRTZXR0aW5ncyA9IExXLmdldFNldHRpbmdzKCk7XHJcblxyXG4gICAgJCh0aGlzLmlucHV0Rmlyc3RDaGVjaykudmFsKHN0b3JlZFNldHRpbmdzLmZpcnN0KTtcclxuICAgICQodGhpcy5pbnB1dFNlY29uZENoZWNrKS52YWwoc3RvcmVkU2V0dGluZ3Muc2Vjb25kKTtcclxuICAgICQodGhpcy5pbnB1dFRoaXJkQ2hlY2spLnZhbChzdG9yZWRTZXR0aW5ncy50aGlyZCk7XHJcblxyXG4gICAgdGhpcy5wYXJhbXMgPSBzdG9yZWRTZXR0aW5nczsgLy9zdG9yZSBsb2NhbFxyXG4gIH1cclxuXHJcbiAgc2F2ZVNldHRpbmcoKSB7IC8vc2F2ZSBzZXR0aW5nJ3MgdmFsdWVzIHRvIERCXHJcbiAgICAgIHZhciBmaXJzdCA9ICQodGhpcy5pbnB1dEZpcnN0Q2hlY2spLnZhbCgpLnRyaW0oKSxcclxuICAgICAgICBzZWNvbmQgPSAkKHRoaXMuaW5wdXRTZWNvbmRDaGVjaykudmFsKCkudHJpbSgpLFxyXG4gICAgICAgIHRoaXJkID0gJCh0aGlzLmlucHV0VGhpcmRDaGVjaykudmFsKCkudHJpbSgpLFxyXG4gICAgICAgIGZvcm0gPSAkKHRoaXMuc2V0dGluZ0Zyb20pLFxyXG4gICAgICAgIGVycm9yTmFtZSA9ICcnLFxyXG4gICAgICAgIGVycm9yID0gZmFsc2U7XHJcblxyXG4gICAgICBVdGlscy5jbGVhckZpZWxkcygpO1xyXG4gICAgICAvL2NoZWNrIGZvciBlbXB0eSBmaWVsZHNcclxuICAgICAgaWYgKCFmaXJzdCkge1xyXG4gICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykpO1xyXG4gICAgICAgIGVycm9yTmFtZSA9ICdlbXB0eSc7XHJcbiAgICAgIH0gZWxzZSBpZiAoIXNlY29uZCkge1xyXG4gICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykpO1xyXG4gICAgICAgIGVycm9yTmFtZSA9ICdlbXB0eSc7XHJcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXJkKSB7XHJcbiAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKSk7XHJcbiAgICAgICAgZXJyb3JOYW1lID0gJ2VtcHR5JztcclxuICAgICAgfSBlbHNlIHsgLy9vbmx5IGRpZ2l0cyBpcyB2YWxpZFxyXG4gICAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIoZmlyc3QpKSB7XHJcbiAgICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpKTtcclxuICAgICAgICAgIGVycm9yTmFtZSA9ICdudW1iZXInO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCFVdGlscy5pc051bWJlcihzZWNvbmQpKSB7XHJcbiAgICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpKTtcclxuICAgICAgICAgIGVycm9yTmFtZSA9ICdudW1iZXInO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCFVdGlscy5pc051bWJlcih0aGlyZCkpIHtcclxuICAgICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykpO1xyXG4gICAgICAgICAgZXJyb3JOYW1lID0gJ251bWJlcic7XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZXJyb3IpIHsgLy9zaG93IGVycm9yIGlmIGFueVxyXG4gICAgICAgIHZhciBlcnJvclR4dCA9ICgnZW1wdHknID09PSBlcnJvck5hbWUpID8gbG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5lcnJvckVtcHR5IDogbG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5lcnJvclZhbGlkO1xyXG4gICAgICAgICQodGhpcy5lcnJvclNldHRpbmdzKS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5JykudGV4dChlcnJvclR4dCk7XHJcbiAgICAgIH0gZWxzZSB7IC8vb3RoZXJ3aXNlIHNhdmUgbmV3IHNldHRpbmdzXHJcbiAgICAgICAgc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICBmaXJzdDogZmlyc3QsXHJcbiAgICAgICAgICBzZWNvbmQ6IHNlY29uZCxcclxuICAgICAgICAgIHRoaXJkOiB0aGlyZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgTFcucHV0U2V0dGluZ3Moc2V0dGluZ3MpO1xyXG4gICAgICAgICQodGhpcy5lcnJvclNldHRpbmdzKS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5JykudGV4dChsb2NhbFtsb2NhbC5jdXJyZW50TG9jYWxdLmVycm9yTm8pO1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHNldHRpbmdzOyAvL3N0b3JlIGxvY2FsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY2FuY2VsU2V0dGluZygpIHtcclxuICAgICAgVXRpbHMuY2xlYXJGaWVsZHMoKTtcclxuICAgICAgdGhpcy5nZXRTZXR0aW5ncygpO1xyXG4gICAgfVxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyB1dGlscy5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2xpaSBNYXJlemhhbnlpIGFrYSBlMXIwbmQvL1tDUkddIC0gTWFyY2ggMjAxNFxyXG4gKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gZTFyMG5kLmNyZ0BnbWFpbC5jb21cclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaWYgKHR5cGVvZiAoVXRpbHMpID09ICd1bmRlZmluZWQnIHx8IFV0aWxzID09IG51bGwgfHwgIVV0aWxzKSB7XHJcbiAgdmFyIFV0aWxzID0ge307XHJcblxyXG4gIFV0aWxzID0ge1xyXG4gICAgaXNOdW1iZXI6IGZ1bmN0aW9uIChzdHIsIHdpdGhEb3QpIHsgLy92YWxpZGF0ZSBmaWxlZCBmb3IgbnVtYmVyIHZhbHVlXHJcbiAgICAgIHZhciBOdW1iZXJSZWcgPSAvXlxcZCskLyxcclxuICAgICAgICBOdW1iZXJXaXRoRG90UmVnID0gL15bLStdP1swLTldKlxcLj9bMC05XSskLztcclxuXHJcbiAgICAgIHJldHVybiB3aXRoRG90ID8gTnVtYmVyV2l0aERvdFJlZy50ZXN0KHN0cikgOiBOdW1iZXJSZWcudGVzdChzdHIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGVhckZpZWxkczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcuZm9ybS1ncm91cCcpLmVhY2goZnVuY3Rpb24gKGksIG5vZGUpIHsgLy9jbGVhciBhbGwgZXJyb3Igc3R5bGVzXHJcbiAgICAgICAgJChub2RlKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcjZXJyb3JTZXR0aW5ncycpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0RmllbGRFcnJvcjogZnVuY3Rpb24gKHNlbGYpIHsgLy9zZXQgdGhlIGVycm9yIHN0eWxlIGZvciB0aGUgY3VycmVudCBpbnB1dCBmaWVsZFxyXG4gICAgICAkKHNlbGYpLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldFJhbmRvbUludDogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRUb2RheTogZnVuY3Rpb24gKGZ1bGxEYXRlKSB7XHJcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgaWYgKGZ1bGxEYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkudmFsdWVPZigpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCkpLnZhbHVlT2YoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbG9zZU1vYk1lbnU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQoJyNicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xJykuaGFzQ2xhc3MoJ2luJykpIHtcclxuICAgICAgICAkKCcjbmF2YmFyVG9nZ2xlJykuY2xpY2soKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB2YXIgaiwgeCwgaTtcclxuICAgICAgZm9yIChpID0gYS5sZW5ndGg7IGk7IGktLSkge1xyXG4gICAgICAgIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKTtcclxuICAgICAgICB4ID0gYVtpIC0gMV07XHJcbiAgICAgICAgYVtpIC0gMV0gPSBhW2pdO1xyXG4gICAgICAgIGFbal0gPSB4O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICE9IG51bGwpIHtcclxuICAgIGV4cG9ydHMuVXRpbHMgPSBVdGlscztcclxufVxyXG5cclxuZXhwb3J0IHtVdGlsc307XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy91dGlscy91dGlscy5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyBtZW1vcnlzdG9yZS5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIEphbnVhcnkgMjAxN1xyXG4gKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gYS5tZXJlemhhbnlpQGdtYWlsLmNvbVxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY29uc3QgTWVtb3J5c3RvcmUgPSBbXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MScsXHJcbiAgICAnd29yZCc6ICdkYXMgQXV0bycsXHJcbiAgICAndHJhbnNsYXRlJzogJ2NhcicsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDInLFxyXG4gICAgJ3dvcmQnOiAnbGF1ZmVuJyxcclxuICAgICd0cmFuc2xhdGUnOiAncnVuJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MycsXHJcbiAgICAnd29yZCc6ICdhbHQnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdvbGQnLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg0JyxcclxuICAgICd3b3JkJzogJ2tyYW5rJyxcclxuICAgICd0cmFuc2xhdGUnOiAnc2ljaycsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LCB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg1JyxcclxuICAgICd3b3JkJzogJ2hldXRlJyxcclxuICAgICd0cmFuc2xhdGUnOiAndG9kYXknLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSwge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4NicsXHJcbiAgICAnd29yZCc6ICdzY2hyZWliZW4nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICd3cml0ZScsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LCB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg3JyxcclxuICAgICd3b3JkJzogJ2hlbGwnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdsaWdodCcsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDgnLFxyXG4gICAgJ3dvcmQnOiAncmVpY2gnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdyaWNoJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4OScsXHJcbiAgICAnd29yZCc6ICdzw7zDnycsXHJcbiAgICAndHJhbnNsYXRlJzogJ3N3ZWV0JyxcclxuICAgICdzdGVwJzogMSxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MTAnLFxyXG4gICAgJ3dvcmQnOiAnd2VpYmxpY2gnLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdmZW1hbGUnLFxyXG4gICAgJ3N0ZXAnOiAxLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSwge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MTEnLFxyXG4gICAgJ3dvcmQnOiAnYmVzdGVsbGVuJyxcclxuICAgICd0cmFuc2xhdGUnOiAnb3JkZXInLFxyXG4gICAgJ3N0ZXAnOiAxLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgxMicsXHJcbiAgICAnd29yZCc6ICdrYWx0JyxcclxuICAgICd0cmFuc2xhdGUnOiAnY29sZCcsXHJcbiAgICAnc3RlcCc6IDIsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDEzJyxcclxuICAgICd3b3JkJzogJ3NhdWVyJyxcclxuICAgICd0cmFuc2xhdGUnOiAnc291cicsXHJcbiAgICAnc3RlcCc6IDIsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDE0JyxcclxuICAgICd3b3JkJzogJ2ZsaWVnZW4nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdmbHknLFxyXG4gICAgJ3N0ZXAnOiAzLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfVxyXG5dO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvdXRpbHMvbWVtb3J5c3RvcmUuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gbmF2aWdhdGlvbi5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscyc7XHJcbmxldCBOYXZpZ2F0aW9uID0ge307XHJcblxyXG5OYXZpZ2F0aW9uID0ge1xyXG4gIGhhc2hndWFyZDogZnVuY3Rpb24gKGluaXQpIHsgLy9vbkhhc2hDaGFuZ2VcclxuICAgIGlmIChpbml0KSB7XHJcbiAgICAgIHRoaXMuaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuaGFzaCAhPT0gd2luZG93LmxvY2F0aW9uLmhhc2gpIHtcclxuICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2hhc2hicmVhaycsIHtcclxuICAgICAgICAncHJldmhhc2gnOiB0aGlzLmhhc2hcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCh0aGlzLmhhc2hndWFyZC5iaW5kKHRoaXMpLCA1MCk7XHJcbiAgfSxcclxuXHJcbiAgaGFzaGJyZWFrOiBmdW5jdGlvbiAoKSB7IC8vaGFzaGNoYW5nZSBldmVudFxyXG4gICAgdmFyIGhhc2hVcmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgzKTtcclxuXHJcbiAgICBpZiAoaGFzaFVybCkge1xyXG4gICAgICAkKCdbZGF0YS10YXJnZXQ9JyArIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDMpICsgJ10nKS5jbGljaygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnW2RhdGEtdGFyZ2V0PXN1bW1hcnldJykuY2xpY2soKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBuYXZTZWxlY3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICQoJ1tkYXRhLXRvZ2dsZT1uYXZdJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgfSk7XHJcbiAgICAkKCdbZGF0YS10eXBlPW5hdi1zZWxlY3QtbGldJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJyMnICsgJCh0aGlzKS5kYXRhKCd0YXJnZXQnKSkucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgVXRpbHMuY2xvc2VNb2JNZW51KCk7XHJcbiAgfSxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnW2RhdGEtdHlwZT1uYXYtc2VsZWN0XScsIHRoaXMubmF2U2VsZWN0KTtcclxuICAgICQod2luZG93KS5iaW5kKCdoYXNoYnJlYWsnLCB0aGlzLmhhc2hicmVhayk7XHJcbiAgICB0aGlzLmhhc2hndWFyZChmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHtOYXZpZ2F0aW9ufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL3V0aWxzL25hdmlnYXRpb24uanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gbG9jYWwuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCBMV0NsYXNzIGZyb20gJy4uL3V0aWxzL0xXJztcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG5cclxuY29uc29sZS5sb2coJ2RlZmluZSBsb2NhbCcpO1xyXG5jb25zdCBsb2NhbCA9IHtcclxuICBlbl9HQjoge1xyXG4gICAgc3VtbWFyeTogJ1N1bW1hcnknLFxyXG4gICAgbGVhcm46ICdMZWFybicsXHJcbiAgICByZXBlYXQ6ICdSZXBlYXQnLFxyXG4gICAgdm9jYWJ1bGFyeTogJ1ZvY2FidWxhcnknLFxyXG4gICAgc2V0dGluZ3M6ICdTZXR0aW5ncycsXHJcbiAgICBlZGl0V29yZHM6ICdFZGl0IHdvcmRzJyxcclxuICAgIGZpcnN0OiAnRmlyc3QnLFxyXG4gICAgc2Vjb25kOiAnU2Vjb25kJyxcclxuICAgIHRoaXJkOiAnVGhpcmQnLFxyXG4gICAgc2F2ZUJ0bjogJ1NhdmUnLFxyXG4gICAgY2FuY2VsQnRuOiAnQ2FuY2VsJyxcclxuICAgIGxhbmd1YWdlOiAnTGFuZ3VhZ2UnLFxyXG4gICAgZW5fR0I6ICdlbmdsaXNoJyxcclxuICAgIGRlX0RFOiAnZGV1dHNjaCcsXHJcbiAgICBydV9SVTogJ9GA0YPRgdGB0LrQuNC5JyxcclxuICAgIGVycm9yRW1wdHk6ICdBbGwgZmllbGRzIGFyZSByZXF1aXJlZC4nLFxyXG4gICAgZXJyb3JWYWxpZDogJ0VudGVyZWQgdmFsdWVzIGFyZSBpbmNvcnJlY3QuJyxcclxuICAgIGVycm9yTm86ICdOZXcgc2V0dGluZ3Mgd2FzIHNhdmVkLicsXHJcbiAgICBlcnJvck5vVzogJ05ldyB3b3JkIHdhcyBhZGRlZC4nLFxyXG4gICAgdG90YWxXb3JkczogJ1RvdGFsIHdvcmRzJyxcclxuICAgIGxlYXJuV29yZHNOdW06ICdXb3JkcyB0byBsZWFybicsXHJcbiAgICByZXBlYXRXb3JkczogJ1dvcmRzIHRvIHJlcGVhdCcsXHJcbiAgICByZW1lbWJlckJ0bjogJ1JlbWVtYmVyJyxcclxuICAgIHJlcGVhdEJ0bjogJ1JlcGVhdCcsXHJcbiAgICBrbm93bkJ0bjogJ0tub3cnLFxyXG4gICAgYWxsV29yZHNPazogJ05vIG1vcmUgd29yZHMgZm9yIGxlYXJuaW5nLicsXHJcbiAgICBpbnB1dFdvcmRMYmw6ICdXb3JkJyxcclxuICAgIGlucHV0VHJhbnNsYXRlTGJsOiAnVHJhbnNsYXRlJyxcclxuICAgIGVudGVyQnRuOiAnQ2hlY2snLFxyXG4gICAgYWxsV29yZHNEb25lOiAnTm8gbW9yZSB3b3JkcyBmb3IgcmVwZWF0LidcclxuICB9LFxyXG5cclxuICBydV9SVToge1xyXG4gICAgc3VtbWFyeTogJ9Ch0LLQvtC00LrQsCcsXHJcbiAgICBsZWFybjogJ9Cj0YfQuNGC0YwnLFxyXG4gICAgcmVwZWF0OiAn0J/QvtCy0YLQvtGA0Y/RgtGMJyxcclxuICAgIHZvY2FidWxhcnk6ICfQodC70L7QstCw0YDRjCcsXHJcbiAgICBzZXR0aW5nczogJ9Cd0LDRgdGC0YDQvtC50LrQuCcsXHJcbiAgICBlZGl0V29yZHM6ICfQoNC10LTQsNC60YLQuNGA0L7QstCw0YLRjCDRgdC70L7QstCwJyxcclxuICAgIGZpcnN0OiAn0J/QtdGA0LLRi9C5JyxcclxuICAgIHNlY29uZDogJ9CS0YLQvtGA0L7QuScsXHJcbiAgICB0aGlyZDogJ9Ci0YDQtdGC0LjQuScsXHJcbiAgICBzYXZlQnRuOiAn0KHQvtGF0YDQsNC90LjRgtGMJyxcclxuICAgIGNhbmNlbEJ0bjogJ9Ce0YLQvNC10L3QuNGC0YwnLFxyXG4gICAgbGFuZ3VhZ2U6ICfQr9C30YvQuicsXHJcbiAgICBlbl9HQjogJ2VuZ2xpc2gnLFxyXG4gICAgZGVfREU6ICdkZXV0c2NoJyxcclxuICAgIHJ1X1JVOiAn0YDRg9GB0YHQutC40LknLFxyXG4gICAgZXJyb3JFbXB0eTogJ9CS0YHQtSDQv9C+0LvRjyDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdGLLicsXHJcbiAgICBlcnJvclZhbGlkOiAn0JLQstC10LTQtdC90L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0L3QtdCy0LDQu9C40LTQvdGLLicsXHJcbiAgICBlcnJvck5vOiAn0J3QvtCy0YvQtSDQt9C90LDRh9C10L3QuNC1INCx0YvQu9C4INC30LDQv9C40YHQsNC90YsuJyxcclxuICAgIGVycm9yTm9XOiAn0J3QvtCy0L7QtSDRgdC70L7QstC+INC00L7QsdCw0LLQu9C10L3Qvi4nLFxyXG4gICAgdG90YWxXb3JkczogJ9CS0YHQtdCz0L4g0YHQu9C+0LInLFxyXG4gICAgbGVhcm5Xb3Jkc051bTogJ9Ch0LvQvtCyINGD0YfQuNGC0YwnLFxyXG4gICAgcmVwZWF0V29yZHM6ICfQodC10LPQvtC00L3RjyDQv9C+0YLQvtGA0LjRgtGMINGB0LvQvtCyJyxcclxuICAgIHJlbWVtYmVyQnRuOiAn0JfQsNC/0L7QvNC90LjQuycsXHJcbiAgICByZXBlYXRCdG46ICfQn9C+0LLRgtC+0YDQuNGC0YwnLFxyXG4gICAga25vd25CdG46ICfQl9C90LDRjicsXHJcbiAgICBhbGxXb3Jkc09rOiAn0J3QtdGCINCx0L7Qu9GM0YjQtSDRgdC70L7QsiDQtNC70Y8g0LjQt9GD0YfQtdC90LjRjy4nLFxyXG4gICAgaW5wdXRXb3JkTGJsOiAn0KHQu9C+0LLQvicsXHJcbiAgICBpbnB1dFRyYW5zbGF0ZUxibDogJ9Cf0LXRgNC10LLQvtC0JyxcclxuICAgIGVudGVyQnRuOiAn0J/RgNC+0LLQtdGA0LjRgtGMJyxcclxuICAgIGFsbFdvcmRzRG9uZTogJ9Cd0LXRgiDQsdC+0LvRjNGI0LUg0YHQu9C+0LIg0LTQu9GPINC/0L7QstGC0L7RgNC10L3QuNGPLidcclxuICB9LFxyXG5cclxuICBkZV9ERToge1xyXG4gICAgc3VtbWFyeTogJ1N1bW1lJyxcclxuICAgIGxlYXJuOiAnTGVybmVuJyxcclxuICAgIHJlcGVhdDogJ1dpZWRlcmhvbGVuJyxcclxuICAgIHZvY2FidWxhcnk6ICdWb2thYnVsYXInLFxyXG4gICAgc2V0dGluZ3M6ICdSYWhtZW4nLFxyXG4gICAgZWRpdFdvcmRzOiAnV8O2cnRlciDDpG5kZXJuJyxcclxuICAgIGZpcnN0OiAnRXJzdGUnLFxyXG4gICAgc2Vjb25kOiAnWndlaXRlJyxcclxuICAgIHRoaXJkOiAnRHJpdHRlJyxcclxuICAgIHNhdmVCdG46ICdTcGVpY2hlcm4nLFxyXG4gICAgY2FuY2VsQnRuOiAnU3Rvcm5pZXJlbicsXHJcbiAgICBsYW5ndWFnZTogJ1NwcmFjaGUnLFxyXG4gICAgZW5fR0I6ICdlbmdsaXNoJyxcclxuICAgIGRlX0RFOiAnZGV1dHNjaCcsXHJcbiAgICBydV9SVTogJ9GA0YPRgdGB0LrQuNC5JyxcclxuICAgIGVycm9yRW1wdHk6ICdBbGxlIEZlbGRlciBzaW5kIGVyZm9yZGVybGljaC4nLFxyXG4gICAgZXJyb3JWYWxpZDogJ0VpbmdlZ2ViZW5lIFdlcnRlIHNpbmQgZmFsc2NoLicsXHJcbiAgICBlcnJvck5vOiAnTmV1ZSBFaW5zdGVsbHVuZ2VuIGdlc3BlaWNoZXJ0IHd1cmRlLicsXHJcbiAgICBlcnJvck5vVzogJ05ldWVzIFdvcnQgaGluenVnZWbDvGd0LicsXHJcbiAgICB0b3RhbFdvcmRzOiAnSW5zZ2VzYW10IFdvcnRlJyxcclxuICAgIGxlYXJuV29yZHNOdW06ICdXw7ZydGVyIHp1IGxlcm5lbicsXHJcbiAgICByZXBlYXRXb3JkczogJ1dvcnRlIHp1IHdpZWRlcmhvbGVuJyxcclxuICAgIHJlbWVtYmVyQnRuOiAnTWVya2VuJyxcclxuICAgIHJlcGVhdEJ0bjogJ1dpZWRlcmhvbGVuJyxcclxuICAgIGtub3duQnRuOiAnV2lzc2VuJyxcclxuICAgIGFsbFdvcmRzT2s6ICdLZWluZSBXb3J0ZSBtZWhyIGbDvHIgZGFzIExlcm5lbi4nLFxyXG4gICAgaW5wdXRXb3JkTGJsOiAnV29ydCcsXHJcbiAgICBpbnB1dFRyYW5zbGF0ZUxibDogJ8OcYmVyc2V0emVuJyxcclxuICAgIGVudGVyQnRuOiAnUHLDvGZlbicsXHJcbiAgICBhbGxXb3Jkc0RvbmU6ICdLZWluZSBXb3J0ZSBtZWhyIGbDvHIgd2llZGVyaG9sZW4uJ1xyXG4gIH0sXHJcblxyXG4gIGNoYW5nZUxvY2FsQ29udGVudDogZnVuY3Rpb24gKCkgeyAvLyBjaGFuZ2UgaW5uZXIgY29udGVudFxyXG4gICAgdmFyIGxhbmdOb2RlID0gJCgnW2RhdGEtdG9nZ2xlPWxhbmddJyksXHJcbiAgICAgIGxhbmdTZWxlY3QgPSAkKCdbZGF0YS10eXBlPWxhbmctc2VsZWN0XScpO1xyXG5cclxuICAgICQobGFuZ05vZGUpLmVhY2goZnVuY3Rpb24gKGksIG5vZGUpIHtcclxuICAgICAgJChub2RlKS50ZXh0KGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF1bJChub2RlKS5kYXRhKCdsYW5nJyldKTtcclxuICAgIH0pO1xyXG4gICAgJChsYW5nU2VsZWN0KS5lYWNoKGZ1bmN0aW9uIChpLCBub2RlKSB7XHJcbiAgICAgICQobm9kZSkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICBsYW5nU2VsZWN0OiBmdW5jdGlvbiAoKSB7IC8vY2hhbmdlIGxvY2FsaXphdGlvblxyXG4gICAgbG9jYWwuY3VycmVudExvY2FsID0gJCh0aGlzKS5kYXRhKCdsYW5nJyk7XHJcbiAgICAkKCcjbGFuZ1NlbGVjdCcpLmNsaWNrKCk7XHJcbiAgICAkKCcubmF2YmFyLXRvZ2dsZTp2aXNpYmxlJykuY2xpY2soKTtcclxuICAgIGxvY2FsLmNoYW5nZUxvY2FsQ29udGVudCgpO1xyXG4gICAgTFcuc3RvcmVJdGVtKExXLm5hbWUgKyAnLWxhbmd1YWdlJywgbG9jYWwuY3VycmVudExvY2FsKTtcclxuICAgICQodGhpcykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gdmFyIHNldHRpbmdzID0gTFcuZ2V0U2V0dGluZ3MoKTsgLy8gdG8gZm9yY2UgaW5pdGlhbGlzYXRpb24uXHJcbiAgICB0aGlzLmN1cnJlbnRMb2NhbCA9IExXLnJlYWRJdGVtKExXLm5hbWUgKyAnLWxhbmd1YWdlJyk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICdbZGF0YS10eXBlPWxhbmctc2VsZWN0XScsIGxvY2FsLmxhbmdTZWxlY3QpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCB7bG9jYWx9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvbG9jYWwvbG9jYWwuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gdm9jYWJ1bGFyeS5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGUxcjBuZC5jcmdAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IExXQ2xhc3MgZnJvbSAnLi4vdXRpbHMvTFcnO1xyXG5jb25zdCBMVyA9IG5ldyBMV0NsYXNzKCdMV2RiJyk7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vLi4vdXRpbHMvdXRpbHMnO1xyXG5pbXBvcnQge0xlYXJufSBmcm9tICcuL2xlYXJuJztcclxuaW1wb3J0IHtSZXBlYXR9IGZyb20gJy4vcmVwZWF0JztcclxuXHJcbmNvbnN0IFZvY2FidWxhcnkgPSB7XHJcbiAgcm93VGVtcGxhdGU6ICc8ZGl2IGlkPVwie3tub2RlfX1cIiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJjb2wtbWQtNSBjb2wtc20tNSBjb2wteHMtNFwiPnt7dHh0fX08L2Rpdj4nICtcclxuICAgICc8ZGl2IGNsYXNzPVwiY29sLW1kLTUgY29sLXNtLTUgY29sLXhzLTRcIj57e3RyYW5zbGF0ZX19PC9kaXY+JyArXHJcbiAgICAnPGRpdiBjbGFzcz1cImNvbC1tZC0yIGNvbC1zbS0yIGNvbC14cy00XCI+PGJ1dHRvbiBkYXRhLW5vZGU9XCJ7e25vZGV9fVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4taW5mbyBqcy1lZGl0LWJ0blwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCI+PC9zcGFuPjwvYnV0dG9uPjwvZGl2PicgK1xyXG4gICAgJzwvZGl2PicgK1xyXG4gICAgJzxkaXYgaWQ9XCJ7e25vZGV9fUVkaXRcIiBjbGFzcz1cInJvdyBub2Rpc3BsYXlcIj48Zm9ybSBpZD1cImZvcm0te3tub2RlfX1cIiByb2xlPVwiZm9ybVwiPicgK1xyXG4gICAgJzxkaXYgY2xhc3M9XCJjb2wtbWQtNSBjb2wtc20tNSBjb2wteHMtNFwiPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucC1mbGRcIiBpZD1cIndvcmQte3tub2RlfX1cIiBwbGFjZWhvbGRlcj1cIkVudGVyIHdvcmRcIiB2YWx1ZT1cInt7dHh0fX1cIj48L2Rpdj4nICtcclxuICAgICc8ZGl2IGNsYXNzPVwiY29sLW1kLTUgY29sLXNtLTUgY29sLXhzLTRcIj48aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnAtZmxkXCIgaWQ9XCJ0cmFuc2xhdGUte3tub2RlfX1cIiBwbGFjZWhvbGRlcj1cIkVudGVyIHRyYW5zbGF0ZVwiIHZhbHVlPVwie3t0cmFuc2xhdGV9fVwiPjwvZGl2PicgK1xyXG4gICAgJzxkaXYgY2xhc3M9XCJjb2wtbWQtMiBjb2wtc20tMiBjb2wteHMtNFwiPjxidXR0b24gZGF0YS1ub2RlPVwie3tub2RlfX1cIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3MganMtc2F2ZS1idG5cIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tb2tcIj48L3NwYW4+PC9idXR0b24+JyArXHJcbiAgICAnPGJ1dHRvbiBpZD1cImRlbC17e25vZGV9fVwiIGRhdGEtbm9kZT1cInt7bm9kZX19XCIgZGF0YS1pZD1cInt7aW5kZXh9fVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGpzLWRlbC1idG5cIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlXCI+PC9zcGFuPjwvYnV0dG9uPicgK1xyXG4gICAgJzwvZGl2PjwvZm9ybT4nICtcclxuICAgICc8L2Rpdj4nLFxyXG5cclxuICB0b3RhbFdvcmRzTnVtOiAkKCcjdG90YWxXb3Jkc051bScpLFxyXG4gIHZvY2FidWxhcnlCb3g6ICQoJyN2b2NhYnVsYXJ5Qm94JyksXHJcbiAgZXJyb3JWb2NhYnVsYXJ5Qm94OiAkKCcjZXJyb3JWb2NhYnVsYXJ5Qm94JyksXHJcbiAgZXJyb3JWb2NhYnVsYXJ5OiAkKCcjZXJyb3JWb2NhYnVsYXJ5JyksXHJcbiAgaW5wdXRXb3JkVHh0OiAkKCcjaW5wdXRXb3JkVHh0JyksXHJcbiAgaW5wdXRUcmFuc2xhdGU6ICQoJyNpbnB1dFRyYW5zbGF0ZScpLFxyXG4gIGFkZFdvcmRGb3JtOiAkKCcjYWRkV29yZEZvcm0nKSxcclxuXHJcbiAgd29yZHM6IFtdLFxyXG4gIHRyYW5zbGF0ZXM6IFtdLFxyXG5cclxuICByZWNvdW50VG90YWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICQoVm9jYWJ1bGFyeS50b3RhbFdvcmRzTnVtKS50ZXh0KExXLmluZGV4Lmxlbmd0aCk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlV29yZDogZnVuY3Rpb24gKHNlbGYsIG5vdFJlaW5kZXgpIHsgLy9yZW1vdmUgd29yZCBmcm9tIHZvY2FidWxhcnlcclxuICAgIHZhciBpZCA9ICQoc2VsZikuZGF0YSgnaWQnKSxcclxuICAgICAgbm9kZSA9ICQoc2VsZikuZGF0YSgnbm9kZScpO1xyXG5cclxuICAgIGlmICghbm90UmVpbmRleCkge1xyXG4gICAgICBMVy5pbmRleC5zcGxpY2UoaWQsIDEpOyAvL3JlbW92ZSBmcm9tIGluZGV4XHJcbiAgICAgIExXLnN0b3JlSXRlbShMVy5uYW1lICsgJy13b3JkcycsIExXLmluZGV4LmpvaW4oKSk7XHJcbiAgICB9XHJcbiAgICBMVy5yZW1vdmVJdGVtKExXLm5hbWUgKyAnLScgKyBub2RlKTsgLy9yZW1vdmUgdGhpcyB3b3JkXHJcbiAgICAkKCcjJyArIG5vZGUpLnJlbW92ZSgpO1xyXG4gICAgJCgnIycgKyBub2RlICsgJ0VkaXQnKS5yZW1vdmUoKTtcclxuICAgIFZvY2FidWxhcnkucmVjb3VudFRvdGFsKCk7XHJcbiAgICBMZWFybi53b3Jkc0xlYXJuID0gW107XHJcbiAgICBMZWFybi5yZWNvdW50SW5kZXhMZWFybigpO1xyXG4gICAgUmVwZWF0LndvcmRzUmVwZWF0ID0ge1xyXG4gICAgICBjdXJyZW50SW5kZXhGaXJzdDogMCxcclxuICAgICAgZmlyc3Q6IFtdLFxyXG4gICAgICBjdXJyZW50SW5kZXhTZWNvbmQ6IDAsXHJcbiAgICAgIHNlY29uZDogW10sXHJcbiAgICAgIGN1cnJlbnRJbmRleFRoaXJkOiAwLFxyXG4gICAgICB0aGlyZDogW11cclxuICAgIH07XHJcbiAgICBSZXBlYXQucmVjb3VudEluZGV4UmVwZWF0KCk7XHJcbiAgfSxcclxuXHJcbiAgdmlld1dvcmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjb250ZW50SW5uZXIgPSAnJztcclxuXHJcbiAgICAkKExXLmluZGV4KS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgbm9kZSkge1xyXG4gICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgdmFyIHR4dCwgdHJhbnNsYXRlO1xyXG4gICAgICB2YXIgaXRlbSA9IExXLnJlYWRJdGVtKExXLm5hbWUgKyAnLScgKyBub2RlKTtcclxuICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICB0eHQgPSBpdGVtLndvcmQ7XHJcbiAgICAgICAgdHJhbnNsYXRlID0gaXRlbS50cmFuc2xhdGU7XHJcblxyXG4gICAgICAgIFZvY2FidWxhcnkud29yZHMucHVzaCh0eHQpO1xyXG4gICAgICAgIFZvY2FidWxhcnkudHJhbnNsYXRlcy5wdXNoKHRyYW5zbGF0ZSk7XHJcbiAgICAgICAgY29udGVudElubmVyICs9IFZvY2FidWxhcnkucm93VGVtcGxhdGUucmVwbGFjZSgve3tub2RlfX0vZywgbm9kZSkucmVwbGFjZSgve3t0eHR9fS9nLCB0eHQpLnJlcGxhY2UoL3t7dHJhbnNsYXRlfX0vZywgdHJhbnNsYXRlKS5yZXBsYWNlKC97e2luZGV4fX0vZywgaW5kZXgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFZvY2FidWxhcnkudm9jYWJ1bGFyeUJveCkuaHRtbChjb250ZW50SW5uZXIpO1xyXG4gICAgVm9jYWJ1bGFyeS5yZWNvdW50VG90YWwoKTtcclxuICB9LFxyXG5cclxuICBhZGRTYXZlV29yZDogZnVuY3Rpb24gKHdvcmRUeHQsIHRyYW5zbGF0ZSwgYWRkRm9ybSwgYWRkV29yZCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGlucHV0V29yZCA9IHdvcmRUeHQudmFsKCkudHJpbSgpLFxyXG4gICAgICBpbnB1dFRyYW5zbGF0ZSA9IHRyYW5zbGF0ZS52YWwoKS50cmltKCksXHJcbiAgICAgIGZvcm0gPSBhZGRGb3JtLFxyXG4gICAgICBlcnJvciA9IGZhbHNlLFxyXG4gICAgICB3b3JkID0ge307XHJcblxyXG4gICAgVXRpbHMuY2xlYXJGaWVsZHMoKTtcclxuICAgIC8vY2hlY2sgZm9yIGVtcHR5IGZpZWxkc1xyXG4gICAgaWYgKCFpbnB1dFdvcmQpIHtcclxuICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpKTtcclxuICAgIH0gZWxzZSBpZiAoIWlucHV0VHJhbnNsYXRlKSB7XHJcbiAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXJyb3IpIHsgLy9zaG93IGVycm9yIGlmIGFueVxyXG4gICAgICAkKFZvY2FidWxhcnkuZXJyb3JWb2NhYnVsYXJ5Qm94KS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICAgICQoVm9jYWJ1bGFyeS5lcnJvclZvY2FidWxhcnkpLnRleHQobG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5lcnJvckVtcHR5KTtcclxuICAgIH0gZWxzZSB7IC8vb3RoZXJ3aXNlIHNhdmUgbmV3IHdvcmQgdG8gVm9jYWJ1bGFyeVxyXG4gICAgICB2YXIgbmV3SW5kZXhWYWw7XHJcbiAgICAgIHZhciB0b2RheURhdGUgPSBVdGlscy5nZXRUb2RheSh0cnVlKTtcclxuICAgICAgd29yZCA9IHtcclxuICAgICAgICBpbmRleDogdG9kYXlEYXRlLFxyXG4gICAgICAgIHdvcmQ6IGlucHV0V29yZCxcclxuICAgICAgICB0cmFuc2xhdGU6IGlucHV0VHJhbnNsYXRlLFxyXG4gICAgICAgIHN0ZXA6IDAsXHJcbiAgICAgICAgZGF0ZTogMFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gc2F2ZSBuZXdseSBhZGRlZCB3b3JkXHJcbiAgICAgIG5ld0luZGV4VmFsID0gJ2luZGV4JyArIChMVy5pbmRleC5sZW5ndGggKyAxKTtcclxuICAgICAgTFcuc3RvcmVJdGVtKExXLm5hbWUgKyAnLScgKyBuZXdJbmRleFZhbCwgd29yZCk7XHJcblxyXG4gICAgICB2YXIgY29udGVudElubmVyID0gVm9jYWJ1bGFyeS5yb3dUZW1wbGF0ZS5yZXBsYWNlKC97e25vZGV9fS9nLCB0b2RheURhdGUpLnJlcGxhY2UoL3t7dHh0fX0vZywgaW5wdXRXb3JkKS5yZXBsYWNlKC97e3RyYW5zbGF0ZX19L2csIGlucHV0VHJhbnNsYXRlKS5yZXBsYWNlKC97e2luZGV4fX0vZywgKGFkZFdvcmQpID8gTFcuaW5kZXgubGVuZ3RoIDogTFcuaW5kZXguaW5kZXhPZihpbnB1dFdvcmQpKTtcclxuXHJcbiAgICAgIGlmIChhZGRXb3JkKSB7XHJcbiAgICAgICAgTFcuaW5kZXgucHVzaChuZXdJbmRleFZhbCk7XHJcbiAgICAgICAgd29yZFR4dC52YWwoJycpO1xyXG4gICAgICAgIHRyYW5zbGF0ZS52YWwoJycpO1xyXG4gICAgICAgICQoVm9jYWJ1bGFyeS5lcnJvclZvY2FidWxhcnlCb3gpLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgICAgICAkKFZvY2FidWxhcnkuZXJyb3JWb2NhYnVsYXJ5KS50ZXh0KGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JOb1cpO1xyXG4gICAgICAgICQoVm9jYWJ1bGFyeS52b2NhYnVsYXJ5Qm94KS5hcHBlbmQoY29udGVudElubmVyKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaWQgPSB3b3JkVHh0LmF0dHIoJ2lkJykuc2xpY2UoNSk7XHJcblxyXG4gICAgICAgIExXLmluZGV4W0xXLmluZGV4LmluZGV4T2YoaWQpXSA9IG5ld0luZGV4VmFsO1xyXG4gICAgICAgICQoJyMnICsgaWQpLmJlZm9yZShjb250ZW50SW5uZXIpO1xyXG4gICAgICAgIFZvY2FidWxhcnkucmVtb3ZlV29yZCgkKCcjZGVsLScgKyBpZCksIHRydWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBMVy5zdG9yZUl0ZW0oTFcubmFtZSArICctd29yZHMnLCBMVy5pbmRleC5qb2luKCkpOyAvL2FkZCB3b3JkIHRvIFZvY2FidWxhcnkgbGlzdFxyXG4gICAgICBVdGlscy5jbGVhckZpZWxkcygpO1xyXG4gICAgICBWb2NhYnVsYXJ5LnJlY291bnRUb3RhbCgpO1xyXG4gICAgICBMZWFybi53b3Jkc0xlYXJuID0gW107XHJcbiAgICAgIExlYXJuLnJlY291bnRJbmRleExlYXJuKCk7XHJcbiAgICAgIExlYXJuLnNob3dXb3JkKCk7XHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJyNhZGRCdG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFZvY2FidWxhcnkuYWRkU2F2ZVdvcmQoJChWb2NhYnVsYXJ5LmlucHV0V29yZFR4dCksICQoVm9jYWJ1bGFyeS5pbnB1dFRyYW5zbGF0ZSksICQoVm9jYWJ1bGFyeS5hZGRXb3JkRm9ybSksIHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcuanMtZWRpdC1idG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJyMnICsgJCh0aGlzKS5kYXRhKCdub2RlJykpLmhpZGUoKTtcclxuICAgICAgJCgnIycgKyAkKHRoaXMpLmRhdGEoJ25vZGUnKSArICdFZGl0Jykuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcuanMtc2F2ZS1idG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFZvY2FidWxhcnkuYWRkU2F2ZVdvcmQoJCgnI3dvcmQtJyArICQodGhpcykuZGF0YSgnbm9kZScpKSwgJCgnI3RyYW5zbGF0ZS0nICsgJCh0aGlzKS5kYXRhKCdub2RlJykpLCAkKCcjZm9ybS0nICsgJCh0aGlzKS5kYXRhKCdub2RlJykpKTtcclxuICAgIH0pO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLmpzLWRlbC1idG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFZvY2FidWxhcnkucmVtb3ZlV29yZCh0aGlzKTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCB7Vm9jYWJ1bGFyeX07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy9hY3Rpb25zL3ZvY2FidWxhcnkuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyBsZWFybi5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICpcclxuICogVXBkYXRlZCBieSBIYW5uZXMgSGlyemVsLCBOb3ZlbWJlciAyMDE2XHJcbiAqXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBMV0NsYXNzIGZyb20gJy4uL3V0aWxzL0xXJztcclxuY29uc3QgTFcgPSBuZXcgTFdDbGFzcygnTFdkYicpO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuLy4uL3V0aWxzL3V0aWxzJztcclxuXHJcbmNvbnN0IExlYXJuID0ge1xyXG4gIHdvcmRzTGVhcm46IFtdLFxyXG4gIGN1cnJlbnRJbmRleDogMCxcclxuXHJcbiAgbGVhcm5Xb3Jkc051bTogJCgnI2xlYXJuV29yZHNOdW0nKSxcclxuICBsZWFybldvcmRzVG9wTnVtOiAkKCcjbGVhcm5Xb3Jkc1RvcE51bScpLFxyXG4gIGxlYXJuV29yZHNUb3BTTnVtOiAkKCcjbGVhcm5Xb3Jkc1RvcFNOdW0nKSxcclxuXHJcbiAgbGVhcm5Xb3JkOiAkKCcjbGVhcm5Xb3JkJyksXHJcbiAgdHJhbnNsYXRlV29yZDogJCgnI3RyYW5zbGF0ZVdvcmQnKSxcclxuICBsZWFybldvcmRzR3JwOiAkKCcjbGVhcm5Xb3Jkc0dycCcpLFxyXG4gIG5vV29yZHNMZWZ0OiAkKCcjbm9Xb3Jkc0xlZnQnKSxcclxuICBhbGxXb3Jkc09rOiAkKCcjYWxsV29yZHNPaycpLFxyXG5cclxuICByZWNvdW50SW5kZXhMZWFybjogZnVuY3Rpb24gKCkgeyAvL2NvdW50IHdvcmRzIHRvIGxlYXJuXHJcbiAgICBpZiAoIUxlYXJuLndvcmRzTGVhcm4ubGVuZ3RoKSB7XHJcbiAgICAgICQoTFcuaW5kZXgpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBub2RlKSB7IC8vdGhlIGluaXRpYWwgY291bnRpbmdcclxuICAgICAgICB2YXIgaXRlbSA9IExXLnJlYWRJdGVtKExXLm5hbWUgKyAnLScgKyBub2RlKTtcclxuICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgaWYgKDAgPT09IGl0ZW0uc3RlcCkge1xyXG4gICAgICAgICAgICBMZWFybi53b3Jkc0xlYXJuLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdMZWFybiByZWNvdW50SW5kZXhMZWFybicsIExlYXJuLndvcmRzTGVhcm4pO1xyXG4gICAgdmFyIHdvcmRzTGVhcm5MZW5ndGggPSAoTGVhcm4ud29yZHNMZWFybi5sZW5ndGgpID8gTGVhcm4ud29yZHNMZWFybi5sZW5ndGggOiAnJztcclxuXHJcbiAgICAkKGxlYXJuV29yZHNOdW0pLnRleHQod29yZHNMZWFybkxlbmd0aCB8fCAnMCcpO1xyXG4gICAgJChsZWFybldvcmRzVG9wTnVtKS50ZXh0KHdvcmRzTGVhcm5MZW5ndGgpO1xyXG4gICAgJChsZWFybldvcmRzVG9wU051bSkudGV4dCh3b3Jkc0xlYXJuTGVuZ3RoKTtcclxuICB9LFxyXG5cclxuICBzaG93V29yZDogZnVuY3Rpb24gKCkgeyAvL3Nob3cgYSBuZXh0IHdvcmQgdG8gbGVhcm5cclxuICAgIGlmIChMZWFybi53b3Jkc0xlYXJuLmxlbmd0aCkge1xyXG4gICAgICAkKGxlYXJuV29yZCkudGV4dChMZWFybi53b3Jkc0xlYXJuW0xlYXJuLmN1cnJlbnRJbmRleF0ud29yZCk7XHJcbiAgICAgICQodHJhbnNsYXRlV29yZCkudGV4dChMZWFybi53b3Jkc0xlYXJuW0xlYXJuLmN1cnJlbnRJbmRleF0udHJhbnNsYXRlKTtcclxuICAgICAgJChsZWFybldvcmRzR3JwKS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICAgICQobm9Xb3Jkc0xlZnQpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoYWxsV29yZHNPaykudGV4dChsb2NhbFtsb2NhbC5jdXJyZW50TG9jYWxdLmFsbFdvcmRzT2spO1xyXG4gICAgICAkKG5vV29yZHNMZWZ0KS5yZW1vdmVDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICAgICQobGVhcm5Xb3Jkc0dycCkuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGFjdGlvbldvcmQ6IGZ1bmN0aW9uIChzdGVwLCByZWluZGV4KSB7XHJcbiAgICBpZiAoc3RlcCkge1xyXG4gICAgICB2YXIgd29yZCA9IHtcclxuICAgICAgICBpbmRleDogTGVhcm4ud29yZHNMZWFybltMZWFybi5jdXJyZW50SW5kZXhdLmluZGV4LFxyXG4gICAgICAgIHdvcmQ6IExlYXJuLndvcmRzTGVhcm5bTGVhcm4uY3VycmVudEluZGV4XS53b3JkLFxyXG4gICAgICAgIHRyYW5zbGF0ZTogTGVhcm4ud29yZHNMZWFybltMZWFybi5jdXJyZW50SW5kZXhdLnRyYW5zbGF0ZSxcclxuICAgICAgICBzdGVwOiBzdGVwLFxyXG4gICAgICAgIGRhdGU6ICgxID09PSBzdGVwKSA/IChVdGlscy5nZXRUb2RheSgpICsgVXRpbHMuZGVsYXkgKiBTZXR0aW5ncy5wYXJhbXMuZmlyc3QpIDogMFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgTFcuc3RvcmVJdGVtKExXLm5hbWUgKyAnLScgKyBMZWFybi53b3Jkc0xlYXJuW0xlYXJuLmN1cnJlbnRJbmRleF0uaW5kZXgsIHdvcmQpOyAvL3NhdmUgd29yZFxyXG5cclxuICAgICAgaWYgKHJlaW5kZXgpIHtcclxuICAgICAgICBMZWFybi53b3Jkc0xlYXJuLnNwbGljZShMZWFybi5jdXJyZW50SW5kZXgsIDEpOyAvL3JlbW92ZSBmcm9tIGluZGV4XHJcbiAgICAgICAgTGVhcm4ucmVjb3VudEluZGV4TGVhcm4oKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBMZWFybi5jdXJyZW50SW5kZXgrKztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgTGVhcm4uY3VycmVudEluZGV4Kys7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKExlYXJuLmN1cnJlbnRJbmRleCA+PSBMZWFybi53b3Jkc0xlYXJuLmxlbmd0aCkge1xyXG4gICAgICBMZWFybi5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgfVxyXG4gICAgTGVhcm4uc2hvd1dvcmQoKTtcclxuICB9LFxyXG5cclxuICByZW1lbWJlcldvcmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIExlYXJuLmFjdGlvbldvcmQoMSwgdHJ1ZSk7XHJcbiAgfSxcclxuXHJcbiAgcmVwZWF0V29yZDogZnVuY3Rpb24gKCkge1xyXG4gICAgTGVhcm4uYWN0aW9uV29yZCgwKTtcclxuICB9LFxyXG5cclxuICBrbm93bldvcmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIExlYXJuLmFjdGlvbldvcmQoNCwgdHJ1ZSk7XHJcbiAgfSxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI3JlbWVtYmVyQnRuJywgTGVhcm4ucmVtZW1iZXJXb3JkKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJyNyZXBlYXRCdG4nLCBMZWFybi5yZXBlYXRXb3JkKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJyNrbm93bkJ0bicsIExlYXJuLmtub3duV29yZCk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHtMZWFybn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy9hY3Rpb25zL2xlYXJuLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIHJlcGVhdC5qc1xyXG4gKiBjb2RlZCBieSBBbmF0b2wgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGUxcjBuZC5jcmdAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IExXQ2xhc3MgZnJvbSAnLi4vdXRpbHMvTFcnO1xyXG5jb25zdCBMVyA9IG5ldyBMV0NsYXNzKCdMV2RiJyk7XHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vLi4vdXRpbHMvdXRpbHMnO1xyXG5pbXBvcnQge0xlYXJufSBmcm9tICcuL2xlYXJuJztcclxuXHJcbmltcG9ydCBTZXR0aW5nc0NsYXNzIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MnO1xyXG5jb25zdCBTZXR0aW5ncyA9IG5ldyBTZXR0aW5nc0NsYXNzKCk7XHJcblxyXG5jb25zdCBSZXBlYXQgPSB7XHJcbiAgd29yZHNSZXBlYXQ6IHtcclxuICAgIGZpcnN0OiBbXSxcclxuICAgIHNlY29uZDogW10sXHJcbiAgICB0aGlyZDogW11cclxuICB9LFxyXG5cclxuICByZXBlYXRXb3Jkc051bTogJCgnI3JlcGVhdFdvcmRzTnVtJyksXHJcbiAgcmVwZWF0V29yZHNUb3BOdW06ICQoJyNyZXBlYXRXb3Jkc1RvcE51bScpLFxyXG4gIHJlcGVhdFdvcmRzVG9wU051bTogJCgnI3JlcGVhdFdvcmRzVG9wU051bScpLFxyXG4gIGNoZWNrV29yZDogJCgnI2NoZWNrV29yZCcpLFxyXG4gIGNoZWNrV29yZElucDogJCgnI2NoZWNrV29yZElucCcpLFxyXG4gIGVudGVyV29yZDogJCgnI2VudGVyV29yZCcpLFxyXG4gIGlucHV0V29yZDogJCgnI2lucHV0V29yZCcpLFxyXG4gIG5vV29yZHNSZXBlYXQ6ICQoJyNub1dvcmRzUmVwZWF0JyksXHJcbiAgZW50ZXJCdG46ICQoJyNlbnRlckJ0bicpLFxyXG5cclxuICByZWNvdW50SW5kZXhSZXBlYXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vY291bnQgd29yZHMgdG8gUmVwZWF0XHJcbiAgICBpZiAoIVJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGggJiYgIVJlcGVhdC53b3Jkc1JlcGVhdC5zZWNvbmQubGVuZ3RoICYmICFSZXBlYXQud29yZHNSZXBlYXQudGhpcmQubGVuZ3RoKSB7XHJcbiAgICAgICQoTFcuaW5kZXgpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBub2RlKSB7IC8vdGhlIGluaXRpYWwgY291bnRpbmdcclxuICAgICAgICB2YXIgaXRlbSA9IExXLnJlYWRJdGVtKExXLm5hbWUgKyAnLScgKyBub2RlKTtcclxuICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgaWYgKFV0aWxzLmdldFRvZGF5KCkgPiBpdGVtLmRhdGUpIHsgLy9pZiB0aGlzIHdvcmQgaXMgZm9yIHRvZGF5XHJcbiAgICAgICAgICAgIGlmICgxID09PSBpdGVtLnN0ZXApIHtcclxuICAgICAgICAgICAgICBSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgyID09PSBpdGVtLnN0ZXApIHtcclxuICAgICAgICAgICAgICBSZXBlYXQud29yZHNSZXBlYXQuc2Vjb25kLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKDMgPT09IGl0ZW0uc3RlcCkge1xyXG4gICAgICAgICAgICAgIFJlcGVhdC53b3Jkc1JlcGVhdC50aGlyZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHZhciB3b3Jkc1JlcGVhdFRvdGFsID0gUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCArIFJlcGVhdC53b3Jkc1JlcGVhdC5zZWNvbmQubGVuZ3RoICsgUmVwZWF0LndvcmRzUmVwZWF0LnRoaXJkLmxlbmd0aCxcclxuICAgICAgd29yZHNSZXBlYXRMZW5ndGggPSAod29yZHNSZXBlYXRUb3RhbCkgPyB3b3Jkc1JlcGVhdFRvdGFsIDogJyc7XHJcblxyXG4gICAgJChyZXBlYXRXb3Jkc051bSkudGV4dCh3b3Jkc1JlcGVhdExlbmd0aCB8fCAnMCcpO1xyXG4gICAgJChyZXBlYXRXb3Jkc1RvcE51bSkudGV4dCh3b3Jkc1JlcGVhdExlbmd0aCk7XHJcbiAgICAkKHJlcGVhdFdvcmRzVG9wU051bSkudGV4dCh3b3Jkc1JlcGVhdExlbmd0aCk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0V29yZDogZnVuY3Rpb24gKGluZGV4LCBhcnJXb3Jkcykge1xyXG4gICAgLy9pZiBpbmRleCBpcyAwIHdlIGdldCB0aGUgY29ycmVjdCB3b3JkLiBUaGUgb3RoZXIgd29yZHMgYXJlIHJhbmRvbVxyXG4gICAgaWYgKDAgPT09IGluZGV4KSB7XHJcbiAgICAgIHdvcmRQbGFjZWhvbGRlciA9IFJlcGVhdC53b3Jkc1JlcGVhdFsoUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCkgPyAnZmlyc3QnIDogJ3NlY29uZCddWzBdWyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICd0cmFuc2xhdGUnIDogJ3dvcmQnXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdvcmRQbGFjZWhvbGRlciA9IFZvY2FidWxhcnlbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ3RyYW5zbGF0ZXMnIDogJ3dvcmRzJ11bVXRpbHMuZ2V0UmFuZG9tSW50KDAsIFZvY2FidWxhcnlbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ3RyYW5zbGF0ZXMnIDogJ3dvcmRzJ10ubGVuZ3RoIC0gMSldO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhcnJXb3Jkcy5pbmRleE9mKHdvcmRQbGFjZWhvbGRlcikgPj0gMCkge1xyXG4gICAgICBSZXBlYXQuZ2V0V29yZChpbmRleCwgYXJyV29yZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB3b3JkUGxhY2Vob2xkZXI7XHJcbiAgfSxcclxuXHJcbiAgc2hvd1dvcmQ6IGZ1bmN0aW9uICgpIHsgLy9zaG93IGEgbmV4dCB3b3JkIHRvIFJlcGVhdFxyXG4gICAgaWYgKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGggfHwgUmVwZWF0LndvcmRzUmVwZWF0LnNlY29uZC5sZW5ndGgpIHtcclxuICAgICAgdmFyIGlkID0gUmVwZWF0LndvcmRzUmVwZWF0WyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICdmaXJzdCcgOiAnc2Vjb25kJ11bMF0uaW5kZXgsXHJcbiAgICAgICAgd29yZFBsYWNlaG9sZGVyID0gJyc7XHJcbiAgICAgIHZhciBhcnJXb3JkcyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAkKGNoZWNrV29yZElucCkudGV4dChSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXVswXVsoUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCkgPyAnd29yZCcgOiAndHJhbnNsYXRlJ10pLmRhdGEoJ2lkJywgaWQpO1xyXG5cclxuICAgICAgdmFyIGFyck9wdGlvbkJ1dHRvbnMgPSAkKCdbZGF0YS10eXBlPWNoZWNrV29yZEJ0bl0nKTtcclxuICAgICAgLy90aGUgYW5zd2VyIGJ1dHRvbnMgYXJlIHNodWZmbGVkIHNvIHRoYXQgd2UgZG9uJ3Qga25vdyB3aGljaCBvbmUgaXMgdGhlIGNvcnJlY3Qgd29yZC5cclxuICAgICAgVXRpbHMuc2h1ZmZsZShhcnJPcHRpb25CdXR0b25zKTtcclxuXHJcbiAgICAgIGFyck9wdGlvbkJ1dHRvbnMuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuXHJcbiAgICAgICAgd29yZFBsYWNlaG9sZGVyID0gUmVwZWF0LmdldFdvcmQoaW5kZXgsIGFycldvcmRzKTtcclxuXHJcbiAgICAgICAgYXJyV29yZHNbaW5kZXhdID0gd29yZFBsYWNlaG9sZGVyO1xyXG5cclxuICAgICAgICAkKHRoaXMpLnRleHQod29yZFBsYWNlaG9sZGVyKTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoZW50ZXJCdG4pLmRhdGEoJ2RpcmVjdGlvbicsIHRydWUpO1xyXG4gICAgICAkKGNoZWNrV29yZCkucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKGVudGVyV29yZCkuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKG5vV29yZHNSZXBlYXQpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH0gZWxzZSBpZiAoUmVwZWF0LndvcmRzUmVwZWF0LnRoaXJkLmxlbmd0aCkge1xyXG4gICAgICAkKGVudGVyV29yZElucCkudGV4dChSZXBlYXQud29yZHNSZXBlYXQudGhpcmRbMF0udHJhbnNsYXRlKTtcclxuICAgICAgJChjaGVja1dvcmQpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgICAgJChlbnRlcldvcmQpLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgICAgJChub1dvcmRzUmVwZWF0KS5hZGRDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKGNoZWNrV29yZCkuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKGVudGVyV29yZCkuYWRkQ2xhc3MoJ25vZGlzcGxheScpO1xyXG4gICAgICAkKG5vV29yZHNSZXBlYXQpLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBhY3Rpb25Xb3JkOiBmdW5jdGlvbiAoc3RlcCwgcmVpbmRleCkge1xyXG4gICAgaWYgKHN0ZXApIHtcclxuXHJcbiAgICAgIExXLnN0b3JlSXRlbShMVy5uYW1lICsgJy0nICsgUmVwZWF0LndvcmRzUmVwZWF0W1JlcGVhdC5jdXJyZW50SW5kZXhdLndvcmQsIHdvcmQpOyAvL3NhdmUgd29yZFxyXG5cclxuICAgICAgaWYgKHJlaW5kZXgpIHtcclxuICAgICAgICBSZXBlYXQud29yZHNSZXBlYXQuc3BsaWNlKFJlcGVhdC5jdXJyZW50SW5kZXgsIDEpOyAvL3JlbW92ZSBmcm9tIGluZGV4XHJcbiAgICAgICAgUmVwZWF0LnJlY291bnRJbmRleFJlcGVhdCgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFJlcGVhdC5jdXJyZW50SW5kZXgrKztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgUmVwZWF0LmN1cnJlbnRJbmRleCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChSZXBlYXQuY3VycmVudEluZGV4ID49IFJlcGVhdC53b3Jkc1JlcGVhdC5sZW5ndGgpIHtcclxuICAgICAgUmVwZWF0LmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICB9XHJcbiAgICBSZXBlYXQuc2hvd1dvcmQoUmVwZWF0LmN1cnJlbnRJbmRleCk7XHJcbiAgfSxcclxuXHJcbiAgY2hlY2tXb3JkOiBmdW5jdGlvbiAoc2VsZikge1xyXG4gICAgdmFyIHdvcmQgPSB7XHJcbiAgICAgIGluZGV4OiBSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXVswXS5pbmRleCxcclxuICAgICAgd29yZDogUmVwZWF0LndvcmRzUmVwZWF0WyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICdmaXJzdCcgOiAnc2Vjb25kJ11bMF0ud29yZCxcclxuICAgICAgdHJhbnNsYXRlOiBSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXVswXS50cmFuc2xhdGUsXHJcbiAgICAgIHN0ZXA6IFJlcGVhdC53b3Jkc1JlcGVhdFsoUmVwZWF0LndvcmRzUmVwZWF0LmZpcnN0Lmxlbmd0aCkgPyAnZmlyc3QnIDogJ3NlY29uZCddWzBdLnN0ZXAsXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICgkKHNlbGYpLnRleHQoKSA9PT0gKChSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/IHdvcmQudHJhbnNsYXRlIDogd29yZC53b3JkKSkge1xyXG4gICAgICB3b3JkLnN0ZXArKztcclxuICAgICAgd29yZC5kYXRlID0gVXRpbHMuZ2V0VG9kYXkoKSArIFV0aWxzLmRlbGF5ICogU2V0dGluZ3MucGFyYW1zWyhSZXBlYXQud29yZHNSZXBlYXQuZmlyc3QubGVuZ3RoKSA/ICdzZWNvbmQnIDogJ3RoaXJkJ107XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3b3JkLnN0ZXAtLTtcclxuICAgICAgd29yZC5kYXRlID0gKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gMCA6IFV0aWxzLmdldFRvZGF5KCkgKyBVdGlscy5kZWxheSAqIFNldHRpbmdzLnBhcmFtcy5maXJzdDtcclxuICAgIH1cclxuICAgIExXLnN0b3JlSXRlbShMVy5uYW1lICsgJy0nICsgd29yZC5pbmRleCwgd29yZCk7IC8vc2F2ZSB3b3JkXHJcbiAgICBSZXBlYXQud29yZHNSZXBlYXRbKFJlcGVhdC53b3Jkc1JlcGVhdC5maXJzdC5sZW5ndGgpID8gJ2ZpcnN0JyA6ICdzZWNvbmQnXS5zcGxpY2UoMCwgMSk7IC8vcmVtb3ZlIGZyb20gaW5kZXhcclxuICAgIExlYXJuLndvcmRzTGVhcm4gPSBbXTtcclxuICAgIExlYXJuLnJlY291bnRJbmRleExlYXJuKCk7XHJcbiAgICBMZWFybi5zaG93V29yZCgpO1xyXG4gICAgUmVwZWF0LnJlY291bnRJbmRleFJlcGVhdCgpO1xyXG4gICAgUmVwZWF0LnNob3dXb3JkKCk7XHJcbiAgfSxcclxuXHJcbiAgcmVwZWF0V29yZDogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHdvcmQgPSB7XHJcbiAgICAgIGluZGV4OiBSZXBlYXQud29yZHNSZXBlYXQudGhpcmRbMF0uaW5kZXgsXHJcbiAgICAgIHdvcmQ6IFJlcGVhdC53b3Jkc1JlcGVhdC50aGlyZFswXS53b3JkLFxyXG4gICAgICB0cmFuc2xhdGU6IFJlcGVhdC53b3Jkc1JlcGVhdC50aGlyZFswXS50cmFuc2xhdGUsXHJcbiAgICAgIHN0ZXA6IFJlcGVhdC53b3Jkc1JlcGVhdC50aGlyZFswXS5zdGVwLFxyXG4gICAgfTtcclxuICAgIGlmICgkKGVudGVyV29yZElucCkudmFsKCkgPT09IHdvcmQud29yZCkge1xyXG4gICAgICB3b3JkLnN0ZXArKztcclxuICAgICAgd29yZC5kYXRlID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdvcmQuc3RlcC0tO1xyXG4gICAgICB3b3JkLmRhdGUgPSBVdGlscy5nZXRUb2RheSgpICsgVXRpbHMuZGVsYXkgKiBTZXR0aW5ncy5wYXJhbXMuc2Vjb25kO1xyXG4gICAgfTtcclxuICAgIExXLnN0b3JlSXRlbShMVy5uYW1lICsgJy0nICsgd29yZC5pbmRleCwgd29yZCk7IC8vc2F2ZSB3b3JkXHJcbiAgICBSZXBlYXQud29yZHNSZXBlYXQudGhpcmQuc3BsaWNlKDAsIDEpOyAvL3JlbW92ZSBmcm9tIGluZGV4XHJcbiAgICBMZWFybi53b3Jkc0xlYXJuID0gW107XHJcbiAgICBMZWFybi5yZWNvdW50SW5kZXhMZWFybigpO1xyXG4gICAgTGVhcm4uc2hvd1dvcmQoKTtcclxuICAgIFJlcGVhdC5yZWNvdW50SW5kZXhSZXBlYXQoKTtcclxuICAgIFJlcGVhdC5zaG93V29yZCgpO1xyXG4gIH0sXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJ1tkYXRhLXR5cGU9Y2hlY2tXb3JkQnRuXScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgUmVwZWF0LmNoZWNrV29yZCh0aGlzKTtcclxuICAgIH0pO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI2VudGVyQnRuJywgUmVwZWF0LnJlcGVhdFdvcmQpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCB7UmVwZWF0fTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL2FjdGlvbnMvcmVwZWF0LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==