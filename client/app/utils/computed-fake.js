import Ember from 'ember';

var fakeComputed = function (key, value) {
  key = key.split('Input')[0];
  var _key = "_%@".fmt(key);
  if (arguments.length > 1) {
    this[_key] = value;
  }
  return this.get(_key) || this.get(key);
};

export default function (propertyName) {
  return Ember.computed(propertyName, function (key, value) {
    return fakeComputed.call(this, key, value);
  });
}
