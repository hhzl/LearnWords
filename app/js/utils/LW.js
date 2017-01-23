/**************************************************
 * Learn Words // localstorage.js
 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ a.merezhany@gmail.com
 *
 * Updated by Hannes Hirzel, November 2016
 *
 * Placed in public domain.
 **************************************************/
export default class LWClass {
  constructor(dbName) {
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

  isLocalStorageAvailable() {
    try {
      return window && window.localStorage;
    } catch (e) {
      return false;
    }
  }

  readItem(key) {
    if (this.isOK) {
      return JSON.parse(localStorage.getItem(key));
    }
  }

  removeItem(key) {
    if (this.isOK) {
      localStorage.removeItem(key);
    }
  }

  storeItem(key, value) {
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

  putSettings(theSettingsObj) {
    this.storeItem(this.name + '-words-settings', theSettingsObj);
  }

  getSettings() {

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

  loadWords(theWords) {
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

  isEmpty(/*key*/) {
    if (this.isOK) {
      return (!this.index.length) ? true : false;
    }
  }

  dumpWords(/*aKeyPrefix*/) {
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

  removeObjects(aKeyPrefix) {
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

  removeWords() {
    var aKeyPrefix = this.name + '-index';

    this.removeObjects(aKeyPrefix);
    // reset index
    localStorage.setItem(this.name + '-words', '');
    // this one triggers that memorystore is executed
    localStorage.removeItem(this.name + '-settings');
  }

  destroy() {
    var aKeyPrefix = this.name;

    this.removeObjects(aKeyPrefix);
  }
};
