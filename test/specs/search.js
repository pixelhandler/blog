const homePage = require('../pageobjects/home');
const postPage = require('../pageobjects/post');
const assertContentLoaded = require('../helpers/assert-content-loaded');

describe('blog search', function () {
  const query = 'development';

  it.skip('shows query term in form input', function() {
    browser.url('/?search=' + query);
    assertContentLoaded(homePage);
    assert.equal(homePage.search.getValue(), query, 'query input text present');
  });

  it('shows results as blog post excerpts', function() {
    browser.url('/?search=' + query);
    assertContentLoaded(homePage);
    assert.ok(homePage.excerpts.isExisting());
  });

  it('shows results with links to post details', function() {
    browser.url('/?search=' + query);
    assertContentLoaded(homePage);
    homePage.clickReadOnLink();
    postPage.waitForContentLoaded();
  });

  describe('form submission', function() {
    it('uses button to show results', function() {
      browser.url('/');
      assertContentLoaded(homePage);
      browser.click('#query');
      homePage.search = 'happiness';
      homePage.clickSubmitButton();
      homePage.waitForContentLoaded();
      assert.ok(homePage.excerpts.isExisting());
      homePage.clickReadOnLink();
      postPage.waitForContentLoaded();
      assert.equal(postPage.headerText, 'Managing Developer Happiness');
    });

    it.skip('uses enter key to show results', function() {
      browser.url('/');
      assertContentLoaded(homePage);
      homePage.enterSearch('happiness');
      homePage.waitForContentLoaded();
      assert.ok(homePage.excerpts.isExisting());
      homePage.clickReadOnLink();
      postPage.waitForContentLoaded();
      assert.equal(postPage.headerText, 'Managing Developer Happiness');
    });
  });
});
