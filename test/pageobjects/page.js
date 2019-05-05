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
    return browser.$('header a');
  }

  get recentPosts() {
    return browser.$('#content-recent-posts');
  }

  get links() {
    return browser.$('.Blog-nav-list');
  }

  get search() {
    return browser.$('#query');
  }
  set search(value) {
    browser.$('#query').setValue(value);
  }

  enterSearch(query) {
    // browser.keys() doesn't seem to work, maybe the click isn't focus'g on input
    // browser.click('.Header-search-input')
    //   .keys([query])
    //   .pause(500)
    //   .keys(['Enter'])
    //   .pause(500);
    this.search = query;
    browser.elementSubmit('#search');
  }

  clickSubmitButton() {
    browser.$('#search #submit').click();
  }

  clickArchiveLink() {
    browser.$('.Blog-nav-list-item a[href="/posts"]').click();
  }

  clickAboutLink() {
    browser.$('.Blog-nav-list-item a[href="/about"]').click();
  }

  clickTagsLink() {
    browser.$('.Blog-nav-list-item a[href="/tags"]').click();
  }

  clickBlogLink() {
    browser.$('.Blog-nav-list-item a[href="/"]').click();
  }

  get contentSelector() {
    return '#content-main.loaded';
  }

  get contentExists() {
    return $(this.contentSelector).isExisting();
  }

  waitForContentLoaded() {
    $(this.contentSelector).waitForExist(15000);
  }
}

module.exports = Page;
