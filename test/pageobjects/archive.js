"use strict";

const Page = require('./page')

class ArchivePage extends Page {

  open() {
    return super.open('posts');
  }

  get headerText() {
    const header = `${this.contentSelector} h3`;
    return browser.element(header).getText();
  }

  waitForContentLoaded() {
    browser.waitForExist(this.contentSelector + ' .Blog-archive-title');
  }
}

module.exports = new ArchivePage();
