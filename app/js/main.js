/**
 * Learn Words by Leitner system
 *
 * @version 1.0.0
 * @author Anatol Marezhanyi
 */
import '../css/styles.scss';
import 'jquery';

import storage from 'browser-lsc-storage';
console.log('storage:', storage);
const LW = storage.local;
console.log(LW.readItem);

import SettingsClass from '../components/settings/settings';
const Settings = new SettingsClass();

import { Memorystore } from './utils/memorystore';
// load the default words set if needed
if (LW.isOK && LW.isEmpty) {
  console.log('memorystore: start loading words');
  LW.loadWords(Memorystore);
  console.log('memorystore: words have been loaded');
}

import { Navigation } from './utils/navigation';
Navigation.init();

import { local } from './local/local';
local.init();

import { Vocabulary } from './actions/vocabulary';
Vocabulary.init();
Vocabulary.viewWord();

import { Learn } from './actions/learn';
Learn.init();
Learn.recountIndexLearn();
Learn.showWord();

import { Repeat } from './actions/repeat';
Repeat.init();
Repeat.recountIndexRepeat();
Repeat.showWord();

/* global NODE_ENV, $ */
if ('development' === NODE_ENV) {
  console.log(`development environment ${NODE_ENV}`);
}
// read settings
Settings.getSettings();

// set user saved local
if (local.currentLocal !== $('[data-type=lang-select].selected').data('lang')) {
  $(`[data-lang=${local.currentLocal}]`).click();
}
