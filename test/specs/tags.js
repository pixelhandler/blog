const tagsPage = require('../pageobjects/tags');
const tagPage = require('../pageobjects/tag');
const assertContentLoaded = require('../helpers/assert-content-loaded');

describe('blog tags page', function () {
  const tagName = 'deployment';

  beforeEach(() => {
    tagsPage.open();
  });

  it('shows tags page title', function() {
    assertContentLoaded(tagsPage);
    assert.equal(tagsPage.headerText, 'Tags…');
  });

  it('shows various tags that are clickable', function() {
    assertContentLoaded(tagsPage);
    assert.ok(tagsPage.tagLinks.isExisting(), 'tag links are present');
  });

  it('links to the /tag/' + tagName + ' page', function() {
    assertContentLoaded(tagsPage);
    tagsPage.clickTagLink(tagName);
    tagPage.waitForContentLoaded();
  });
});
