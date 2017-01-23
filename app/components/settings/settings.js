/**********************************************
 * Learn Words // this.js
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

    $(document).on('click touchstart', '#saveSettings', this.saveSetting);
    $(document).on('click touchstart', '#cancelSettings', this.cancelSetting);
  }
  getSettings() { //read setting's values
    var storedSettings = LW.getSettings();

    $(this.inputFirstCheck).val(storedSettings.first);
    $(this.inputSecondCheck).val(storedSettings.second);
    $(this.inputThirdCheck).val(storedSettings.third);

    this.params = storedSettings; //store local
  }

  saveSetting() { //save setting's values to DB
      var first = $(this.inputFirstCheck).val().trim(),
        second = $(this.inputSecondCheck).val().trim(),
        third = $(this.inputThirdCheck).val().trim(),
        form = $(this.settingFrom),
        errorName = '',
        error = false;

      Utils.clearFields();
      //check for empty fields
      if (!first) {
        error = Utils.setFieldError(form.children(':nth-child(1)'));
        errorName = 'empty';
      } else if (!second) {
        error = Utils.setFieldError(form.children(':nth-child(2)'));
        errorName = 'empty';
      } else if (!third) {
        error = Utils.setFieldError(form.children(':nth-child(3)'));
        errorName = 'empty';
      } else { //only digits is valid
        if (!Utils.isNumber(first)) {
          error = Utils.setFieldError(form.children(':nth-child(1)'));
          errorName = 'number';
        };
        if (!Utils.isNumber(second)) {
          error = Utils.setFieldError(form.children(':nth-child(2)'));
          errorName = 'number';
        };
        if (!Utils.isNumber(third)) {
          error = Utils.setFieldError(form.children(':nth-child(3)'));
          errorName = 'number';
        };
      }
      if (error) { //show error if any
        var errorTxt = ('empty' === errorName) ? local[local.currentLocal].errorEmpty : local[local.currentLocal].errorValid;
        $(this.errorSettings).removeClass('nodisplay').text(errorTxt);
      } else { //otherwise save new settings
        settings = {
          first: first,
          second: second,
          third: third
        };
        LW.putSettings(settings);
        $(this.errorSettings).removeClass('nodisplay').text(local[local.currentLocal].errorNo);

        this.params = settings; //store local
      };
    }

    cancelSetting() {
      Utils.clearFields();
      this.getSettings();
    }
};
