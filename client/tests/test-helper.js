import Ember from 'ember';
import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import testing from './helpers/custom';
import testData from './helpers/posts';

setResolver(resolver);

document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container' });
var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
document.getElementById('ember-testing-container').style.visibility = containerVisibility;
window.testData = testData;
