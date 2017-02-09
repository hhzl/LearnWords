/**************************************************
* Learn Words // main.js
* coded by Anatol Marezhanyi aka e1r0nd//[CRG] - January 2017
* http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
* Placed in public domain.
**************************************************/
'use strict';

import '../css/styles.scss';
// import 'jquery';
import 'bootstrap'; // remove after materialize-css will be implemented

import {browserStorage} from './browser-lsc-storage';
console.log(browserStorage);
const LW = new browserStorage.BrowserLocalStorageClass('LWdb');
// import LWClass from './utils/LW';
// const LW = new LWClass('LWdb');
console.log(LW.readItem);

import SettingsClass from '../components/settings/settings';
const Settings = new SettingsClass();

import {Utils} from './utils/utils';

import {Memorystore} from './utils/memorystore';
// load the default words set if needed
if (LW.isOK && LW.isEmpty) {
  console.log('memorystore: start loading words');
  LW.loadWords(Memorystore);
  console.log('memorystore: words have been loaded');
}

import {Navigation} from './utils/navigation';
Navigation.init();

import {local} from './local/local';
local.init();

import {Vocabulary} from './actions/vocabulary';
Vocabulary.init();
Vocabulary.viewWord();

import {Learn} from './actions/learn';
Learn.init();
Learn.recountIndexLearn();
Learn.showWord();

import {Repeat} from './actions/repeat';
Repeat.init();
Repeat.recountIndexRepeat();
Repeat.showWord();

if ('development' === NODE_ENV) {
  console.log(`development environment ${NODE_ENV}`);
}
// read settings
Settings.getSettings();

// set user saved local
if (local.currentLocal !== $('[data-type=lang-select].selected').data('lang')) {
	$(`[data-lang=${local.currentLocal}]`).click();
};

Utils.closeMobMenu();
