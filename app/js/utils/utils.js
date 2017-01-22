/**************************************************
 * Learn Words // utils.js
 * coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ e1r0nd.crg@gmail.com
 * Placed in public domain.
 **************************************************/
// if (typeof (Utils) == 'undefined' || Utils == null || !Utils) {

  // Utils = {
export default function(dbName) {

  this.isNumber = function (str, withDot) { //validate filed for number value
    var NumberReg = /^\d+$/,
      NumberWithDotReg = /^[-+]?[0-9]*\.?[0-9]+$/;

    return withDot ? NumberWithDotReg.test(str) : NumberReg.test(str);
  };

  this.clearFields = function () {
    $('.form-group').each(function (i, node) { //clear all error styles
      $(node).removeClass('has-error');
    });
    $('#errorSettings').addClass('nodisplay');
  };

  this.setFieldError = function (self) { //set the error style for the current input field
    $(self).addClass('has-error');
    return true;
  };

  this.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  this.getToday = function (fullDate) {
    var now = new Date();

    if (fullDate) {
      return new Date().valueOf();
    } else {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
    }
  };

  this.closeMobMenu = function () {
    if ($('#bs-example-navbar-collapse-1').hasClass('in')) {
      $('#navbarToggle').click();
    }
  };

  this.shuffle = function (a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  };
};
// }

// if (typeof module !== 'undefined' && module.exports != null) {
//     exports.Utils = Utils;
// }
