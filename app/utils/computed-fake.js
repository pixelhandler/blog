import Ember from 'ember';

var fakeComputed = {
  get(key) {
    key = key.split('Input')[0];
    const _key = "_%@".fmt(key);
    return this.get(_key) || this.get(key);
  },
  set(key, value) {
    key = key.split('Input')[0];
    const _key = "_%@".fmt(key);
    this.set(_key, value);
    return this.get(_key) || this.get(key);
  }
};

export default function (propertyName) {
  return Ember.computed(propertyName, {
    get(key) {
      debugger;
      return fakeComputed.get.call(this, key);
    },
    set(key, value) {
      return fakeComputed.get.call(this, key, value);
    }
  });
}
