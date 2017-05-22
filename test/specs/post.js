const postPage = require('../pageobjects/post');
const homePage = require('../pageobjects/home');
const assertContentLoaded = require('../helpers/assert-content-loaded');

describe('blog post details', function () {
  const slug = 'managing-developer-happiness';

  beforeEach(() => {
    postPage.open(slug);
  });

  it('shows /posts/' + slug + ' page title', function() {
    assertContentLoaded(postPage);
    const title = postPage.expectedTitleText(slug);
    assert.equal(postPage.headerText, title);
  });

  it('shows author name', function() {
    assertContentLoaded(postPage);
    assert.equal(postPage.authorName, 'pixelhandler');
  });

  it('shows post date', function() {
    assertContentLoaded(postPage);
    assert.ok(postPage.postDate.isExisting(), 'date text present');
  });

  it('shows post excerpt content', function() {
    assertContentLoaded(postPage);
    assert.ok(postPage.excerptContent.isExisting(), 'excerpt content present');
  });

  it('shows post body content', function() {
    assertContentLoaded(postPage);
    assert.ok(postPage.bodyContent.isExisting(), 'body content present');
  });

  it('links to blog (home) page', function() {
    postPage.waitForContentLoaded();
    postPage.clickBlogLink();
    homePage.waitForContentLoaded();
  });
});
