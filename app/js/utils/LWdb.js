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
