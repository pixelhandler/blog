const tagPage = require('../pageobjects/tag');
const tagsPage = require('../pageobjects/tags');
const postPage = require('../pageobjects/post');
const assertContentLoaded = require('../helpers/assert-content-loaded');

describe('blog tag page', function () {
  const slug = 'deployment';
  const otherSlug = 'ember-addons';

  beforeEach(() => {
    tagPage.open(slug);
  });

  it('shows /tag/' + slug + ' page title', function() {
    assertContentLoaded(tagPage);
    const title = tagPage.expectedTitleText(slug);
    assert.equal(tagPage.headerText, title);
  });

  it('shows various tags that are clickable', function() {
    assertContentLoaded(tagPage);
    assert.ok(tagPage.tagLinks.isExisting(), 'tag links are present');
  });

  it('links to tags page for ' + otherSlug, function() {
    assertContentLoaded(tagPage);
    tagPage.clickTagLink(otherSlug);
    browser.pause(500);
    tagPage.waitForContentLoaded();
    const title = tagPage.expectedTitleText(otherSlug);
    assert.equal(tagPage.headerText, title);
  });

  it('links to post details page', function() {
    assertContentLoaded(tagPage);
    tagPage.clickReadOnLink();
    postPage.waitForContentLoaded();
  });
});
