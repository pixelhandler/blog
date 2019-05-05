"use strict";

const Page = require('./page')

class AboutPage extends Page {

  open() {
    return super.open('about');
  }

  get headerText() {
    const header = `${this.contentSelector} h1`;
    return $(header).getText();
  }

  get contentSelector() {
    return '#content-main.loaded .Blog-about';
  }

  waitForContentLoaded() {
    $(this.contentSelector + ' .Blog-about-title').waitForExist(15000);
  }
}

module.exports = new AboutPage();
