"use strict";

const Page = require('./page')

class AboutPage extends Page {

  open() {
    return super.open('about');
  }

  get headerText() {
    const header = `${this.contentSelector} h1`;
    return browser.element(header).getText();
  }

  get contentSelector() {
    return '#content-main.loaded .Blog-about';
  }

  waitForContentLoaded() {
    browser.waitForExist(this.contentSelector + ' .Blog-about-title');
  }
}

module.exports = new AboutPage();
