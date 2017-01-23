/**************************************************
* Learn Words // main.js
* coded by Anatol Marezhanyi aka e1r0nd//[CRG] - January 2017
* http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
* Placed in public domain.
**************************************************/
'use strict';

import LW from './js/utils/LW';
// console.log(LW);
let LWdb = new LW('LWdb');
// console.log(LW);
console.log(LWdb.isLocalStorageAvailable());

import Settings from './components/settings/settings';
// let settings = new Settings();
console.log(Settings);

import Utils from './js/utils/utils';
console.log(Utils);
// import Memorystore from './utils/memorystore';
// import Navigation from './utils/navigation';
// import Local from './local/local';
// import Actions from './actions/actions';

if ('development' === NODE_ENV) {
  console.log(`development environment ${NODE_ENV}`);
}
// read settings
Settings.getSettings();

// set user saved local
if (local.currentLocal !== $('[data-type=lang-select].selected').data('lang')) {
	$('[data-lang=' + local.currentLocal + ']').click();
};

Vocabulary.viewWord();
Learn.recountIndexLearn();
Learn.showWord();
Repeat.recountIndexRepeat();
Repeat.showWord();
Utils.closeMobMenu();