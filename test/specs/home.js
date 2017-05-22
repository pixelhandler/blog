const homePage = require('../pageobjects/home');
const postPage = require('../pageobjects/post');
const assertContentLoaded = require('../helpers/assert-content-loaded');

describe('blog home page', function () {
  beforeEach(() => {
    browser.url('/');
  });

  it('shows blog post excerpts', function() {
    assertContentLoaded(homePage);
    assert.ok(homePage.excerpts.isExisting());
  });

  it('links to post details', function() {
    assertContentLoaded(homePage);
    homePage.clickReadOnLink();
    postPage.waitForContentLoaded();
  });
});
