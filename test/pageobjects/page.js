"use strict";

class Page {
  constructor() {}

  open(path) {
    browser.url('/' + (!!path ? path : ''));
  }

  get title() {
    return browser.getTitle();
  }

  get expectedTitle() {
    return "Pixelhandler's blog";
  }

  get header() {
    return browser.element('header a');
  }

  get recentPosts() {
    return browser.element('#content-recent-posts');
  }

  get links() {
    return browser.element('.Blog-nav-list');
  }

  get search() {
    return browser.element('#query');
  }
  set search(value) {
    browser.element('#query').setValue(value);
  }

  enterSearch(query) {
    // browser.keys() doesn't seem to work, maybe the click isn't focus'g on input
    // browser.click('.Header-search-input')
    //   .keys([query])
    //   .pause(500)
    //   .keys(['Enter'])
    //   .pause(500);
    this.search = query;
    browser.submitForm('#search');
  }

  clickSubmitButton() {
    browser.click('#search #submit');
  }

  clickArchiveLink() {
    browser.click('.Blog-nav-list-item a[href="/posts"]');
  }

  clickAboutLink() {
    browser.click('.Blog-nav-list-item a[href="/about"]');
  }

  clickTagsLink() {
    browser.click('.Blog-nav-list-item a[href="/tags"]');
  }

  clickBlogLink() {
    browser.click('.Blog-nav-list-item a[href="/"]');
  }

  get contentSelector() {
    return '#content-main.loaded';
  }

  get contentExists() {
    return browser.isExisting(this.contentSelector);
  }

  waitForContentLoaded() {
    browser.waitForExist(this.contentSelector);
  }
}

module.exports = Page;
