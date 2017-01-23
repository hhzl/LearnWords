/**************************************************
 * Learn Words // navigation.js
 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
 * Placed in public domain.
 **************************************************/
import {Utils} from './utils';
let Navigation = {};

Navigation = {
  hashguard: function (init) { //onHashChange
    if (init) {
      this.hash = window.location.hash;
    }
    if (this.hash !== window.location.hash) {
      $(window).trigger('hashbreak', {
        'prevhash': this.hash
      });
      this.hash = window.location.hash;
    }
    setTimeout(this.hashguard.bind(this), 50);
  },

  hashbreak: function () { //hashchange event
    var hashUrl = window.location.hash.slice(3);

    if (hashUrl) {
      $('[data-target=' + window.location.hash.slice(3) + ']').click();
    } else {
      $('[data-target=summary]').click();
    }
  },

  navSelect: function () {
    $('[data-toggle=nav]').each(function () {
      $(this).addClass('nodisplay');
    });
    $('[data-type=nav-select-li]').each(function () {
      $(this).removeClass('active');
    });
    $(this).parent().addClass('active');
    $('#' + $(this).data('target')).removeClass('nodisplay');
    Utils.closeMobMenu();
  },

  init: function () {
    $(document).on('click touchstart', '[data-type=nav-select]', this.navSelect);
    $(window).bind('hashbreak', this.hashbreak);
    this.hashguard(false);
  }
};

export {Navigation};
