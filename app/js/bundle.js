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
	* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
	* http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
	* Placed in public domain.
	**************************************************/
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	
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
	Utils.closeMobMenu();


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	LW = {
	
	  isLocalStorageAvailable: function () {
	    try {
	      return 'localStorage' in window && window['localStorage'] !== null;
	    } catch (e) {
	      return false;
	    }
	  },
	
	  readItem: function (key) {
	    if (LW.isOK) {
	      return JSON.parse(localStorage.getItem(key));
	    }
	  },
	
	  removeItem: function (key) {
	    if (LW.isOK) {
	      localStorage.removeItem(key);
	    }
	  },
	
	  storeItem: function (key, value) {
	    if (LW.isOK) {
	      try {
	        localStorage.setItem(key, JSON.stringify(value));
	      } catch (e) {
	        if (e === QUOTA_EXCEEDED_ERR) {
	          alert('Local Storage is full');
	        }
	        return false;
	      }
	    }
	  },
	
	  putSettings: function (theSettingsObj) {
	    LW.storeItem(LW.name + '-words-settings', theSettingsObj);
	  },
	
	  getSettings: function () {
	
	    var settings = LW.readItem(LW.name + '-words-settings');
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
	      LW.storeItem(LW.name + '-settings', settings);
	      LW.storeItem(LW.name + '-language', 'en_GB');
	
	    };
	
	    return settings
	  },
	
	  loadWords: function (theWords) {
	    var i = 0;
	    var arrayOfKeys = [];
	
	    theWords.forEach(function (element) {
	      i = i + 1;
	      element.index = 'index' + i;
	      element.step = 0;
	      element.date = 0;
	      LW.storeItem(LW.name + '-' + element.index, element);
	      arrayOfKeys.push(element.index);
	    });
	
	    LW.storeItem(LW.name + '-words', arrayOfKeys.join());
	    LW.index = arrayOfKeys;
	
	    console.log(arrayOfKeys.length + ' words loaded');
	
	  },
	
	  isEmpty: function (key) {
	    if (LW.isOK) {
	      if (LW.index.length === 0) {
	        return true
	      } else {
	        return false
	      };
	    }
	  },
	
	  dumpWords: function (aKeyPrefix) {
	    if (LW.isOK) {
	      'use strict';
	      var key;
	      var strValue;
	      var result = [];
	
	      var prefixForNumber = LW.name + '-index';
	
	      // go through all keys starting with the name
	      // of the database, i.e 'learnWords-index14'
	      // collect the matching objects into arr
	      for (var i = 0; i < localStorage.length; i++) {
	        key = localStorage.key(i);
	        strValue = localStorage.getItem(key);
	
	        if (key.lastIndexOf(prefixForNumber, 0) === 0) {
	          result.push(JSON.parse(strValue));
	        };
	      };
	
	      // Dump the array as JSON code (for select all / copy)
	      console.log(JSON.stringify(result));
	    }
	  },
	
	  removeObjects: function (aKeyPrefix) {
	    if (LW.isOK) {
	      var key;
	      var st;
	      var keysToDelete = [];
	
	      // go through all keys starting with the name
	      // of the database, i.e 'learnWords-index14'
	      for (var i = 0; i < localStorage.length; i++) {
	        key = localStorage.key(i);
	        st = localStorage.getItem(key);
	
	        if (key.lastIndexOf(aKeyPrefix, 0) === 0) {
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
	  },
	
	  removeWords: function () {
	
	    var aKeyPrefix = LW.name + '-index';
	    LW.removeObjects(aKeyPrefix);
	
	    // reset index
	    localStorage.setItem(LW.name + '-words', '');
	
	    // this one triggers that memorystore is executed
	    localStorage.removeItem(LW.name + '-settings');
	
	  },
	
	  destroy: function () {
	
	    var aKeyPrefix = LW.name;
	
	    LW.removeObjects(aKeyPrefix);
	
	  },
	
	  init: function (dbName) {
	    LW.isOK = false;
	    if (!LW.isLocalStorageAvailable()) {
	      alert('Local Storage is not available.');
	      return false;
	    };
	    LW.name = dbName;
	    // get index
	    LW.index = [];
	    var strIndex = localStorage.getItem(LW.name + '-words');
	    if (strIndex) {
	      LW.index = strIndex.split(',')
	    };
	    LW.isOK = true;
	  }
	};
	
	// initialize database sub-object
	LW.init('LWdb');


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**************************************************
	 * Learn Words // utils.js
	 * coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
	 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	 * Placed in public domain.
	 **************************************************/
	if (typeof (Utils) == 'undefined' || Utils == null || !Utils) {
	
	  Utils = {
	
	    isNumber: function (str, withDot) { //validate filed for number value
	      var NumberReg = /^\d+$/,
	        NumberWithDotReg = /^[-+]?[0-9]*\.?[0-9]+$/;
	
	      return withDot ? NumberWithDotReg.test(str) : NumberReg.test(str);
	    },
	
	    clearFields: function () {
	      $('.form-group').each(function (i, node) { //clear all error styles
	        $(node).removeClass('has-error');
	      });
	      $('#errorSettings').addClass('nodisplay');
	    },
	
	    setFieldError: function (self) { //set the error style for the current input field
	      $(self).addClass('has-error');
	      return true;
	    },
	
	    getRandomInt: function (min, max) {
	      return Math.floor(Math.random() * (max - min + 1)) + min;
	    },
	
	    getToday: function (fullDate) {
	      var now = new Date();
	
	      if (fullDate) {
	        return new Date().valueOf();
	      } else {
	        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
	      }
	    },
	
	    closeMobMenu: function () {
	      if ($('#bs-example-navbar-collapse-1').hasClass('in')) {
	        $('#navbarToggle').click();
	      }
	    },
	    shuffle: function (a) {
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
/* 3 */
/***/ function(module, exports) {

	/**************************************************
	* Learn Words // memorystore.js
	*
	* Load initial set of German words with
	* English translation.
	*
	**************************************************/
	
	"use strict";
	
	if (LW.isOK && LW.isEmpty) {
	        console.log('memorystore: start loading words');
	
	LW.loadWords(
	[
	{"index":"index1","word":"das Auto","translate":"car","step":0,"date":0},
	{"index":"index2","word":"laufen","translate":"run","step":0,"date":0},
	{"index":"index3","word":"alt","translate":"old","step":0,"date":0},
	{"index":"index4","word":"krank","translate":"sick","step":0,"date":0},{"index":"index5","word":"heute","translate":"today","step":0,"date":0},{"index":"index6","word":"schreiben","translate":"write","step":0,"date":0},{"index":"index7","word":"hell","translate":"light","step":0,"date":0},
	{"index":"index8","word":"reich","translate":"rich","step":0,"date":0},
	{"index":"index9","word":"süß","translate":"sweet","step":1,"date":0},
	{"index":"index10","word":"weiblich","translate":"female","step":1,"date":0},{"index":"index11","word":"bestellen","translate":"order","step":1,"date":0},
	{"index":"index12","word":"kalt","translate":"cold","step":2,"date":0},
	{"index":"index13","word":"sauer","translate":"sour","step":2,"date":0},
	{"index":"index14","word":"fliegen","translate":"fly","step":3,"date":0}
	]
	);
	
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**************************************************
	* Learn Words // navigation.js
	* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
	* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	* Placed in public domain.
	**************************************************/
	if(typeof(Navigation) == 'undefined' || Navigation == null || !Navigation){
		
		Navigation = {
		
			hashguard: function(init){ //onHashChange
				if (init) this.hash = window.location.hash;
				if (this.hash != window.location.hash){
					$(window).trigger('hashbreak', {"prevhash":this.hash});
					this.hash = window.location.hash;
				}
				setTimeout('Navigation.hashguard(false)', 50);
			},
			
			hashbreak: function(){ //hashchange event
				var hashUrl = window.location.hash.slice(3);
				
				if (hashUrl) {
					$('[data-target=' + window.location.hash.slice(3) + ']').click();
				} else {
					$('[data-target=summary]').click();
				}
			},
			
			navSelect: function(){
				$('[data-toggle=nav]').each(function(){
					$(this).addClass('nodisplay');
				});
				$('[data-type=nav-select-li]').each(function(){
					$(this).removeClass('active');
				});
				$(this).parent().addClass('active');
				$('#'+$(this).data('target')).removeClass('nodisplay');
				Utils.closeMobMenu();
			},
			
			init: function(){
				$(document).on('click touchstart', '[data-type=nav-select]', Navigation.navSelect);
				$(window).bind('hashbreak', Navigation.hashbreak);
				Navigation.hashguard(false);
			}
		};
		
		Navigation.init();
	}
	


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**************************************************
	* Learn Words // local.js
	* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
	* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	* Placed in public domain.
	**************************************************/
	if(typeof(local) == 'undefined' || local == null || !local){
	console.log("define local");
		local = {
	
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
			changeLocalContent: function(){ // change inner content
				var langNode = $('[data-toggle=lang]'),
					langSelect = $('[data-type=lang-select]');
	
				$(langNode).each(function(i, node){
					$(node).text(local[local.currentLocal][$(node).data('lang')]);
				});
				$(langSelect).each(function(i, node){
					$(node).removeClass('selected');
				});
			},
	
			langSelect: function(){ //change localization
				local.currentLocal = $(this).data('lang');
				$('#langSelect').click();
				$('.navbar-toggle:visible').click();
				local.changeLocalContent();
				LW.storeItem(LW.name+'-language', local.currentLocal);
				$(this).addClass('selected');
				return false;
			},
	
			init: function(){
	                        var settings = LW.getSettings(); // to force initialisation.
				local.currentLocal = LW.readItem(LW.name+'-language');
				$(document).on('click touchstart', '[data-type=lang-select]', local.langSelect);
			}
		}
	
		local.init();
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**********************************************
	 * actions.js
	 *
	 * combination of
	 *   settings.js
	 *   learn.js
	 *   repeat.js
	 *   vocabulary.js
	 *
	 * coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
	 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	 *
	 * Updated by Hannes Hirzel, November 2016
	 *
	 * Placed in public domain.
	 **************************************************/
	
	if (typeof(Settings) == 'undefined' || Settings == null || !Settings) {
	
	    Settings = {
	
	        inputFirstCheck: $('#inputFirstCheck'),
	        inputSecondCheck: $('#inputSecondCheck'),
	        inputThirdCheck: $('#inputThirdCheck'),
	        settingFrom: $('#settingFrom'),
	        errorSettings: $('#errorSettings'),
	
	        params: {},
	
	        getSettings: function() { //read setting's values
	            var settings = LW.getSettings();
	
	            $(Settings.inputFirstCheck).val(settings.first);
	            $(Settings.inputSecondCheck).val(settings.second);
	            $(Settings.inputThirdCheck).val(settings.third);
	
	            Settings.params = settings; //store local
	        },
	
	        saveSetting: function() { //save setting's values to DB
	            var first = $(Settings.inputFirstCheck).val().trim(),
	                second = $(Settings.inputSecondCheck).val().trim(),
	                third = $(Settings.inputThirdCheck).val().trim(),
	                form = $(Settings.settingFrom),
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
	            } else { //only digits is valid
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
	            if (error) { //show error if any
	                var errorTxt = (errorName == 'empty') ? local[local.currentLocal].errorEmpty : local[local.currentLocal].errorValid;
	                $(Settings.errorSettings).removeClass('nodisplay').text(errorTxt);
	            } else { //otherwise save new settings
	                settings = {
	                    first: first,
	                    second: second,
	                    third: third
	                };
	                LW.putSettings(settings);
	                $(Settings.errorSettings).removeClass('nodisplay').text(local[local.currentLocal].errorNo);
	
	                Settings.params = settings; //store local
	            };
	        },
	
	        cancelSetting: function() {
	            Utils.clearFields();
	            Settings.getSettings();
	        },
	
	        init: function() {
	            $(document).on('click touchstart', '#saveSettings', Settings.saveSetting);
	            $(document).on('click touchstart', '#cancelSettings', Settings.cancelSetting);
	        }
	    };
	}
	
	
	    if (typeof(Learn) == 'undefined' || Learn == null || !Learn) {
	
	        Learn = {
	
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
	
	            recountIndexLearn: function() { //count words to learn
	                "use strict";
	                if (!Learn.wordsLearn.length) {
	                    $(LW.index).each(function(index, node) { //the initial counting
	                        var item = LW.readItem(LW.name+'-' + node);
	                        if (item) {
	                            if (item.step == 0) {
	                                Learn.wordsLearn.push(item);
	                            }
	                        }
	                    });
	                }
	                console.log('Learn recountIndexLearn', Learn.wordsLearn);
	                var wordsLearnLength = (Learn.wordsLearn.length) ? Learn.wordsLearn.length : '';
	
	                $(learnWordsNum).text(wordsLearnLength || '0');
	                $(learnWordsTopNum).text(wordsLearnLength);
	                $(learnWordsTopSNum).text(wordsLearnLength);
	            },
	
	            showWord: function() { //show a next word to learn
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
	
	            actionWord: function(step, reindex) {
	                if (step) {
	                    var word = {
	                        index: Learn.wordsLearn[Learn.currentIndex].index,
	                        word: Learn.wordsLearn[Learn.currentIndex].word,
	                        translate: Learn.wordsLearn[Learn.currentIndex].translate,
	                        step: step,
	                        date: (step == 1) ? (Utils.getToday() + Utils.delay * Settings.params.first) : 0
	                    };
	
	                    LW.storeItem(LW.name+'-' + Learn.wordsLearn[Learn.currentIndex].index, word); //save word
	
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
	
	            rememberWord: function() {
	                Learn.actionWord(1, true);
	            },
	
	            repeatWord: function() {
	                Learn.actionWord(0);
	            },
	
	            knownWord: function() {
	                Learn.actionWord(4, true);
	            },
	
	            init: function() {
	                $(document).on('click touchstart', '#rememberBtn', Learn.rememberWord);
	                $(document).on('click touchstart', '#repeatBtn', Learn.repeatWord);
	                $(document).on('click touchstart', '#knownBtn', Learn.knownWord);
	            }
	        };
	
	        Learn.init();
	    }
	
	
	
	
	
	
	
	    if (typeof(Repeat) == 'undefined' || Repeat == null || !Repeat) {
	
	        Repeat = {
	
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
	
	            recountIndexRepeat: function() {
	                //count words to Repeat
	                "use strict";
	                if (!Repeat.wordsRepeat.first.length && !Repeat.wordsRepeat.second.length && !Repeat.wordsRepeat.third.length) {
	                    $(LW.index).each(function(index, node) { //the initial counting
	                        var item = LW.readItem(LW.name+'-' + node);
	                        if (item) {
	                            if (Utils.getToday() > item.date) { //if this word is for today
	
	                                if (item.step == 1) {
	                                    Repeat.wordsRepeat.first.push(item);
	                                } else if (item.step == 2) {
	                                    Repeat.wordsRepeat.second.push(item);
	                                }
	                                if (item.step == 3) {
	                                    Repeat.wordsRepeat.third.push(item);
	                                }
	                            }
	                        }
	                    });
	                }
	                var wordsRepeatTotal = Repeat.wordsRepeat.first.length + Repeat.wordsRepeat.second.length + Repeat.wordsRepeat.third.length,
	                    wordsRepeatLength = (wordsRepeatTotal) ? wordsRepeatTotal : '';
	
	                $(repeatWordsNum).text(wordsRepeatLength || '0');
	                $(repeatWordsTopNum).text(wordsRepeatLength);
	                $(repeatWordsTopSNum).text(wordsRepeatLength);
	            },
	
	            getWord: function(index, arrWords) {
	                //if index is 0 we get the correct word. The other words are random
	                if (index == 0) {
	                    wordPlaceholder = Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0][(Repeat.wordsRepeat.first.length) ? 'translate' : 'word'];
	                } else {
	                    wordPlaceholder = Vocabulary[(Repeat.wordsRepeat.first.length) ? 'translates' : 'words'][Utils.getRandomInt(0, Vocabulary[(Repeat.wordsRepeat.first.length) ? 'translates' : 'words'].length - 1)];
	                }
	
	                if (arrWords.indexOf(wordPlaceholder) >= 0) {
	                    Repeat.getWord(index, arrWords);
	                }
	
	                return wordPlaceholder;
	            },
	
	
	            showWord: function() { //show a next word to Repeat
	                if (Repeat.wordsRepeat.first.length || Repeat.wordsRepeat.second.length) {
	                    var id = Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].index,
	                        wordPlaceholder = '';
	                    var arrWords = new Array();
	                    $(checkWordInp).text(Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0][(Repeat.wordsRepeat.first.length) ? 'word' : 'translate']).data('id', id);
	
	                    var arrOptionButtons = $('[data-type=checkWordBtn]');
	                    //the answer buttons are shuffled so that we don't know which one is the correct word.
	                    Utils.shuffle(arrOptionButtons);
	
	                    arrOptionButtons.each(function(index, node) {
	
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
	
	            actionWord: function(step, reindex) {
	                if (step) {
	
	
	                    LW.storeItem(LW.name+'-' + Repeat.wordsRepeat[Repeat.currentIndex].word, word); //save word
	
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
	            },
	
	            checkWord: function(self) {
	                var word = {
	                    index: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].index,
	                    word: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].word,
	                    translate: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].translate,
	                    step: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].step,
	                };
	
	                if ($(self).text() == ((Repeat.wordsRepeat.first.length) ? word.translate : word.word)) {
	                    word.step++;
	                    word.date = Utils.getToday() + Utils.delay * Settings.params[(Repeat.wordsRepeat.first.length) ? 'second' : 'third'];
	                } else {
	                    word.step--;
	                    word.date = (Repeat.wordsRepeat.first.length) ? 0 : Utils.getToday() + Utils.delay * Settings.params.first;
	                }
	                LW.storeItem(LW.name+'-' + word.index, word); //save word
	                Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'].splice(0, 1); //remove from index
	                Learn.wordsLearn = [];
	                Learn.recountIndexLearn();
	                Learn.showWord();
	                Repeat.recountIndexRepeat();
	                Repeat.showWord();
	            },
	
	            repeatWord: function() {
	                var word = {
	                    index: Repeat.wordsRepeat.third[0].index,
	                    word: Repeat.wordsRepeat.third[0].word,
	                    translate: Repeat.wordsRepeat.third[0].translate,
	                    step: Repeat.wordsRepeat.third[0].step,
	                };
	                if ($(enterWordInp).val() == word.word) {
	                    word.step++;
	                    word.date = 0;
	                } else {
	                    word.step--;
	                    word.date = Utils.getToday() + Utils.delay * Settings.params.second;
	                };
	                LW.storeItem(LW.name+'-' + word.index, word); //save word
	                Repeat.wordsRepeat.third.splice(0, 1); //remove from index
	                Learn.wordsLearn = [];
	                Learn.recountIndexLearn();
	                Learn.showWord();
	                Repeat.recountIndexRepeat();
	                Repeat.showWord();
	            },
	
	            init: function() {
	                $(document).on('click touchstart', '[data-type=checkWordBtn]', function() {
	                    Repeat.checkWord(this)
	                });
	                $(document).on('click touchstart', '#enterBtn', Repeat.repeatWord);
	            }
	        };
	
	        Repeat.init();
	    }
	
	
	
	
	
	
	    /**************************************************
	     * Learn Words // vocabulary.js
	     * coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
	     * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
	     * Placed in public domain.
	     **************************************************/
	
	    if (typeof(Vocabulary) == 'undefined' || Vocabulary == null || !Vocabulary) {
	
	        Vocabulary = {
	            rowTemplate: '<div id="{{node}}" class="row"><div class="col-md-5 col-sm-5 col-xs-4">{{txt}}</div>' +
	                '<div class="col-md-5 col-sm-5 col-xs-4">{{translate}}</div>' +
	                '<div class="col-md-2 col-sm-2 col-xs-4"><button data-node="{{node}}" type="button" class="btn btn-info js-edit-btn"><span class="glyphicon glyphicon-edit"></span></button></div>' +
	                '</div>' +
	                '<div id="{{node}}Edit" class="row nodisplay"><form id="form-{{node}}" role="form">' +
	                '<div class="col-md-5 col-sm-5 col-xs-4"><input type="text" class="form-control inp-fld" id="word-{{node}}" placeholder="Enter word" value="{{txt}}"></div>' +
	                '<div class="col-md-5 col-sm-5 col-xs-4"><input type="text" class="form-control inp-fld" id="translate-{{node}}" placeholder="Enter translate" value="{{translate}}"></div>' +
	                '<div class="col-md-2 col-sm-2 col-xs-4"><button data-node="{{node}}" type="button" class="btn btn-success js-save-btn"><span class="glyphicon glyphicon-ok"></span></button>' +
	                '<button id="del-{{node}}" data-node="{{node}}" data-id="{{index}}" type="button" class="btn btn-danger js-del-btn"><span class="glyphicon glyphicon-remove"></span></button>' +
	                '</div></form>' +
	                '</div>',
	
	            totalWordsNum: $('#totalWordsNum'),
	            vocabularyBox: $('#vocabularyBox'),
	            errorVocabularyBox: $('#errorVocabularyBox'),
	            errorVocabulary: $('#errorVocabulary'),
	            inputWordTxt: $('#inputWordTxt'),
	            inputTranslate: $('#inputTranslate'),
	            addWordForm: $('#addWordForm'),
	
	            words: [],
	            translates: [],
	
	            recountTotal: function() {
	                $(Vocabulary.totalWordsNum).text(LW.index.length);
	            },
	
	            removeWord: function(self, notReindex) { //remove word from vocabulary
	                var id = $(self).data('id'),
	                    node = $(self).data('node');
	
	                if (!notReindex) {
	                    LW.index.splice(id, 1); //remove from index
	                    LW.storeItem(LW.name+'-words', LW.index.join());
	                }
	                LW.removeItem(LW.name+'-' + node); //remove this word
	                $('#' + node).remove();
	                $('#' + node + 'Edit').remove();
	                Vocabulary.recountTotal();
	                Learn.wordsLearn = [];
	                Learn.recountIndexLearn();
	                Repeat.wordsRepeat = {
	                    currentIndexFirst: 0,
	                    first: [],
	                    currentIndexSecond: 0,
	                    second: [],
	                    currentIndexThird: 0,
	                    third: []
	                };
	                Repeat.recountIndexRepeat();
	            },
	
	            viewWord: function() {
	                var contentInner = '';
	
	                $(LW.index).each(function(index, node) {
	                    "use strict";
	                    var txt, translate;
	                    var item = LW.readItem(LW.name+'-' + node);
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
	
	            addSaveWord: function(wordTxt, translate, addForm, addWord) {
	                "use strict";
	
	                var inputWord = wordTxt.val().trim(),
	                    inputTranslate = translate.val().trim(),
	                    form = addForm,
	                    error = false,
	                    word = {};
	
	                Utils.clearFields();
	                //check for empty fields
	                if (!inputWord) {
	                    error = Utils.setFieldError(form.children(':nth-child(1)').children(':nth-child(1)'));
	                } else if (!inputTranslate) {
	                    error = Utils.setFieldError(form.children(':nth-child(2)').children(':nth-child(1)'));
	                }
	                if (error) { //show error if any
	                    $(Vocabulary.errorVocabularyBox).removeClass('nodisplay');
	                    $(Vocabulary.errorVocabulary).text(local[local.currentLocal].errorEmpty);
	                } else { //otherwise save new word to Vocabulary
	                    var newIndexVal;
	                    var todayDate = Utils.getToday(true);
	                    word = {
	                        index: todayDate,
	                        word: inputWord,
	                        translate: inputTranslate,
	                        step: 0,
	                        date: 0
	                    };
	
	                    // save newly added word
	                    newIndexVal = 'index' + (LW.index.length + 1);
	                    LW.storeItem(LW.name+'-' + newIndexVal, word);
	
	                    var contentInner = Vocabulary.rowTemplate.replace(/{{node}}/g, todayDate).replace(/{{txt}}/g, inputWord).replace(/{{translate}}/g, inputTranslate).replace(/{{index}}/g, (addWord) ? LW.index.length : LW.index.indexOf(inputWord));
	
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
	
	                    LW.storeItem(LW.name+'-words', LW.index.join()); //add word to Vocabulary list
	                    Utils.clearFields();
	                    Vocabulary.recountTotal();
	                    Learn.wordsLearn = [];
	                    Learn.recountIndexLearn();
	                    Learn.showWord();
	                };
	            },
	
	            init: function() {
	                $(document).on('click touchstart', '#addBtn', function() {
	                    Vocabulary.addSaveWord($(Vocabulary.inputWordTxt), $(Vocabulary.inputTranslate), $(Vocabulary.addWordForm), true);
	                });
	                $(document).on('click touchstart', '.js-edit-btn', function() {
	                    $('#' + $(this).data('node')).hide();
	                    $('#' + $(this).data('node') + 'Edit').show();
	                });
	                $(document).on('click touchstart', '.js-save-btn', function() {
	                    Vocabulary.addSaveWord($('#word-' + $(this).data('node')), $('#translate-' + $(this).data('node')), $('#form-' + $(this).data('node')));
	                });
	                $(document).on('click touchstart', '.js-del-btn', function() {
	                    Vocabulary.removeWord(this);
	                });
	            }
	        };
	
	        Vocabulary.init();
	    }


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map