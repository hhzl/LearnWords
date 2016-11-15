
/**************************************************
* Learn Words // memorystore.js
* The in-memory Store. Encapsulates logic to access data.
* All fields are required.
*
* Hannes Hirzel, 28 Oct 2016
*
* Placed in public domain.
**************************************************/

localStorageAPI.storeItem('learnWords-settings', settings);
localStorageAPI.storeItem('learnWords-language', 'en_GB');


word = {"index":"index1","word":"Apfel","translate":"apple","date":0,"step":1};
localStorageAPI.storeItem('learnWords-index1', word);

word = {"index":"index10","word":"Guava","translate":"guava","date":0,"step":1};
localStorageAPI.storeItem('learnWords-index10', word);

word = {"index":"index11","word":"Banane","translate":"banana","date":0,"step":1};
localStorageAPI.storeItem('learnWords-index11', word);

word = {"index":"index12","word":"Melone","translate":"melon","date":0,"step":1};
localStorageAPI.storeItem('learnWords-index12', word);


var words = ["index1","index10","index11","index12"];


localStorageAPI.storeItem('learnWords-words', words.join());



console.log('memorystore.js');


