const archivePage = require('../pageobjects/archive');
const assertContentLoaded = require('../helpers/assert-content-loaded');

describe('blog archive page', function () {
  beforeEach(() => {
    archivePage.open();
  });

  it('shows archive page title', function() {
    assertContentLoaded(archivePage);
    assert.equal(archivePage.headerText, 'Blog Archive');
  });
});
