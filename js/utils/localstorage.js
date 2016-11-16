/**************************************************
* Learn Words // localstorage.js
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
* Placed in public domain.
* Update November 2016 by Hannes Hirzel
**************************************************/

if(typeof(LW.wdsDB) == 'undefined' || LW.wdsDB == null || !LW.wdsDB){
	
	LW.wdsDB = {
	
		isLocalStorageAvailable: function() {
				try {
					return 'localStorage' in window && window['localStorage'] !== null;
				} catch (e) {
					return false;
				}
			},
		
		get: function(key){
			if (LW.wdsDB.isOK) {
				return JSON.parse(localStorage.getItem(key));
			}
		},
		
		remove: function(key){
			if (LW.wdsDB.isOK) {
				localStorage.removeItem( key );
			}
		},
		
		put: function(key, value){
			if (LW.wdsDB.isOK) {
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
			if (LW.wdsDB.isOK) {
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
                        LW.wdsDB.put('learnWords-words', '');

                        // maybe this as well
                        localStorage.removeItem('learnWords-settings');
                        }

		},

		
		init: function(){
			LW.wdsDB.isOK = false;
			if (!LW.wdsDB.isLocalStorageAvailable()) {
				alert('Local Storage is not available.');
				return false;
			}
			LW.wdsDB.isOK = true;
		}
	};
	
	LW.wdsDB.init();
}

