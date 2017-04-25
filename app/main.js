/**
 * @file Learn Words by Leitner system
 * @copyright Anatol Marezhanyi 2017
 * @version 2.0.0-aplha
 */
import "./css/styles.scss";
import "jquery";

import storage from "browser-lsc-storage";
const LW = storage.local;
LW.prefix = "LWdb";

/* Create Main container for all components */
const Main = document.createElement("div");
Main.className = "container";

/* Import all components and inject into Main container */
import SettingsClass from "./components/settings";
const Settings = new SettingsClass();
console.log(Settings);
Main.appendChild(Settings.createBlock());

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

// set user saved local
if (local.currentLocal !== $("[data-type=lang-select].selected").data("lang")) {
  $(`[data-lang=${local.currentLocal}]`).click();
}

import Footer from "./components/Footer";
Main.appendChild(Footer);

/* Create a document after all */
document.querySelector("body").appendChild(Main);

// Init settings, add event listeners
Settings.init();
