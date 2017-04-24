/**
 * Learn Words by Leitner system
 *
 * @version 1.0.0
 * @author Anatol Marezhanyi
 */
import "./css/styles.scss";
import "jquery";

import storage from "browser-lsc-storage";
console.log("storage:", storage);
const LW = storage.local;
console.log(LW.readItem);

import SettingsClass from "./components/settings/settings";
const Settings = new SettingsClass();

import { Memorystore } from "./js/utils/memorystore";
// load the default words set if needed
if (LW.isOK && LW.isEmpty) {
  console.log("memorystore: start loading words");
  LW.loadWords(Memorystore);
  console.log("memorystore: words have been loaded");
}

import { Navigation } from "./js/utils/navigation";
Navigation.init();

import { local } from "./js/local/local";
local.init();

import { Vocabulary } from "./js/actions/vocabulary";
Vocabulary.init();
Vocabulary.viewWord();

import { Learn } from "./js/actions/learn";
Learn.init();
Learn.recountIndexLearn();
Learn.showWord();

import { Repeat } from "./js/actions/repeat";
Repeat.init();
Repeat.recountIndexRepeat();
Repeat.showWord();

/* global NODE_ENV, $ */
if ("development" === NODE_ENV) {
  console.log(`development environment ${NODE_ENV}`);
}
// read settings
Settings.getSettings();

// set user saved local
if (local.currentLocal !== $("[data-type=lang-select].selected").data("lang")) {
  $(`[data-lang=${local.currentLocal}]`).click();
}

const Main = document.createElement("div");
Main.className = "container";

import Footer from "./components/Footer";
console.log(Footer);
Main.appendChild(Footer);

/* Create a document after all */
document.querySelector("body").appendChild(Main);
