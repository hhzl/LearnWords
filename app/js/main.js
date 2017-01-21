/**************************************************
* Learn Words // main.js
* coded by Anatolii Marezhanyi aka e1r0nd//[CRG] - March 2014
* http://linkedin.com/in/merezhany/ a.merezhanyi@gmail.com
* Placed in public domain.
**************************************************/
require('./utils/LWdb');
require('./utils/utils');
require('./utils/memorystore');
require('./utils/navigation');
require('./local/local');
require('./actions/actions');

if ('development' === NODE_ENV) {
  console.log('development environment');
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
