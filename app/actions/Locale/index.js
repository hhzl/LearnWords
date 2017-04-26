import Storage from "browser-lsc-storage";
const cookies = Storage.cookie;

import enGB from "../../i18n/locale-en.json";
import ruRU from "../../i18n/locale-ru.json";
import deDE from "../../i18n/locale-de.json";

console.log("define locale");
const locale = {
  en_GB: enGB,
  de_DE: deDE,
  ru_RU: ruRU,
  changelocaleContent() {
    // Change inner content
    const langNode = document.querySelectorAll("[data-toggle=lang]");
    const langSelect = document.querySelectorAll("[data-type=lang-select]");

    langNode.forEach((node) => {
      node.innerText = this[this.currentlocale][node.dataset.lang];
    });
    langSelect.forEach((node) => {
      node.classList.remove("selected");
    });
  },

  langSelect() { // change localization
    locale.currentlocale = this.dataset.lang;
    // document.querySelector("#langSelect").click();
    // document.querySelector(".navbar-toggle:visible").click();
    locale.changelocaleContent();
    cookies.key("language", locale.currentlocale);
    this.classList.add("selected");

    return false;
  },

  init() {
    // Read user's locale or set English by default
    this.currentlocale = cookies.key("language") || "en_GB";
    document
      .querySelectorAll("[data-type=lang-select]")
      .forEach((node) => {
        node.addEventListener("click", this.langSelect);
      });

    // Set user saved locale
    if (this.currentlocale !== document.querySelector("[data-type=lang-select].selected").dataset.lang) {
      document.querySelector(`[data-lang=${this.currentlocale}]`).click();
    }
  },
};

export { locale };
