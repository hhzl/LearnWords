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
