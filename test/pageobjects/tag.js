"use strict";

const Page = require('./page')

class TagPage extends Page {

  open(tagName) {
    return super.open('tag/' + tagName);
  }

  get headerText() {
    const selector = `${this.contentSelector} h1`;
    return browser.element(selector).getText();
  }

  expectedTitleText(slug) {
    let title = slug.replace(/-/g, ' ');
    title = title.split(' ').map((t) => capitalize(t)).join(' ');
    return "Tag: `" + title + "`";
  }

  get tagLinks() {
    const selector = this.contentSelector + ' a.Blog-tags-item-link';
    return browser.elements(selector);
  }

  clickTagLink(tagName) {
    const selector = this.contentSelector + ` a[href="/tag/${tagName}"]`;
    browser.click(selector);
  }

  clickReadOnLink() {
    const selector = this.contentSelector + ' a.Blog-excerpt-title-more';
    browser.click(selector);
  }

  waitForContentLoaded() {
    browser.waitForExist(this.contentSelector + ' .Blog-tag-title');
  }
}

function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

module.exports = new TagPage();
