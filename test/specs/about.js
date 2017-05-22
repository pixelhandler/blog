const aboutPage = require('../pageobjects/about');
const assertContentLoaded = require('../helpers/assert-content-loaded');

describe('blog about page', function () {
  beforeEach(() => {
    aboutPage.open();
  });

  it('shows about page title', function() {
    assertContentLoaded(aboutPage);
    assert.equal(aboutPage.headerText, 'About');
  });
});
