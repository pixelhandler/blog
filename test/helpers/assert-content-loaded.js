module.exports = function assertContentLoaded(pageobject) {
  assert.equal(pageobject.contentExists, false);
  pageobject.waitForContentLoaded();
  assert.ok(pageobject.contentExists);
}
