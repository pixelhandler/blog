"use strict";

const Page = require('./page')

class HomePage extends Page {
  get excerpts() {
    const selector = this.contentSelector + ' .Blog-excerpt';
    return browser.element(selector);
  }

  clickReadOnLink() {
    const selector = this.contentSelector + ' a.Blog-excerpt-title-more';
    browser.click(selector);
  }

  waitForContentLoaded() {
    browser.waitForExist(this.contentSelector + ' .Blog-excerpt');
  }
}

module.exports = new HomePage();
