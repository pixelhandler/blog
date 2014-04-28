'use strict';

var get = Ember.get, set = Ember.set;

Ember.Model = Ember.Object.extend({

  id: null,

  set: function(keyName, value) {
    var changed = this._changedAttrs;
    var last = get(changed, keyName);
    if (!isUndefined(last)) {
      set(this._changedAttrs, keyName, {last: last, current: value});
    }
    return this._super(keyName, value)
  },

  setProperties: function (hash) {
    forIn.call(hash, function (prop) {
      this.set(prop, hash[prop]);
    }.bind(this));
  },

  initChangedAttrs: function() {
    this._changedAttrs = Ember.Map.create();
  }.on('init'),

  _changedAttrs: void 0,

  initObservers: function() {
    forIn.call(this, function (prop) {
      this.addObserver(prop, this, this._propertyChanged)
    }.bind(this));
  },

  _propertyChanged: function (prop) {
    var changed = this._changedAttrs;
    debugger;
    var value = get(this, prop);
    var change = get(changed, prop);
    if (isUndefined(value) || isUndefined(change)) return;
    debugger;
  },

  toJSON: function () {
    var json = {};
    forIn.call(this, function (prop) {
      json[prop] = get(this, prop);
    }.bind(this));
    return json;
  }
});

function isUndefined(o) {
  return typeof o === 'undefined';
}

function forIn(callback) {
  for (var prop in this) {
    if (this.hasOwnProperty(prop) &&
      typeof this[prop] !== 'function' &&
        prop !== '_changedAttrs' &&
          prop !== 'isEditing') {
      callback(prop);
    }
  }
}
