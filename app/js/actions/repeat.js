/**************************************************
 * Learn Words // repeat.js
 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
 * Placed in public domain.
 **************************************************/
'use strict';
import LWClass from '../utils/LW';
const LW = new LWClass('LWdb');
import {Utils} from './../utils/utils';
import {Learn} from './learn';

import SettingsClass from '../../components/settings/settings';
const Settings = new SettingsClass();

const Repeat = {
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

  recountIndexRepeat: function () {
    //count words to Repeat
    if (!Repeat.wordsRepeat.first.length && !Repeat.wordsRepeat.second.length && !Repeat.wordsRepeat.third.length) {
      $(LW.index).each(function (index, node) { //the initial counting
        var item = LW.readItem(LW.name + '-' + node);
        if (item) {
          if (Utils.getToday() > item.date) { //if this word is for today
            if (1 === item.step) {
              Repeat.wordsRepeat.first.push(item);
            } else if (2 === item.step) {
              Repeat.wordsRepeat.second.push(item);
            }
            if (3 === item.step) {
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

  getWord: function (index, arrWords) {
    //if index is 0 we get the correct word. The other words are random
    if (0 === index) {
      wordPlaceholder = Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0][(Repeat.wordsRepeat.first.length) ? 'translate' : 'word'];
    } else {
      wordPlaceholder = Vocabulary[(Repeat.wordsRepeat.first.length) ? 'translates' : 'words'][Utils.getRandomInt(0, Vocabulary[(Repeat.wordsRepeat.first.length) ? 'translates' : 'words'].length - 1)];
    }

    if (arrWords.indexOf(wordPlaceholder) >= 0) {
      Repeat.getWord(index, arrWords);
    }

    return wordPlaceholder;
  },

  showWord: function () { //show a next word to Repeat
    if (Repeat.wordsRepeat.first.length || Repeat.wordsRepeat.second.length) {
      var id = Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].index,
        wordPlaceholder = '';
      var arrWords = new Array();
      $(checkWordInp).text(Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0][(Repeat.wordsRepeat.first.length) ? 'word' : 'translate']).data('id', id);

      var arrOptionButtons = $('[data-type=checkWordBtn]');
      //the answer buttons are shuffled so that we don't know which one is the correct word.
      Utils.shuffle(arrOptionButtons);

      arrOptionButtons.each(function (index) {

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

  actionWord: function (step, reindex) {
    if (step) {

      LW.storeItem(LW.name + '-' + Repeat.wordsRepeat[Repeat.currentIndex].word, word); //save word

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

  checkWord: function (self) {
    var word = {
      index: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].index,
      word: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].word,
      translate: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].translate,
      step: Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'][0].step,
    };

    if ($(self).text() === ((Repeat.wordsRepeat.first.length) ? word.translate : word.word)) {
      word.step++;
      word.date = Utils.getToday() + Utils.delay * Settings.params[(Repeat.wordsRepeat.first.length) ? 'second' : 'third'];
    } else {
      word.step--;
      word.date = (Repeat.wordsRepeat.first.length) ? 0 : Utils.getToday() + Utils.delay * Settings.params.first;
    }
    LW.storeItem(LW.name + '-' + word.index, word); //save word
    Repeat.wordsRepeat[(Repeat.wordsRepeat.first.length) ? 'first' : 'second'].splice(0, 1); //remove from index
    Learn.wordsLearn = [];
    Learn.recountIndexLearn();
    Learn.showWord();
    Repeat.recountIndexRepeat();
    Repeat.showWord();
  },

  repeatWord: function () {
    var word = {
      index: Repeat.wordsRepeat.third[0].index,
      word: Repeat.wordsRepeat.third[0].word,
      translate: Repeat.wordsRepeat.third[0].translate,
      step: Repeat.wordsRepeat.third[0].step,
    };
    if ($(enterWordInp).val() === word.word) {
      word.step++;
      word.date = 0;
    } else {
      word.step--;
      word.date = Utils.getToday() + Utils.delay * Settings.params.second;
    };
    LW.storeItem(LW.name + '-' + word.index, word); //save word
    Repeat.wordsRepeat.third.splice(0, 1); //remove from index
    Learn.wordsLearn = [];
    Learn.recountIndexLearn();
    Learn.showWord();
    Repeat.recountIndexRepeat();
    Repeat.showWord();
  },

  init: function () {
    $(document).on('click touchstart', '[data-type=checkWordBtn]', function () {
      Repeat.checkWord(this);
    });
    $(document).on('click touchstart', '#enterBtn', Repeat.repeatWord);
  }
};

export {Repeat};
