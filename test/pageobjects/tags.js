"use strict";

const Page = require('./page')

class TagsPage extends Page {

  open() {
    return super.open('tags');
  }

  get headerText() {
    const selector = `${this.contentSelector} h1`;
    return browser.element(selector).getText();
  }

  get tagLinks() {
    const selector = this.contentSelector + ' a.Blog-tags-item-link';
    return browser.elements(selector);
  }

  clickTagLink(tagName) {
    const selector = this.contentSelector + ` a[href="/tag/${tagName}"]`;
    browser.click(selector);
  }

  waitForContentLoaded() {
    browser.waitForExist(this.contentSelector + ' .Blog-tags-title');
  }
}

module.exports = new TagsPage();
