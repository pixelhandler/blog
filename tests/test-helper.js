import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import testing from './helpers/custom';
import testData from './helpers/posts';

setResolver(resolver);
window.testData = testData;
