"use strict";

const Page = require('./page')

class PostPage extends Page {

  open(postSlug) {
    return super.open('posts/' + postSlug);
  }

  get headerText() {
    const selector = `${this.contentSelector} .Blog-post-detail-title`;
    return browser.element(selector).getText();
  }

  expectedTitleText(slug) {
    let title = slug.replace(/-/g, ' ');
    return title.split(' ').map((t) => capitalize(t)).join(' ');
  }

  get authorName() {
    const selector = this.contentSelector + ' .author strong';
    return browser.element(selector).getText();
  }

  get postDate() {
    const selector = this.contentSelector + ' .Blog-post-detail-date';
    return browser.element(selector);
  }

  get excerptContent() {
    const selector = this.contentSelector + ' .Blog-post-detail-excerpt';
    return browser.element(selector);
  }

  get bodyContent() {
    const selector = this.contentSelector + ' .Blog-post-detail-body';
    return browser.element(selector);
  }

  waitForContentLoaded() {
    browser.waitForExist(this.contentSelector + ' .Blog-post-detail-title');
  }
}

function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

module.exports = new PostPage();
