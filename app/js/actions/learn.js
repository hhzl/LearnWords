/**********************************************
 * Learn Words // learn.js
 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
 *
 * Updated by Hannes Hirzel, November 2016
 *
 * Placed in public domain.
 **************************************************/

if (typeof (Learn) == 'undefined' || Learn == null || !Learn) {

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

    recountIndexLearn: function () { //count words to learn
      "use strict";
      if (!Learn.wordsLearn.length) {
        $(LW.index).each(function (index, node) { //the initial counting
          var item = LW.readItem(LW.name + '-' + node);
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

    showWord: function () { //show a next word to learn
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

    actionWord: function (step, reindex) {
      if (step) {
        var word = {
          index: Learn.wordsLearn[Learn.currentIndex].index,
          word: Learn.wordsLearn[Learn.currentIndex].word,
          translate: Learn.wordsLearn[Learn.currentIndex].translate,
          step: step,
          date: (step == 1) ? (Utils.getToday() + Utils.delay * Settings.params.first) : 0
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

    rememberWord: function () {
      Learn.actionWord(1, true);
    },

    repeatWord: function () {
      Learn.actionWord(0);
    },

    knownWord: function () {
      Learn.actionWord(4, true);
    },

    init: function () {
      $(document).on('click touchstart', '#rememberBtn', Learn.rememberWord);
      $(document).on('click touchstart', '#repeatBtn', Learn.repeatWord);
      $(document).on('click touchstart', '#knownBtn', Learn.knownWord);
    }
  };

  Learn.init();
}
