/**********************************************
 * Learn Words // learn.js
 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
 *
 * Updated by Hannes Hirzel, November 2016
 *
 * Placed in public domain.
 **************************************************/
import LWClass from '../utils/LW';
const LW = new LWClass('LWdb');
import {Utils} from './../utils/utils';

const Learn = {
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

  recountIndexLearn() { //count words to learn
    if (!Learn.wordsLearn.length) {
      $(LW.index).each((index, node) => { //the initial counting
        const item = LW.readItem(`${LW.name}-${node}`);
        if (item) {
          if (0 === item.step) {
            Learn.wordsLearn.push(item);
          }
        }
      });
    }
    console.log('Learn recountIndexLearn', Learn.wordsLearn);
    const wordsLearnLength = (Learn.wordsLearn.length) ? Learn.wordsLearn.length : '';

    $(learnWordsNum).text(wordsLearnLength || '0');
    $(learnWordsTopNum).text(wordsLearnLength);
    $(learnWordsTopSNum).text(wordsLearnLength);
  },

  showWord() { //show a next word to learn
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

  actionWord(step, reindex) {
    if (step) {
      const word = {
        index: Learn.wordsLearn[Learn.currentIndex].index,
        word: Learn.wordsLearn[Learn.currentIndex].word,
        translate: Learn.wordsLearn[Learn.currentIndex].translate,
        step,
        date: (1 === step) ? (Utils.getToday() + Utils.delay * Settings.params.first) : 0
      };

      LW.storeItem(`${LW.name}-${Learn.wordsLearn[Learn.currentIndex].index}`, word); //save word

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

  rememberWord() {
    Learn.actionWord(1, true);
  },

  repeatWord() {
    Learn.actionWord(0);
  },

  knownWord() {
    Learn.actionWord(4, true);
  },

  init() {
    $(document).on('click touchstart', '#rememberBtn', Learn.rememberWord);
    $(document).on('click touchstart', '#repeatBtn', Learn.repeatWord);
    $(document).on('click touchstart', '#knownBtn', Learn.knownWord);
  }
};

export {Learn};
