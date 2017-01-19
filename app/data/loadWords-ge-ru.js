/**************************************************
 * Learn Words //  loadWords-ge-ru.js
 * 
 * Load initial set of German words with Russian translation.
 **************************************************/

"use strict";

if (LW.db.isOK && LW.db.isEmpty) {
    console.log('memorystore: start loading words');

    LW.db.loadWords(
        [{
            "index": "index1",
            "word": "das Auto",
            "translate": "автомобиль",
            "step": 0,
            "date": 0
        }, {
            "index": "index2",
            "word": "laufen",
            "translate": "бежать",
            "step": 0,
            "date": 0
        }, {
            "index": "index3",
            "word": "alt",
            "translate": "старый",
            "step": 0,
            "date": 0
        }, {
            "index": "index4",
            "word": "krank",
            "translate": "больной",
            "step": 0,
            "date": 0
        }, {
            "index": "index5",
            "word": "heute",
            "translate": "сегодня",
            "step": 0,
            "date": 0
        }, {
            "index": "index6",
            "word": "schreiben",
            "translate": "писать",
            "step": 0,
            "date": 0
        }, {
            "index": "index7",
            "word": "hell",
            "translate": "светлый",
            "step": 0,
            "date": 0
        }, {
            "index": "index8",
            "word": "reich",
            "translate": "богатый",
            "step": 0,
            "date": 0
        }, {
            "index": "index9",
            "word": "süß",
            "translate": "сладкий",
            "step": 1,
            "date": 0
        }, {
            "index": "index10",
            "word": "weiblich",
            "translate": "женский",
            "step": 1,
            "date": 0
        }, {
            "index": "index11",
            "word": "bestellen",
            "translate": "упорядочивать",
            "step": 1,
            "date": 0
        }, {
            "index": "index12",
            "word": "kalt",
            "translate": "холодный",
            "step": 2,
            "date": 0
        }, {
            "index": "index13",
            "word": "sauer",
            "translate": "кислый",
            "step": 2,
            "date": 0
        }, {
            "index": "index14",
            "word": "fliegen",
            "translate": "летать",
            "step": 3,
            "date": 0
        }]
    );

}