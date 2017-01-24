/**************************************************
 * Learn Words // utils.js
 * coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
 * Placed in public domain.
**************************************************/
var Utils = {};

Utils = {
  isNumber(str, withDot) {
    //validate filed for number value
    const NumberReg = /^\d+$/;
    const NumberWithDotReg = /^[-+]?[0-9]*\.?[0-9]+$/;

    return withDot ? NumberWithDotReg.test(str) : NumberReg.test(str);
  },

  clearFields() {
    $('.form-group').each((i, node) => { //clear all error styles
      $(node).removeClass('has-error');
    });
    $('#errorSettings').addClass('nodisplay');
  },

  setFieldError(self) { //set the error style for the current input field
    $(self).addClass('has-error');
    return true;
  },

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getToday(fullDate) {
    const now = new Date();

    if (fullDate) {
      return new Date().valueOf();
    } else {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
    }
  },

  closeMobMenu() {
    if ($('#bs-example-navbar-collapse-1').hasClass('in')) {
      $('#navbarToggle').click();
    }
  },

  shuffle(a) {
    let j;
    let x;
    let i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  }
};

if (typeof module !== 'undefined' && module.exports != null) {
    exports.Utils = Utils;
}

export {Utils};
