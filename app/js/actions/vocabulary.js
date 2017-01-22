/**************************************************
 * Learn Words // vocabulary.js
 * coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
 * Placed in public domain.
 **************************************************/

if (typeof (Vocabulary) == 'undefined' || Vocabulary == null || !Vocabulary) {

  Vocabulary = {
    rowTemplate: '<div id="{{node}}" class="row"><div class="col-md-5 col-sm-5 col-xs-4">{{txt}}</div>' +
      '<div class="col-md-5 col-sm-5 col-xs-4">{{translate}}</div>' +
      '<div class="col-md-2 col-sm-2 col-xs-4"><button data-node="{{node}}" type="button" class="btn btn-info js-edit-btn"><span class="glyphicon glyphicon-edit"></span></button></div>' +
      '</div>' +
      '<div id="{{node}}Edit" class="row nodisplay"><form id="form-{{node}}" role="form">' +
      '<div class="col-md-5 col-sm-5 col-xs-4"><input type="text" class="form-control inp-fld" id="word-{{node}}" placeholder="Enter word" value="{{txt}}"></div>' +
      '<div class="col-md-5 col-sm-5 col-xs-4"><input type="text" class="form-control inp-fld" id="translate-{{node}}" placeholder="Enter translate" value="{{translate}}"></div>' +
      '<div class="col-md-2 col-sm-2 col-xs-4"><button data-node="{{node}}" type="button" class="btn btn-success js-save-btn"><span class="glyphicon glyphicon-ok"></span></button>' +
      '<button id="del-{{node}}" data-node="{{node}}" data-id="{{index}}" type="button" class="btn btn-danger js-del-btn"><span class="glyphicon glyphicon-remove"></span></button>' +
      '</div></form>' +
      '</div>',

    totalWordsNum: $('#totalWordsNum'),
    vocabularyBox: $('#vocabularyBox'),
    errorVocabularyBox: $('#errorVocabularyBox'),
    errorVocabulary: $('#errorVocabulary'),
    inputWordTxt: $('#inputWordTxt'),
    inputTranslate: $('#inputTranslate'),
    addWordForm: $('#addWordForm'),

    words: [],
    translates: [],

    recountTotal: function () {
      $(Vocabulary.totalWordsNum).text(LW.index.length);
    },

    removeWord: function (self, notReindex) { //remove word from vocabulary
      var id = $(self).data('id'),
        node = $(self).data('node');

      if (!notReindex) {
        LW.index.splice(id, 1); //remove from index
        LW.storeItem(LW.name + '-words', LW.index.join());
      }
      LW.removeItem(LW.name + '-' + node); //remove this word
      $('#' + node).remove();
      $('#' + node + 'Edit').remove();
      Vocabulary.recountTotal();
      Learn.wordsLearn = [];
      Learn.recountIndexLearn();
      Repeat.wordsRepeat = {
        currentIndexFirst: 0,
        first: [],
        currentIndexSecond: 0,
        second: [],
        currentIndexThird: 0,
        third: []
      };
      Repeat.recountIndexRepeat();
    },

    viewWord: function () {
      var contentInner = '';

      $(LW.index).each(function (index, node) {
        "use strict";
        var txt, translate;
        var item = LW.readItem(LW.name + '-' + node);
        if (item) {
          txt = item.word;
          translate = item.translate;

          Vocabulary.words.push(txt);
          Vocabulary.translates.push(translate);
          contentInner += Vocabulary.rowTemplate.replace(/{{node}}/g, node).replace(/{{txt}}/g, txt).replace(/{{translate}}/g, translate).replace(/{{index}}/g, index);
        }
      });

      $(Vocabulary.vocabularyBox).html(contentInner);
      Vocabulary.recountTotal();
    },

    addSaveWord: function (wordTxt, translate, addForm, addWord) {
      "use strict";

      var inputWord = wordTxt.val().trim(),
        inputTranslate = translate.val().trim(),
        form = addForm,
        error = false,
        word = {};

      Utils.clearFields();
      //check for empty fields
      if (!inputWord) {
        error = Utils.setFieldError(form.children(':nth-child(1)').children(':nth-child(1)'));
      } else if (!inputTranslate) {
        error = Utils.setFieldError(form.children(':nth-child(2)').children(':nth-child(1)'));
      }
      if (error) { //show error if any
        $(Vocabulary.errorVocabularyBox).removeClass('nodisplay');
        $(Vocabulary.errorVocabulary).text(local[local.currentLocal].errorEmpty);
      } else { //otherwise save new word to Vocabulary
        var newIndexVal;
        var todayDate = Utils.getToday(true);
        word = {
          index: todayDate,
          word: inputWord,
          translate: inputTranslate,
          step: 0,
          date: 0
        };

        // save newly added word
        newIndexVal = 'index' + (LW.index.length + 1);
        LW.storeItem(LW.name + '-' + newIndexVal, word);

        var contentInner = Vocabulary.rowTemplate.replace(/{{node}}/g, todayDate).replace(/{{txt}}/g, inputWord).replace(/{{translate}}/g, inputTranslate).replace(/{{index}}/g, (addWord) ? LW.index.length : LW.index.indexOf(inputWord));

        if (addWord) {
          LW.index.push(newIndexVal);
          wordTxt.val('');
          translate.val('');
          $(Vocabulary.errorVocabularyBox).removeClass('nodisplay');
          $(Vocabulary.errorVocabulary).text(local[local.currentLocal].errorNoW);
          $(Vocabulary.vocabularyBox).append(contentInner);
        } else {
          var id = wordTxt.attr('id').slice(5);

          LW.index[LW.index.indexOf(id)] = newIndexVal;
          $('#' + id).before(contentInner);
          Vocabulary.removeWord($('#del-' + id), true);
        }

        LW.storeItem(LW.name + '-words', LW.index.join()); //add word to Vocabulary list
        Utils.clearFields();
        Vocabulary.recountTotal();
        Learn.wordsLearn = [];
        Learn.recountIndexLearn();
        Learn.showWord();
      };
    },

    init: function () {
      $(document).on('click touchstart', '#addBtn', function () {
        Vocabulary.addSaveWord($(Vocabulary.inputWordTxt), $(Vocabulary.inputTranslate), $(Vocabulary.addWordForm), true);
      });
      $(document).on('click touchstart', '.js-edit-btn', function () {
        $('#' + $(this).data('node')).hide();
        $('#' + $(this).data('node') + 'Edit').show();
      });
      $(document).on('click touchstart', '.js-save-btn', function () {
        Vocabulary.addSaveWord($('#word-' + $(this).data('node')), $('#translate-' + $(this).data('node')), $('#form-' + $(this).data('node')));
      });
      $(document).on('click touchstart', '.js-del-btn', function () {
        Vocabulary.removeWord(this);
      });
    }
  };

  Vocabulary.init();
}
