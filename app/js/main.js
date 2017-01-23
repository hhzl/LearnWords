/**************************************************
* Learn Words // main.js
* coded by Anatol Marezhanyi aka e1r0nd//[CRG] - January 2017
* http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
* Placed in public domain.
**************************************************/
'use strict';

import LWClass from './utils/LW';
// console.log(LW);
const LW = new LWClass('LWdb');
// console.log(LW);
console.log(LW.isLocalStorageAvailable());

import SettingsClass from '../components/settings/settings';
const Settings = new SettingsClass();

import Utils from './utils/utils';

import {Memorystore} from './utils/memorystore';
// load the default words set if needed
if (LW.isOK && LW.isEmpty) {
  console.log('memorystore: start loading words');
  LW.loadWords(Memorystore);
  console.log('memorystore: words have been loaded');
}

// import Navigation from './utils/navigation';
// import Local from './local/local';
// import Actions from './actions/actions';
if ('development' === NODE_ENV) {
  console.log(`development environment ${NODE_ENV}`);
}
// read settings
Settings.getSettings();

// set user saved local
//if (local.currentLocal !== $('[data-type=lang-//select].selected').data('lang')) {
//	$('[data-lang=' + local.currentLocal + ']').click();
//};

// Vocabulary.viewWord();
// Learn.recountIndexLearn();
// Learn.showWord();
// Repeat.recountIndexRepeat();
// Repeat.showWord();
// Utils.closeMobMenu();
