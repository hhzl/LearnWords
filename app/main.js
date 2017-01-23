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
	
	var _local = __webpack_require__(6);
	
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
	
	console.log(LW.isLocalStorageAvailable());
	
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

/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvTFcuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2pzL3V0aWxzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL2FwcC9qcy91dGlscy9tZW1vcnlzdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvdXRpbHMvbmF2aWdhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvanMvbG9jYWwvbG9jYWwuanMiXSwibmFtZXMiOlsiTFciLCJjb25zb2xlIiwibG9nIiwiaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUiLCJTZXR0aW5ncyIsImlzT0siLCJpc0VtcHR5IiwibG9hZFdvcmRzIiwiaW5pdCIsImdldFNldHRpbmdzIiwiTFdDbGFzcyIsImRiTmFtZSIsImFsZXJ0IiwibmFtZSIsImluZGV4Iiwic3RySW5kZXgiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic3BsaXQiLCJ3aW5kb3ciLCJlIiwia2V5IiwiSlNPTiIsInBhcnNlIiwicmVtb3ZlSXRlbSIsInZhbHVlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsIlFVT1RBX0VYQ0VFREVEX0VSUiIsInRoZVNldHRpbmdzT2JqIiwic3RvcmVJdGVtIiwic2V0dGluZ3MiLCJyZWFkSXRlbSIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJ0aGVXb3JkcyIsImkiLCJhcnJheU9mS2V5cyIsInN0b3JlRWFjaEVsZW1lbnQiLCJlbGVtZW50Iiwic3RlcCIsImRhdGUiLCJwdXNoIiwiZm9yRWFjaCIsImJpbmQiLCJqb2luIiwibGVuZ3RoIiwic3RyVmFsdWUiLCJyZXN1bHQiLCJwcmVmaXhGb3JOdW1iZXIiLCJsYXN0SW5kZXhPZiIsImFLZXlQcmVmaXgiLCJrZXlzVG9EZWxldGUiLCJzdCIsImFLZXkiLCJyZW1vdmVPYmplY3RzIiwiU2V0dGluZ3NDbGFzcyIsImlucHV0Rmlyc3RDaGVjayIsIiQiLCJpbnB1dFNlY29uZENoZWNrIiwiaW5wdXRUaGlyZENoZWNrIiwic2V0dGluZ0Zyb20iLCJlcnJvclNldHRpbmdzIiwicGFyYW1zIiwiZG9jdW1lbnQiLCJvbiIsInNhdmVTZXR0aW5nIiwiY2FuY2VsU2V0dGluZyIsInN0b3JlZFNldHRpbmdzIiwidmFsIiwidHJpbSIsImZvcm0iLCJlcnJvck5hbWUiLCJlcnJvciIsIlV0aWxzIiwiY2xlYXJGaWVsZHMiLCJzZXRGaWVsZEVycm9yIiwiY2hpbGRyZW4iLCJpc051bWJlciIsImVycm9yVHh0IiwibG9jYWwiLCJjdXJyZW50TG9jYWwiLCJlcnJvckVtcHR5IiwiZXJyb3JWYWxpZCIsInJlbW92ZUNsYXNzIiwidGV4dCIsInB1dFNldHRpbmdzIiwiZXJyb3JObyIsInN0ciIsIndpdGhEb3QiLCJOdW1iZXJSZWciLCJOdW1iZXJXaXRoRG90UmVnIiwidGVzdCIsImVhY2giLCJub2RlIiwiYWRkQ2xhc3MiLCJzZWxmIiwiZ2V0UmFuZG9tSW50IiwibWluIiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ2V0VG9kYXkiLCJmdWxsRGF0ZSIsIm5vdyIsIkRhdGUiLCJ2YWx1ZU9mIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJjbG9zZU1vYk1lbnUiLCJoYXNDbGFzcyIsImNsaWNrIiwic2h1ZmZsZSIsImEiLCJqIiwieCIsIm1vZHVsZSIsImV4cG9ydHMiLCJNZW1vcnlzdG9yZSIsIk5hdmlnYXRpb24iLCJoYXNoZ3VhcmQiLCJoYXNoIiwibG9jYXRpb24iLCJ0cmlnZ2VyIiwic2V0VGltZW91dCIsImhhc2hicmVhayIsImhhc2hVcmwiLCJzbGljZSIsIm5hdlNlbGVjdCIsInBhcmVudCIsImRhdGEiLCJlbl9HQiIsInN1bW1hcnkiLCJsZWFybiIsInJlcGVhdCIsInZvY2FidWxhcnkiLCJlZGl0V29yZHMiLCJzYXZlQnRuIiwiY2FuY2VsQnRuIiwibGFuZ3VhZ2UiLCJkZV9ERSIsInJ1X1JVIiwiZXJyb3JOb1ciLCJ0b3RhbFdvcmRzIiwibGVhcm5Xb3Jkc051bSIsInJlcGVhdFdvcmRzIiwicmVtZW1iZXJCdG4iLCJyZXBlYXRCdG4iLCJrbm93bkJ0biIsImFsbFdvcmRzT2siLCJpbnB1dFdvcmRMYmwiLCJpbnB1dFRyYW5zbGF0ZUxibCIsImVudGVyQnRuIiwiYWxsV29yZHNEb25lIiwiY2hhbmdlTG9jYWxDb250ZW50IiwibGFuZ05vZGUiLCJsYW5nU2VsZWN0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7Ozs7QUFNQTs7QUFFQTs7OztBQUlBOzs7O0FBR0E7Ozs7QUFFQTs7QUFRQTs7QUFHQTs7OztBQW5CQSxLQUFNQSxLQUFLLGlCQUFZLE1BQVosQ0FBWDtBQUNBQyxTQUFRQyxHQUFSLENBQVlGLEdBQUdHLHVCQUFILEVBQVo7O0FBR0EsS0FBTUMsV0FBVyx3QkFBakI7O0FBS0E7QUFDQSxLQUFJSixHQUFHSyxJQUFILElBQVdMLEdBQUdNLE9BQWxCLEVBQTJCO0FBQ3pCTCxXQUFRQyxHQUFSLENBQVksa0NBQVo7QUFDQUYsTUFBR08sU0FBSDtBQUNBTixXQUFRQyxHQUFSLENBQVkscUNBQVo7QUFDRDs7QUFHRCx3QkFBV00sSUFBWDs7QUFHQSxjQUFNQSxJQUFOOztBQUVBO0FBQ0EsS0FBSSxJQUFKLEVBQWdDO0FBQzlCUCxXQUFRQyxHQUFSLDhCQUF1QyxlQUF2QztBQUNEO0FBQ0Q7QUFDQUUsVUFBU0ssV0FBVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUI7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoREE7Ozs7Ozs7OztLQVNxQkMsTztBQUNuQixvQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQixVQUFLTixJQUFMLEdBQVksS0FBWjtBQUNBLFNBQUksQ0FBQyxLQUFLRix1QkFBTCxFQUFMLEVBQXFDO0FBQ25DUyxhQUFNLGlDQUFOO0FBQ0EsY0FBTyxLQUFQO0FBQ0Q7QUFDRCxVQUFLQyxJQUFMLEdBQVlG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IiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuKiBMZWFybiBXb3JkcyAvLyBtYWluLmpzXHJcbiogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBKYW51YXJ5IDIwMTdcclxuKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gYS5tZXJlemhhbnlpQGdtYWlsLmNvbVxyXG4qIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IExXQ2xhc3MgZnJvbSAnLi91dGlscy9MVyc7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuY29uc29sZS5sb2coTFcuaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSk7XHJcblxyXG5pbXBvcnQgU2V0dGluZ3NDbGFzcyBmcm9tICcuLi9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmdzJztcclxuY29uc3QgU2V0dGluZ3MgPSBuZXcgU2V0dGluZ3NDbGFzcygpO1xyXG5cclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMvdXRpbHMnO1xyXG5cclxuaW1wb3J0IHtNZW1vcnlzdG9yZX0gZnJvbSAnLi91dGlscy9tZW1vcnlzdG9yZSc7XHJcbi8vIGxvYWQgdGhlIGRlZmF1bHQgd29yZHMgc2V0IGlmIG5lZWRlZFxyXG5pZiAoTFcuaXNPSyAmJiBMVy5pc0VtcHR5KSB7XHJcbiAgY29uc29sZS5sb2coJ21lbW9yeXN0b3JlOiBzdGFydCBsb2FkaW5nIHdvcmRzJyk7XHJcbiAgTFcubG9hZFdvcmRzKE1lbW9yeXN0b3JlKTtcclxuICBjb25zb2xlLmxvZygnbWVtb3J5c3RvcmU6IHdvcmRzIGhhdmUgYmVlbiBsb2FkZWQnKTtcclxufVxyXG5cclxuaW1wb3J0IHtOYXZpZ2F0aW9ufSBmcm9tICcuL3V0aWxzL25hdmlnYXRpb24nO1xyXG5OYXZpZ2F0aW9uLmluaXQoKTtcclxuXHJcbmltcG9ydCB7bG9jYWx9IGZyb20gJy4vbG9jYWwvbG9jYWwnO1xyXG5sb2NhbC5pbml0KCk7XHJcblxyXG4vLyBpbXBvcnQgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMvYWN0aW9ucyc7XHJcbmlmICgnZGV2ZWxvcG1lbnQnID09PSBOT0RFX0VOVikge1xyXG4gIGNvbnNvbGUubG9nKGBkZXZlbG9wbWVudCBlbnZpcm9ubWVudCAke05PREVfRU5WfWApO1xyXG59XHJcbi8vIHJlYWQgc2V0dGluZ3NcclxuU2V0dGluZ3MuZ2V0U2V0dGluZ3MoKTtcclxuXHJcbi8vIHNldCB1c2VyIHNhdmVkIGxvY2FsXHJcbi8vaWYgKGxvY2FsLmN1cnJlbnRMb2NhbCAhPT0gJCgnW2RhdGEtdHlwZT1sYW5nLS8vc2VsZWN0XS5zZWxlY3RlZCcpLmRhdGEoJ2xhbmcnKSkge1xyXG4vL1x0JCgnW2RhdGEtbGFuZz0nICsgbG9jYWwuY3VycmVudExvY2FsICsgJ10nKS5jbGljaygpO1xyXG4vL307XHJcblxyXG4vLyBWb2NhYnVsYXJ5LnZpZXdXb3JkKCk7XHJcbi8vIExlYXJuLnJlY291bnRJbmRleExlYXJuKCk7XHJcbi8vIExlYXJuLnNob3dXb3JkKCk7XHJcbi8vIFJlcGVhdC5yZWNvdW50SW5kZXhSZXBlYXQoKTtcclxuLy8gUmVwZWF0LnNob3dXb3JkKCk7XHJcbi8vIFV0aWxzLmNsb3NlTW9iTWVudSgpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvbWFpbi5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBMZWFybiBXb3JkcyAvLyBsb2NhbHN0b3JhZ2UuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueUBnbWFpbC5jb21cclxuICpcclxuICogVXBkYXRlZCBieSBIYW5uZXMgSGlyemVsLCBOb3ZlbWJlciAyMDE2XHJcbiAqXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExXQ2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKGRiTmFtZSkge1xyXG4gICAgdGhpcy5pc09LID0gZmFsc2U7XHJcbiAgICBpZiAoIXRoaXMuaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSkge1xyXG4gICAgICBhbGVydCgnTG9jYWwgU3RvcmFnZSBpcyBub3QgYXZhaWxhYmxlLicpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5uYW1lID0gZGJOYW1lO1xyXG4gICAgLy8gZ2V0IGluZGV4XHJcbiAgICB0aGlzLmluZGV4ID0gW107XHJcbiAgICB2YXIgc3RySW5kZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLm5hbWUgKyAnLXdvcmRzJyk7XHJcbiAgICBpZiAoc3RySW5kZXgpIHtcclxuICAgICAgdGhpcy5pbmRleCA9IHN0ckluZGV4LnNwbGl0KCcsJyk7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5pc09LID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGlzTG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmV0dXJuIHdpbmRvdyAmJiB3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWFkSXRlbShrZXkpIHtcclxuICAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW1vdmVJdGVtKGtleSkge1xyXG4gICAgaWYgKHRoaXMuaXNPSykge1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RvcmVJdGVtKGtleSwgdmFsdWUpIHtcclxuICAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSA9PT0gUVVPVEFfRVhDRUVERURfRVJSKSB7XHJcbiAgICAgICAgICBhbGVydCgnTG9jYWwgU3RvcmFnZSBpcyBmdWxsJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHV0U2V0dGluZ3ModGhlU2V0dGluZ3NPYmopIHtcclxuICAgIHRoaXMuc3RvcmVJdGVtKHRoaXMubmFtZSArICctd29yZHMtc2V0dGluZ3MnLCB0aGVTZXR0aW5nc09iaik7XHJcbiAgfVxyXG5cclxuICBnZXRTZXR0aW5ncygpIHtcclxuXHJcbiAgICB2YXIgc2V0dGluZ3MgPSB0aGlzLnJlYWRJdGVtKHRoaXMubmFtZSArICctd29yZHMtc2V0dGluZ3MnKTtcclxuICAgIGlmICghc2V0dGluZ3MpIHtcclxuICAgICAgLy8gdGhlIGFwcCBydW5zIGZvciB0aGUgZmlyc3QgdGltZSwgdGh1c1xyXG4gICAgICAvLyBpbml0aWFsaXplIHRoZSBzZXR0aW5nIG9iamVjdCBuZWVlZHMgdG8gYmUgaW5pdGlhbGl6ZWRcclxuICAgICAgLy8gd2l0aCBkZWZhdWx0IHZhbHVlcy5cclxuXHJcbiAgICAgIC8vIGZpcnN0IGlzIGZvciBib3ggKG9yIHN0ZXApIDEgaW4gdGhlIExlaXRuZXIgYm94O1xyXG4gICAgICAvLyAgICAgICBhc2sgdGhlIHdvcmQgYWdhaW4gYWZ0ZXIgMSBkYXlcclxuICAgICAgLy8gc2Vjb25kIGlzIGZvciBib3ggMiA7IGFzayB0aGUgd29yZCBhZ2FpbiBhZnRlciAzIGRheXNcclxuICAgICAgLy8gdGhpcmQgaXMgZm9yIGJveCAzIDsgYXNrIHRoZSB3b3JkIGFnYWluIGFmdGVyIDcgZGF5c1xyXG5cclxuICAgICAgLy8gTm90ZTogYm94IDAgaXMgZm9yIHRoZSBMZWFybiBtb2RlIGFuZCBpdCBub3Qgc2V0XHJcbiAgICAgIC8vIGFzIHRoZSB3b3JkcyBhcmUgYWNjZXNzaWJsZSBhbGwgdGhlIHRpbWVcclxuICAgICAgY29uc29sZS5sb2coJ2luaXRpYWxpemUgc2V0dGluZ3MnKTtcclxuICAgICAgc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgZmlyc3Q6IDEsXHJcbiAgICAgICAgc2Vjb25kOiAzLFxyXG4gICAgICAgIHRoaXJkOiA3XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMuc3RvcmVJdGVtKHRoaXMubmFtZSArICctc2V0dGluZ3MnLCBzZXR0aW5ncyk7XHJcbiAgICAgIHRoaXMuc3RvcmVJdGVtKHRoaXMubmFtZSArICctbGFuZ3VhZ2UnLCAnZW5fR0InKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBzZXR0aW5ncztcclxuICB9XHJcblxyXG4gIGxvYWRXb3Jkcyh0aGVXb3Jkcykge1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgdmFyIGFycmF5T2ZLZXlzID0gW107XHJcbiAgICBjb25zdCBzdG9yZUVhY2hFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgZWxlbWVudC5pbmRleCA9ICdpbmRleCcgKyArK2k7XHJcbiAgICAgIGVsZW1lbnQuc3RlcCA9IGVsZW1lbnQuZGF0ZSA9IDA7XHJcbiAgICAgIHRoaXMuc3RvcmVJdGVtKHRoaXMubmFtZSArICctJyArIGVsZW1lbnQuaW5kZXgsIGVsZW1lbnQpO1xyXG4gICAgICBhcnJheU9mS2V5cy5wdXNoKGVsZW1lbnQuaW5kZXgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGVXb3Jkcy5mb3JFYWNoKHN0b3JlRWFjaEVsZW1lbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgdGhpcy5zdG9yZUl0ZW0odGhpcy5uYW1lICsgJy13b3JkcycsIGFycmF5T2ZLZXlzLmpvaW4oKSk7XHJcbiAgICB0aGlzLmluZGV4ID0gYXJyYXlPZktleXM7XHJcblxyXG4gICAgY29uc29sZS5sb2coYXJyYXlPZktleXMubGVuZ3RoICsgJyB3b3JkcyBoYXZlIGJlZW4gbG9hZGVkJyk7XHJcbiAgfVxyXG5cclxuICBpc0VtcHR5KC8qa2V5Ki8pIHtcclxuICAgIGlmICh0aGlzLmlzT0spIHtcclxuICAgICAgcmV0dXJuICghdGhpcy5pbmRleC5sZW5ndGgpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZHVtcFdvcmRzKC8qYUtleVByZWZpeCovKSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgICd1c2Ugc3RyaWN0JztcclxuICAgICAgdmFyIGtleTtcclxuICAgICAgdmFyIHN0clZhbHVlO1xyXG4gICAgICB2YXIgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICB2YXIgcHJlZml4Rm9yTnVtYmVyID0gdGhpcy5uYW1lICsgJy1pbmRleCc7XHJcblxyXG4gICAgICAvLyBnbyB0aHJvdWdoIGFsbCBrZXlzIHN0YXJ0aW5nIHdpdGggdGhlIG5hbWVcclxuICAgICAgLy8gb2YgdGhlIGRhdGFiYXNlLCBpLmUgJ2xlYXJuV29yZHMtaW5kZXgxNCdcclxuICAgICAgLy8gY29sbGVjdCB0aGUgbWF0Y2hpbmcgb2JqZWN0cyBpbnRvIGFyclxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGtleSA9IGxvY2FsU3RvcmFnZS5rZXkoaSk7XHJcbiAgICAgICAgc3RyVmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG5cclxuICAgICAgICBpZiAoMCA9PT0ga2V5Lmxhc3RJbmRleE9mKHByZWZpeEZvck51bWJlciwgMCkpIHtcclxuICAgICAgICAgIHJlc3VsdC5wdXNoKEpTT04ucGFyc2Uoc3RyVmFsdWUpKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gRHVtcCB0aGUgYXJyYXkgYXMgSlNPTiBjb2RlIChmb3Igc2VsZWN0IGFsbCAvIGNvcHkpXHJcbiAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KSB7XHJcbiAgICBpZiAodGhpcy5pc09LKSB7XHJcbiAgICAgIHZhciBrZXk7XHJcbiAgICAgIC8vIHZhciBzdDtcclxuICAgICAgdmFyIGtleXNUb0RlbGV0ZSA9IFtdO1xyXG5cclxuICAgICAgLy8gZ28gdGhyb3VnaCBhbGwga2V5cyBzdGFydGluZyB3aXRoIHRoZSBuYW1lXHJcbiAgICAgIC8vIG9mIHRoZSBkYXRhYmFzZSwgaS5lICdsZWFybldvcmRzLWluZGV4MTQnXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcclxuICAgICAgICBzdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblxyXG4gICAgICAgIGlmICgwID09PSBrZXkubGFzdEluZGV4T2YoYUtleVByZWZpeCwgMCkpIHtcclxuICAgICAgICAgIGtleXNUb0RlbGV0ZS5wdXNoKGtleSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfTtcclxuICAgICAgLy8gbm93IHdlIGhhdmUgYWxsIHRoZSBrZXlzIHdoaWNoIHNob3VsZCBiZSBkZWxldGVkXHJcbiAgICAgIC8vIGluIHRoZSBhcnJheSBrZXlzVG9EZWxldGUuXHJcbiAgICAgIGNvbnNvbGUubG9nKGtleXNUb0RlbGV0ZSk7XHJcbiAgICAgIGtleXNUb0RlbGV0ZS5mb3JFYWNoKGZ1bmN0aW9uIChhS2V5KSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oYUtleSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlV29yZHMoKSB7XHJcbiAgICB2YXIgYUtleVByZWZpeCA9IHRoaXMubmFtZSArICctaW5kZXgnO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KTtcclxuICAgIC8vIHJlc2V0IGluZGV4XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm5hbWUgKyAnLXdvcmRzJywgJycpO1xyXG4gICAgLy8gdGhpcyBvbmUgdHJpZ2dlcnMgdGhhdCBtZW1vcnlzdG9yZSBpcyBleGVjdXRlZFxyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5uYW1lICsgJy1zZXR0aW5ncycpO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSgpIHtcclxuICAgIHZhciBhS2V5UHJlZml4ID0gdGhpcy5uYW1lO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlT2JqZWN0cyhhS2V5UHJlZml4KTtcclxuICB9XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy91dGlscy9MVy5qcyIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIHRoaXMuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiAqXHJcbiAqIFVwZGF0ZWQgYnkgSGFubmVzIEhpcnplbCwgTm92ZW1iZXIgMjAxNlxyXG4gKlxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuLi8uLi9qcy91dGlscy9MVyc7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzQ2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pbnB1dEZpcnN0Q2hlY2sgPSAkKCcjaW5wdXRGaXJzdENoZWNrJyk7XHJcbiAgICB0aGlzLmlucHV0U2Vjb25kQ2hlY2sgPSAkKCcjaW5wdXRTZWNvbmRDaGVjaycpO1xyXG4gICAgdGhpcy5pbnB1dFRoaXJkQ2hlY2sgPSAkKCcjaW5wdXRUaGlyZENoZWNrJyk7XHJcbiAgICB0aGlzLnNldHRpbmdGcm9tID0gJCgnI3NldHRpbmdGcm9tJyk7XHJcbiAgICB0aGlzLmVycm9yU2V0dGluZ3MgPSAkKCcjZXJyb3JTZXR0aW5ncycpO1xyXG5cclxuICAgIHRoaXMucGFyYW1zID0ge307XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI3NhdmVTZXR0aW5ncycsIHRoaXMuc2F2ZVNldHRpbmcpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnI2NhbmNlbFNldHRpbmdzJywgdGhpcy5jYW5jZWxTZXR0aW5nKTtcclxuICB9XHJcbiAgZ2V0U2V0dGluZ3MoKSB7IC8vcmVhZCBzZXR0aW5nJ3MgdmFsdWVzXHJcbiAgICB2YXIgc3RvcmVkU2V0dGluZ3MgPSBMVy5nZXRTZXR0aW5ncygpO1xyXG5cclxuICAgICQodGhpcy5pbnB1dEZpcnN0Q2hlY2spLnZhbChzdG9yZWRTZXR0aW5ncy5maXJzdCk7XHJcbiAgICAkKHRoaXMuaW5wdXRTZWNvbmRDaGVjaykudmFsKHN0b3JlZFNldHRpbmdzLnNlY29uZCk7XHJcbiAgICAkKHRoaXMuaW5wdXRUaGlyZENoZWNrKS52YWwoc3RvcmVkU2V0dGluZ3MudGhpcmQpO1xyXG5cclxuICAgIHRoaXMucGFyYW1zID0gc3RvcmVkU2V0dGluZ3M7IC8vc3RvcmUgbG9jYWxcclxuICB9XHJcblxyXG4gIHNhdmVTZXR0aW5nKCkgeyAvL3NhdmUgc2V0dGluZydzIHZhbHVlcyB0byBEQlxyXG4gICAgICB2YXIgZmlyc3QgPSAkKHRoaXMuaW5wdXRGaXJzdENoZWNrKS52YWwoKS50cmltKCksXHJcbiAgICAgICAgc2Vjb25kID0gJCh0aGlzLmlucHV0U2Vjb25kQ2hlY2spLnZhbCgpLnRyaW0oKSxcclxuICAgICAgICB0aGlyZCA9ICQodGhpcy5pbnB1dFRoaXJkQ2hlY2spLnZhbCgpLnRyaW0oKSxcclxuICAgICAgICBmb3JtID0gJCh0aGlzLnNldHRpbmdGcm9tKSxcclxuICAgICAgICBlcnJvck5hbWUgPSAnJyxcclxuICAgICAgICBlcnJvciA9IGZhbHNlO1xyXG5cclxuICAgICAgVXRpbHMuY2xlYXJGaWVsZHMoKTtcclxuICAgICAgLy9jaGVjayBmb3IgZW1wdHkgZmllbGRzXHJcbiAgICAgIGlmICghZmlyc3QpIHtcclxuICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpKTtcclxuICAgICAgICBlcnJvck5hbWUgPSAnZW1wdHknO1xyXG4gICAgICB9IGVsc2UgaWYgKCFzZWNvbmQpIHtcclxuICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpKTtcclxuICAgICAgICBlcnJvck5hbWUgPSAnZW1wdHknO1xyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlyZCkge1xyXG4gICAgICAgIGVycm9yID0gVXRpbHMuc2V0RmllbGRFcnJvcihmb3JtLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykpO1xyXG4gICAgICAgIGVycm9yTmFtZSA9ICdlbXB0eSc7XHJcbiAgICAgIH0gZWxzZSB7IC8vb25seSBkaWdpdHMgaXMgdmFsaWRcclxuICAgICAgICBpZiAoIVV0aWxzLmlzTnVtYmVyKGZpcnN0KSkge1xyXG4gICAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKSk7XHJcbiAgICAgICAgICBlcnJvck5hbWUgPSAnbnVtYmVyJztcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIoc2Vjb25kKSkge1xyXG4gICAgICAgICAgZXJyb3IgPSBVdGlscy5zZXRGaWVsZEVycm9yKGZvcm0uY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKSk7XHJcbiAgICAgICAgICBlcnJvck5hbWUgPSAnbnVtYmVyJztcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghVXRpbHMuaXNOdW1iZXIodGhpcmQpKSB7XHJcbiAgICAgICAgICBlcnJvciA9IFV0aWxzLnNldEZpZWxkRXJyb3IoZm9ybS5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpKTtcclxuICAgICAgICAgIGVycm9yTmFtZSA9ICdudW1iZXInO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGVycm9yKSB7IC8vc2hvdyBlcnJvciBpZiBhbnlcclxuICAgICAgICB2YXIgZXJyb3JUeHQgPSAoJ2VtcHR5JyA9PT0gZXJyb3JOYW1lKSA/IGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JFbXB0eSA6IGxvY2FsW2xvY2FsLmN1cnJlbnRMb2NhbF0uZXJyb3JWYWxpZDtcclxuICAgICAgICAkKHRoaXMuZXJyb3JTZXR0aW5ncykucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpLnRleHQoZXJyb3JUeHQpO1xyXG4gICAgICB9IGVsc2UgeyAvL290aGVyd2lzZSBzYXZlIG5ldyBzZXR0aW5nc1xyXG4gICAgICAgIHNldHRpbmdzID0ge1xyXG4gICAgICAgICAgZmlyc3Q6IGZpcnN0LFxyXG4gICAgICAgICAgc2Vjb25kOiBzZWNvbmQsXHJcbiAgICAgICAgICB0aGlyZDogdGhpcmRcclxuICAgICAgICB9O1xyXG4gICAgICAgIExXLnB1dFNldHRpbmdzKHNldHRpbmdzKTtcclxuICAgICAgICAkKHRoaXMuZXJyb3JTZXR0aW5ncykucmVtb3ZlQ2xhc3MoJ25vZGlzcGxheScpLnRleHQobG9jYWxbbG9jYWwuY3VycmVudExvY2FsXS5lcnJvck5vKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBzZXR0aW5nczsgLy9zdG9yZSBsb2NhbFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNhbmNlbFNldHRpbmcoKSB7XHJcbiAgICAgIFV0aWxzLmNsZWFyRmllbGRzKCk7XHJcbiAgICAgIHRoaXMuZ2V0U2V0dGluZ3MoKTtcclxuICAgIH1cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gdXRpbHMuanNcclxuICogY29kZWQgYnkgQW5hdG9saWkgTWFyZXpoYW55aSBha2EgZTFyMG5kLy9bQ1JHXSAtIE1hcmNoIDIwMTRcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGUxcjBuZC5jcmdAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmlmICh0eXBlb2YgKFV0aWxzKSA9PSAndW5kZWZpbmVkJyB8fCBVdGlscyA9PSBudWxsIHx8ICFVdGlscykge1xyXG4gIHZhciBVdGlscyA9IHt9O1xyXG5cclxuICBVdGlscyA9IHtcclxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbiAoc3RyLCB3aXRoRG90KSB7IC8vdmFsaWRhdGUgZmlsZWQgZm9yIG51bWJlciB2YWx1ZVxyXG4gICAgICB2YXIgTnVtYmVyUmVnID0gL15cXGQrJC8sXHJcbiAgICAgICAgTnVtYmVyV2l0aERvdFJlZyA9IC9eWy0rXT9bMC05XSpcXC4/WzAtOV0rJC87XHJcblxyXG4gICAgICByZXR1cm4gd2l0aERvdCA/IE51bWJlcldpdGhEb3RSZWcudGVzdChzdHIpIDogTnVtYmVyUmVnLnRlc3Qoc3RyKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJGaWVsZHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLmZvcm0tZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uIChpLCBub2RlKSB7IC8vY2xlYXIgYWxsIGVycm9yIHN0eWxlc1xyXG4gICAgICAgICQobm9kZSkucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnI2Vycm9yU2V0dGluZ3MnKS5hZGRDbGFzcygnbm9kaXNwbGF5Jyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEZpZWxkRXJyb3I6IGZ1bmN0aW9uIChzZWxmKSB7IC8vc2V0IHRoZSBlcnJvciBzdHlsZSBmb3IgdGhlIGN1cnJlbnQgaW5wdXQgZmllbGRcclxuICAgICAgJChzZWxmKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSYW5kb21JbnQ6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0VG9kYXk6IGZ1bmN0aW9uIChmdWxsRGF0ZSkge1xyXG4gICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgIGlmIChmdWxsRGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpKS52YWx1ZU9mKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xvc2VNb2JNZW51OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkKCcjYnMtZXhhbXBsZS1uYXZiYXItY29sbGFwc2UtMScpLmhhc0NsYXNzKCdpbicpKSB7XHJcbiAgICAgICAgJCgnI25hdmJhclRvZ2dsZScpLmNsaWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2h1ZmZsZTogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdmFyIGosIHgsIGk7XHJcbiAgICAgIGZvciAoaSA9IGEubGVuZ3RoOyBpOyBpLS0pIHtcclxuICAgICAgICBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSk7XHJcbiAgICAgICAgeCA9IGFbaSAtIDFdO1xyXG4gICAgICAgIGFbaSAtIDFdID0gYVtqXTtcclxuICAgICAgICBhW2pdID0geDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAhPSBudWxsKSB7XHJcbiAgICBleHBvcnRzLlV0aWxzID0gVXRpbHM7XHJcbn1cclxuXHJcbmV4cG9ydCB7VXRpbHN9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvanMvdXRpbHMvdXRpbHMuanMiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogTGVhcm4gV29yZHMgLy8gbWVtb3J5c3RvcmUuanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBKYW51YXJ5IDIwMTdcclxuICogaHR0cDovL2xpbmtlZGluLmNvbS9pbi9tZXJlemhhbnkvIGEubWVyZXpoYW55aUBnbWFpbC5jb21cclxuICogUGxhY2VkIGluIHB1YmxpYyBkb21haW4uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGNvbnN0IE1lbW9yeXN0b3JlID0gW1xyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDEnLFxyXG4gICAgJ3dvcmQnOiAnZGFzIEF1dG8nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdjYXInLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgyJyxcclxuICAgICd3b3JkJzogJ2xhdWZlbicsXHJcbiAgICAndHJhbnNsYXRlJzogJ3J1bicsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDMnLFxyXG4gICAgJ3dvcmQnOiAnYWx0JyxcclxuICAgICd0cmFuc2xhdGUnOiAnb2xkJyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4NCcsXHJcbiAgICAnd29yZCc6ICdrcmFuaycsXHJcbiAgICAndHJhbnNsYXRlJzogJ3NpY2snLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSwge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4NScsXHJcbiAgICAnd29yZCc6ICdoZXV0ZScsXHJcbiAgICAndHJhbnNsYXRlJzogJ3RvZGF5JyxcclxuICAgICdzdGVwJzogMCxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sIHtcclxuICAgICdpbmRleCc6ICdpbmRleDYnLFxyXG4gICAgJ3dvcmQnOiAnc2NocmVpYmVuJyxcclxuICAgICd0cmFuc2xhdGUnOiAnd3JpdGUnLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSwge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4NycsXHJcbiAgICAnd29yZCc6ICdoZWxsJyxcclxuICAgICd0cmFuc2xhdGUnOiAnbGlnaHQnLFxyXG4gICAgJ3N0ZXAnOiAwLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXg4JyxcclxuICAgICd3b3JkJzogJ3JlaWNoJyxcclxuICAgICd0cmFuc2xhdGUnOiAncmljaCcsXHJcbiAgICAnc3RlcCc6IDAsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDknLFxyXG4gICAgJ3dvcmQnOiAnc8O8w58nLFxyXG4gICAgJ3RyYW5zbGF0ZSc6ICdzd2VldCcsXHJcbiAgICAnc3RlcCc6IDEsXHJcbiAgICAnZGF0ZSc6IDBcclxuICB9LFxyXG4gIHtcclxuICAgICdpbmRleCc6ICdpbmRleDEwJyxcclxuICAgICd3b3JkJzogJ3dlaWJsaWNoJyxcclxuICAgICd0cmFuc2xhdGUnOiAnZmVtYWxlJyxcclxuICAgICdzdGVwJzogMSxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sIHtcclxuICAgICdpbmRleCc6ICdpbmRleDExJyxcclxuICAgICd3b3JkJzogJ2Jlc3RlbGxlbicsXHJcbiAgICAndHJhbnNsYXRlJzogJ29yZGVyJyxcclxuICAgICdzdGVwJzogMSxcclxuICAgICdkYXRlJzogMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgJ2luZGV4JzogJ2luZGV4MTInLFxyXG4gICAgJ3dvcmQnOiAna2FsdCcsXHJcbiAgICAndHJhbnNsYXRlJzogJ2NvbGQnLFxyXG4gICAgJ3N0ZXAnOiAyLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgxMycsXHJcbiAgICAnd29yZCc6ICdzYXVlcicsXHJcbiAgICAndHJhbnNsYXRlJzogJ3NvdXInLFxyXG4gICAgJ3N0ZXAnOiAyLFxyXG4gICAgJ2RhdGUnOiAwXHJcbiAgfSxcclxuICB7XHJcbiAgICAnaW5kZXgnOiAnaW5kZXgxNCcsXHJcbiAgICAnd29yZCc6ICdmbGllZ2VuJyxcclxuICAgICd0cmFuc2xhdGUnOiAnZmx5JyxcclxuICAgICdzdGVwJzogMyxcclxuICAgICdkYXRlJzogMFxyXG4gIH1cclxuXTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2pzL3V0aWxzL21lbW9yeXN0b3JlLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIG5hdmlnYXRpb24uanNcclxuICogY29kZWQgYnkgQW5hdG9sIE1hcmV6aGFueWkgYWthIGUxcjBuZC8vW0NSR10gLSBNYXJjaCAyMDE0XHJcbiAqIGh0dHA6Ly9saW5rZWRpbi5jb20vaW4vbWVyZXpoYW55LyBhLm1lcmV6aGFueWlAZ21haWwuY29tXHJcbiAqIFBsYWNlZCBpbiBwdWJsaWMgZG9tYWluLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMnO1xyXG5sZXQgTmF2aWdhdGlvbiA9IHt9O1xyXG5cclxuTmF2aWdhdGlvbiA9IHtcclxuICBoYXNoZ3VhcmQ6IGZ1bmN0aW9uIChpbml0KSB7IC8vb25IYXNoQ2hhbmdlXHJcbiAgICBpZiAoaW5pdCkge1xyXG4gICAgICB0aGlzLmhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmhhc2ggIT09IHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XHJcbiAgICAgICQod2luZG93KS50cmlnZ2VyKCdoYXNoYnJlYWsnLCB7XHJcbiAgICAgICAgJ3ByZXZoYXNoJzogdGhpcy5oYXNoXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQodGhpcy5oYXNoZ3VhcmQuYmluZCh0aGlzKSwgNTApO1xyXG4gIH0sXHJcblxyXG4gIGhhc2hicmVhazogZnVuY3Rpb24gKCkgeyAvL2hhc2hjaGFuZ2UgZXZlbnRcclxuICAgIHZhciBoYXNoVXJsID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMyk7XHJcblxyXG4gICAgaWYgKGhhc2hVcmwpIHtcclxuICAgICAgJCgnW2RhdGEtdGFyZ2V0PScgKyB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgzKSArICddJykuY2xpY2soKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJ1tkYXRhLXRhcmdldD1zdW1tYXJ5XScpLmNsaWNrKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbmF2U2VsZWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCdbZGF0YS10b2dnbGU9bmF2XScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIH0pO1xyXG4gICAgJCgnW2RhdGEtdHlwZT1uYXYtc2VsZWN0LWxpXScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKCcjJyArICQodGhpcykuZGF0YSgndGFyZ2V0JykpLnJlbW92ZUNsYXNzKCdub2Rpc3BsYXknKTtcclxuICAgIFV0aWxzLmNsb3NlTW9iTWVudSgpO1xyXG4gIH0sXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJ1tkYXRhLXR5cGU9bmF2LXNlbGVjdF0nLCB0aGlzLm5hdlNlbGVjdCk7XHJcbiAgICAkKHdpbmRvdykuYmluZCgnaGFzaGJyZWFrJywgdGhpcy5oYXNoYnJlYWspO1xyXG4gICAgdGhpcy5oYXNoZ3VhcmQoZmFsc2UpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCB7TmF2aWdhdGlvbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy91dGlscy9uYXZpZ2F0aW9uLmpzIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIExlYXJuIFdvcmRzIC8vIGxvY2FsLmpzXHJcbiAqIGNvZGVkIGJ5IEFuYXRvbCBNYXJlemhhbnlpIGFrYSBlMXIwbmQvL1tDUkddIC0gTWFyY2ggMjAxNFxyXG4gKiBodHRwOi8vbGlua2VkaW4uY29tL2luL21lcmV6aGFueS8gYS5tZXJlemhhbnlpQGdtYWlsLmNvbVxyXG4gKiBQbGFjZWQgaW4gcHVibGljIGRvbWFpbi5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgTFdDbGFzcyBmcm9tICcuLi91dGlscy9MVyc7XHJcbmNvbnN0IExXID0gbmV3IExXQ2xhc3MoJ0xXZGInKTtcclxuY29uc29sZS5sb2coTFcuaXNMb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSk7XHJcblxyXG5jb25zb2xlLmxvZygnZGVmaW5lIGxvY2FsJyk7XHJcbmNvbnN0IGxvY2FsID0ge1xyXG4gIGVuX0dCOiB7XHJcbiAgICBzdW1tYXJ5OiAnU3VtbWFyeScsXHJcbiAgICBsZWFybjogJ0xlYXJuJyxcclxuICAgIHJlcGVhdDogJ1JlcGVhdCcsXHJcbiAgICB2b2NhYnVsYXJ5OiAnVm9jYWJ1bGFyeScsXHJcbiAgICBzZXR0aW5nczogJ1NldHRpbmdzJyxcclxuICAgIGVkaXRXb3JkczogJ0VkaXQgd29yZHMnLFxyXG4gICAgZmlyc3Q6ICdGaXJzdCcsXHJcbiAgICBzZWNvbmQ6ICdTZWNvbmQnLFxyXG4gICAgdGhpcmQ6ICdUaGlyZCcsXHJcbiAgICBzYXZlQnRuOiAnU2F2ZScsXHJcbiAgICBjYW5jZWxCdG46ICdDYW5jZWwnLFxyXG4gICAgbGFuZ3VhZ2U6ICdMYW5ndWFnZScsXHJcbiAgICBlbl9HQjogJ2VuZ2xpc2gnLFxyXG4gICAgZGVfREU6ICdkZXV0c2NoJyxcclxuICAgIHJ1X1JVOiAn0YDRg9GB0YHQutC40LknLFxyXG4gICAgZXJyb3JFbXB0eTogJ0FsbCBmaWVsZHMgYXJlIHJlcXVpcmVkLicsXHJcbiAgICBlcnJvclZhbGlkOiAnRW50ZXJlZCB2YWx1ZXMgYXJlIGluY29ycmVjdC4nLFxyXG4gICAgZXJyb3JObzogJ05ldyBzZXR0aW5ncyB3YXMgc2F2ZWQuJyxcclxuICAgIGVycm9yTm9XOiAnTmV3IHdvcmQgd2FzIGFkZGVkLicsXHJcbiAgICB0b3RhbFdvcmRzOiAnVG90YWwgd29yZHMnLFxyXG4gICAgbGVhcm5Xb3Jkc051bTogJ1dvcmRzIHRvIGxlYXJuJyxcclxuICAgIHJlcGVhdFdvcmRzOiAnV29yZHMgdG8gcmVwZWF0JyxcclxuICAgIHJlbWVtYmVyQnRuOiAnUmVtZW1iZXInLFxyXG4gICAgcmVwZWF0QnRuOiAnUmVwZWF0JyxcclxuICAgIGtub3duQnRuOiAnS25vdycsXHJcbiAgICBhbGxXb3Jkc09rOiAnTm8gbW9yZSB3b3JkcyBmb3IgbGVhcm5pbmcuJyxcclxuICAgIGlucHV0V29yZExibDogJ1dvcmQnLFxyXG4gICAgaW5wdXRUcmFuc2xhdGVMYmw6ICdUcmFuc2xhdGUnLFxyXG4gICAgZW50ZXJCdG46ICdDaGVjaycsXHJcbiAgICBhbGxXb3Jkc0RvbmU6ICdObyBtb3JlIHdvcmRzIGZvciByZXBlYXQuJ1xyXG4gIH0sXHJcblxyXG4gIHJ1X1JVOiB7XHJcbiAgICBzdW1tYXJ5OiAn0KHQstC+0LTQutCwJyxcclxuICAgIGxlYXJuOiAn0KPRh9C40YLRjCcsXHJcbiAgICByZXBlYXQ6ICfQn9C+0LLRgtC+0YDRj9GC0YwnLFxyXG4gICAgdm9jYWJ1bGFyeTogJ9Ch0LvQvtCy0LDRgNGMJyxcclxuICAgIHNldHRpbmdzOiAn0J3QsNGB0YLRgNC+0LnQutC4JyxcclxuICAgIGVkaXRXb3JkczogJ9Cg0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMINGB0LvQvtCy0LAnLFxyXG4gICAgZmlyc3Q6ICfQn9C10YDQstGL0LknLFxyXG4gICAgc2Vjb25kOiAn0JLRgtC+0YDQvtC5JyxcclxuICAgIHRoaXJkOiAn0KLRgNC10YLQuNC5JyxcclxuICAgIHNhdmVCdG46ICfQodC+0YXRgNCw0L3QuNGC0YwnLFxyXG4gICAgY2FuY2VsQnRuOiAn0J7RgtC80LXQvdC40YLRjCcsXHJcbiAgICBsYW5ndWFnZTogJ9Cv0LfRi9C6JyxcclxuICAgIGVuX0dCOiAnZW5nbGlzaCcsXHJcbiAgICBkZV9ERTogJ2RldXRzY2gnLFxyXG4gICAgcnVfUlU6ICfRgNGD0YHRgdC60LjQuScsXHJcbiAgICBlcnJvckVtcHR5OiAn0JLRgdC1INC/0L7Qu9GPINC+0LHRj9C30LDRgtC10LvRjNC90YsuJyxcclxuICAgIGVycm9yVmFsaWQ6ICfQktCy0LXQtNC10L3QvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQvdC10LLQsNC70LjQtNC90YsuJyxcclxuICAgIGVycm9yTm86ICfQndC+0LLRi9C1INC30L3QsNGH0LXQvdC40LUg0LHRi9C70Lgg0LfQsNC/0LjRgdCw0L3Riy4nLFxyXG4gICAgZXJyb3JOb1c6ICfQndC+0LLQvtC1INGB0LvQvtCy0L4g0LTQvtCx0LDQstC70LXQvdC+LicsXHJcbiAgICB0b3RhbFdvcmRzOiAn0JLRgdC10LPQviDRgdC70L7QsicsXHJcbiAgICBsZWFybldvcmRzTnVtOiAn0KHQu9C+0LIg0YPRh9C40YLRjCcsXHJcbiAgICByZXBlYXRXb3JkczogJ9Ch0LXQs9C+0LTQvdGPINC/0L7RgtC+0YDQuNGC0Ywg0YHQu9C+0LInLFxyXG4gICAgcmVtZW1iZXJCdG46ICfQl9Cw0L/QvtC80L3QuNC7JyxcclxuICAgIHJlcGVhdEJ0bjogJ9Cf0L7QstGC0L7RgNC40YLRjCcsXHJcbiAgICBrbm93bkJ0bjogJ9CX0L3QsNGOJyxcclxuICAgIGFsbFdvcmRzT2s6ICfQndC10YIg0LHQvtC70YzRiNC1INGB0LvQvtCyINC00LvRjyDQuNC30YPRh9C10L3QuNGPLicsXHJcbiAgICBpbnB1dFdvcmRMYmw6ICfQodC70L7QstC+JyxcclxuICAgIGlucHV0VHJhbnNsYXRlTGJsOiAn0J/QtdGA0LXQstC+0LQnLFxyXG4gICAgZW50ZXJCdG46ICfQn9GA0L7QstC10YDQuNGC0YwnLFxyXG4gICAgYWxsV29yZHNEb25lOiAn0J3QtdGCINCx0L7Qu9GM0YjQtSDRgdC70L7QsiDQtNC70Y8g0L/QvtCy0YLQvtGA0LXQvdC40Y8uJ1xyXG4gIH0sXHJcblxyXG4gIGRlX0RFOiB7XHJcbiAgICBzdW1tYXJ5OiAnU3VtbWUnLFxyXG4gICAgbGVhcm46ICdMZXJuZW4nLFxyXG4gICAgcmVwZWF0OiAnV2llZGVyaG9sZW4nLFxyXG4gICAgdm9jYWJ1bGFyeTogJ1Zva2FidWxhcicsXHJcbiAgICBzZXR0aW5nczogJ1JhaG1lbicsXHJcbiAgICBlZGl0V29yZHM6ICdXw7ZydGVyIMOkbmRlcm4nLFxyXG4gICAgZmlyc3Q6ICdFcnN0ZScsXHJcbiAgICBzZWNvbmQ6ICdad2VpdGUnLFxyXG4gICAgdGhpcmQ6ICdEcml0dGUnLFxyXG4gICAgc2F2ZUJ0bjogJ1NwZWljaGVybicsXHJcbiAgICBjYW5jZWxCdG46ICdTdG9ybmllcmVuJyxcclxuICAgIGxhbmd1YWdlOiAnU3ByYWNoZScsXHJcbiAgICBlbl9HQjogJ2VuZ2xpc2gnLFxyXG4gICAgZGVfREU6ICdkZXV0c2NoJyxcclxuICAgIHJ1X1JVOiAn0YDRg9GB0YHQutC40LknLFxyXG4gICAgZXJyb3JFbXB0eTogJ0FsbGUgRmVsZGVyIHNpbmQgZXJmb3JkZXJsaWNoLicsXHJcbiAgICBlcnJvclZhbGlkOiAnRWluZ2VnZWJlbmUgV2VydGUgc2luZCBmYWxzY2guJyxcclxuICAgIGVycm9yTm86ICdOZXVlIEVpbnN0ZWxsdW5nZW4gZ2VzcGVpY2hlcnQgd3VyZGUuJyxcclxuICAgIGVycm9yTm9XOiAnTmV1ZXMgV29ydCBoaW56dWdlZsO8Z3QuJyxcclxuICAgIHRvdGFsV29yZHM6ICdJbnNnZXNhbXQgV29ydGUnLFxyXG4gICAgbGVhcm5Xb3Jkc051bTogJ1fDtnJ0ZXIgenUgbGVybmVuJyxcclxuICAgIHJlcGVhdFdvcmRzOiAnV29ydGUgenUgd2llZGVyaG9sZW4nLFxyXG4gICAgcmVtZW1iZXJCdG46ICdNZXJrZW4nLFxyXG4gICAgcmVwZWF0QnRuOiAnV2llZGVyaG9sZW4nLFxyXG4gICAga25vd25CdG46ICdXaXNzZW4nLFxyXG4gICAgYWxsV29yZHNPazogJ0tlaW5lIFdvcnRlIG1laHIgZsO8ciBkYXMgTGVybmVuLicsXHJcbiAgICBpbnB1dFdvcmRMYmw6ICdXb3J0JyxcclxuICAgIGlucHV0VHJhbnNsYXRlTGJsOiAnw5xiZXJzZXR6ZW4nLFxyXG4gICAgZW50ZXJCdG46ICdQcsO8ZmVuJyxcclxuICAgIGFsbFdvcmRzRG9uZTogJ0tlaW5lIFdvcnRlIG1laHIgZsO8ciB3aWVkZXJob2xlbi4nXHJcbiAgfSxcclxuXHJcbiAgY2hhbmdlTG9jYWxDb250ZW50OiBmdW5jdGlvbiAoKSB7IC8vIGNoYW5nZSBpbm5lciBjb250ZW50XHJcbiAgICB2YXIgbGFuZ05vZGUgPSAkKCdbZGF0YS10b2dnbGU9bGFuZ10nKSxcclxuICAgICAgbGFuZ1NlbGVjdCA9ICQoJ1tkYXRhLXR5cGU9bGFuZy1zZWxlY3RdJyk7XHJcblxyXG4gICAgJChsYW5nTm9kZSkuZWFjaChmdW5jdGlvbiAoaSwgbm9kZSkge1xyXG4gICAgICAkKG5vZGUpLnRleHQobG9jYWxbbG9jYWwuY3VycmVudExvY2FsXVskKG5vZGUpLmRhdGEoJ2xhbmcnKV0pO1xyXG4gICAgfSk7XHJcbiAgICAkKGxhbmdTZWxlY3QpLmVhY2goZnVuY3Rpb24gKGksIG5vZGUpIHtcclxuICAgICAgJChub2RlKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIGxhbmdTZWxlY3Q6IGZ1bmN0aW9uICgpIHsgLy9jaGFuZ2UgbG9jYWxpemF0aW9uXHJcbiAgICBsb2NhbC5jdXJyZW50TG9jYWwgPSAkKHRoaXMpLmRhdGEoJ2xhbmcnKTtcclxuICAgICQoJyNsYW5nU2VsZWN0JykuY2xpY2soKTtcclxuICAgICQoJy5uYXZiYXItdG9nZ2xlOnZpc2libGUnKS5jbGljaygpO1xyXG4gICAgbG9jYWwuY2hhbmdlTG9jYWxDb250ZW50KCk7XHJcbiAgICBMVy5zdG9yZUl0ZW0oTFcubmFtZSArICctbGFuZ3VhZ2UnLCBsb2NhbC5jdXJyZW50TG9jYWwpO1xyXG4gICAgJCh0aGlzKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG5cclxuICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyB2YXIgc2V0dGluZ3MgPSBMVy5nZXRTZXR0aW5ncygpOyAvLyB0byBmb3JjZSBpbml0aWFsaXNhdGlvbi5cclxuICAgIHRoaXMuY3VycmVudExvY2FsID0gTFcucmVhZEl0ZW0oTFcubmFtZSArICctbGFuZ3VhZ2UnKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJ1tkYXRhLXR5cGU9bGFuZy1zZWxlY3RdJywgbG9jYWwubGFuZ1NlbGVjdCk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHtsb2NhbH07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9qcy9sb2NhbC9sb2NhbC5qcyJdLCJzb3VyY2VSb290IjoiIn0=