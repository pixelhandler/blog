import Ember from 'ember';
import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import testing from './helpers/custom';
import testData from './helpers/posts';

setResolver(resolver);

document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
if (QUnit.urlParams.nocontainer) {
  document.getElementById('ember-testing-container').style.visibility = 'hidden';
} else {
  document.getElementById('ember-testing-container').style.visibility = 'visible';
}

window.testData = testData;
