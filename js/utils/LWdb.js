/**************************************************
* Learn Words // localstorage.js
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
* Placed in public domain.
*
* Update November 2016 by Hannes Hirzel
*
**************************************************/

	// Define global LearnWords object
	var LW = {}; 


	// Define database sub-object

	LW.db = {
	
		isLocalStorageAvailable: function() {
                                "use strict";
				try {
					return 'localStorage' in window && window['localStorage'] !== null;
				} catch (e) {
					return false;
				}
			},
		
		get: function(key){
			if (LW.db.isOK) {
				return JSON.parse(localStorage.getItem(key));
			}
		},
		
		remove: function(key){
			if (LW.db.isOK) {
				localStorage.removeItem( key );
			}
		},
		
		put: function(key, value){
                        "use strict";
			if (LW.db.isOK) {
				try {
					localStorage.setItem(key, JSON.stringify(value));
				} catch (e) {
					if (e == QUOTA_EXCEEDED_ERR) {
						alert('Local Storage is full');
					}
					return false;
				}
			}
		},


		removeWords: function(){
			if (LW.db.isOK) {
                        "use strict";
                        var key;
                        var st; 
                        var keysToDelete = [];

                        var prefixForNumber = 'learnWords-index';  

                        // go through all keys starting with the name
                        // of the database, i.e 'learnWords-index14'
                        for (var i = 0; i < localStorage.length; i++){
                            key = localStorage.key(i);
                            st = localStorage.getItem(key);                            
    
                            if (key.lastIndexOf(prefixForNumber,0) === 0) {
                                keysToDelete.push(key);
                            };
			};
                        // now we have all the keys which should be deleted
                        // in the array keysToDelete.
                        console.log(keysToDelete);
                        keysToDelete.forEach(function(aKey){
                             localStorage.removeItem(aKey);
			});

                        // reset index
                        localStorage.setItem('learnWords-words', '');

                        // this one triggers that memorystore is executed

                        localStorage.removeItem('learnWords-settings');
                        }

		},



		removeDB: function(){
                        // temporarily duplicated code from removeWords
                        // var prefixForNumber has a different value
                        // resetting the index has been removed commented out
                        // otherwise it is the same.
			if (LW.db.isOK) {
                        "use strict";
                        var key;
                        var st; 
                        var keysToDelete = [];

                        var prefixForNumber = 'learnWords';  

                        // go through all keys starting with the name
                        // of the database, i.e 'learnWords-index14'
                        for (var i = 0; i < localStorage.length; i++){
                            key = localStorage.key(i);
                            st = localStorage.getItem(key);                            
    
                            if (key.lastIndexOf(prefixForNumber,0) === 0) {
                                keysToDelete.push(key);
                            };
			};
                        // now we have all the keys which should be deleted
                        // in the array keysToDelete.
                        console.log(keysToDelete);
                        keysToDelete.forEach(function(aKey){
                             localStorage.removeItem(aKey);
			});

                        // reset index
                        // localStorage.setItem('learnWords-words', '');
                        localStorage.removeItem('index15');

                        // this one triggers that memorystore is executed

                        localStorage.removeItem('learnWords-settings');
                        }

		},






                dumpWords: function(aKeyPrefix) {
		           if (LW.db.isOK) {
                            "use strict";
                            var key;
                            var strValue; 
                            var result = [];

                            var prefixForNumber = 'learnWords-index';  

                            // go through all keys starting with the name
                            // of the database, i.e 'learnWords-index14'
                            // collect the matching objects into arr
                            for (var i = 0; i < localStorage.length; i++){
                                key = localStorage.key(i);
                                strValue = localStorage.getItem(key);                            
    
                                if (key.lastIndexOf(prefixForNumber,0) === 0) {
                                    result.push(JSON.parse(strValue));
                                };
			    };

                            // Dump the array as JSON code (for select all / copy)
                            console.log(JSON.stringify(result));
                           }
                },	


		
		init: function(){
                        "use strict";
			LW.db.isOK = false;

			if (!LW.db.isLocalStorageAvailable()) {
				alert('Local Storage is not available.');
				return false;
			}
			LW.db.isOK = true;

                        // Initialize index array object 
                        // index is an array with the keys for all words.
                        LW.db.index = [];
                        var strIndex = LW.db.get('learnWords-words'); 
			if (strIndex) {LW.db.index = strIndex.split(',')};

		}
	};
	
	LW.db.init();

