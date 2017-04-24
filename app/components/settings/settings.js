/**********************************************
 * Learn Words // settings.js
 * coded by Anatol Marezhanyi aka e1r0nd//[CRG] - March 2014
 * http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
 *
 * Updated by Hannes Hirzel, November 2016
 *
 * Placed in public domain.
 **************************************************/
import LWClass from '../../js/utils/LW';
const LW = new LWClass('LWdb');

export default class SettingsClass {
  constructor() {
    this.inputFirstCheck = $('#inputFirstCheck');
    this.inputSecondCheck = $('#inputSecondCheck');
    this.inputThirdCheck = $('#inputThirdCheck');
    this.settingFrom = $('#settingFrom');
    this.errorSettings = $('#errorSettings');

    this.params = {};

    this.self = this;

    $(document).on('click', '#saveSettings', this.saveSetting.bind(this));
    $(document).on('click', '#cancelSettings', this.cancelSetting.bind(this));
  }
  getSettings() { //read setting's values
    const storedSettings = LW.getSettings();

    $(this.inputFirstCheck).val(storedSettings.first);
    $(this.inputSecondCheck).val(storedSettings.second);
    $(this.inputThirdCheck).val(storedSettings.third);

    this.params = storedSettings; //store local
  }

  saveSetting() {
    //save setting's values to DB
    const first = $(this.inputFirstCheck).val().trim();

    const second = $(this.inputSecondCheck).val().trim();
    const third = $(this.inputThirdCheck).val().trim();
    const form = $(this.settingFrom);
    let errorName = '';
    let error = false;

    this.self.clearFields();
    //check for empty fields
    if (!first) {
      error = this.self.setFieldError(form.children(':nth-child(1)'));
      errorName = 'empty';
    } else if (!second) {
      error = this.self.setFieldError(form.children(':nth-child(2)'));
      errorName = 'empty';
    } else if (!third) {
      error = this.self.setFieldError(form.children(':nth-child(3)'));
      errorName = 'empty';
    } else { //only digits is valid
      if (!this.self.isNumber(first)) {
        error = this.self.setFieldError(form.children(':nth-child(1)'));
        errorName = 'number';
      };
      if (!this.self.isNumber(second)) {
        error = this.self.setFieldError(form.children(':nth-child(2)'));
        errorName = 'number';
      };
      if (!this.self.isNumber(third)) {
        error = this.self.setFieldError(form.children(':nth-child(3)'));
        errorName = 'number';
      };
    }
    if (error) { //show error if any
      const errorTxt = ('empty' === errorName) ? local[local.currentLocal].errorEmpty : local[local.currentLocal].errorValid;
      $(this.errorSettings).removeClass('nodisplay').text(errorTxt);
    } else { //otherwise save new settings
      settings = {
        first,
        second,
        third
      };
      LW.putSettings(settings);
      $(this.errorSettings).removeClass('nodisplay').text(local[local.currentLocal].errorNo);

      this.params = settings; //store local
    }
  }

  cancelSetting() {
    this.clearFields();
    this.getSettings();
  }

  isNumber(str, withDot) {
    //validate filed for number value
    const NumberReg = /^\d+$/;
    const NumberWithDotReg = /^[-+]?[0-9]*\.?[0-9]+$/;

    return withDot ? NumberWithDotReg.test(str) : NumberReg.test(str);
  }

  clearFields() {
    $('.form-group').each((i, node) => { //clear all error styles
      $(node).removeClass('has-error');
    });
    $('#errorSettings').addClass('nodisplay');
  }

  setFieldError(self) { //set the error style for the current input field
    $(self).addClass('has-error');
    return true;
  }

};
