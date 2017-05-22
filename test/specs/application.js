const Page = require('../pageobjects/page');
const aboutPage = require('../pageobjects/about');
const archivePage = require('../pageobjects/archive');
const tagsPage = require('../pageobjects/tags');
const assertContentLoaded = require('../helpers/assert-content-loaded');

const application = new Page();


describe('blog application', function () {
  before(() => {
    application.open();
  });

  it('has a title', function () {
    assert.equal(application.title, application.expectedTitle);
  });

  it('has header link (home)', function () {
    assert.ok(application.header.isExisting());
  });

  it('has search form', function () {
    assert.ok(application.search.isExisting());
  });

  it('has recent posts', function() {
    application.waitForContentLoaded();
    assert.ok(application.recentPosts.isExisting());
  });

  it('has links', function () {
    assert.ok(application.links.isExisting());
  });

  it('links to about page', function() {
    application.waitForContentLoaded();
    application.clickAboutLink();
    aboutPage.waitForContentLoaded();
  });

  it('links to archive page', function() {
    application.waitForContentLoaded();
    application.clickArchiveLink();
    archivePage.waitForContentLoaded();
  });

  it('links to tags page', function() {
    application.waitForContentLoaded();
    application.clickTagsLink();
    tagsPage.waitForContentLoaded();
  });

});
