'use strict';

var get = Ember.get, set = Ember.set;

module.exports = Ember.Model = Ember.Object.extend({

  id: null,

  __type__: null,

  initChangedAttrs: function() {
    this._changedAttrs = Ember.Map.create();
    var attrs = {};
    forIn.call(this, function (prop) {
      attrs[prop] = this.get(prop);
    }.bind(this));
    this._originalAttrs = attrs;
  }.on('init'),

  _changedAttrs: void 0,
  _originalAttrs: void 0,

  initObservers: function() {
    forIn.call(this, function (prop) {
      this.addObserver(prop, this, this._propertyChanged);
    }.bind(this));
  }.on('init'),

  _propertyChanged: function (context, prop) {
    var lastChange = get(context._changedAttrs, prop);
    var last = (isUndefined(lastChange)) ? null : lastChange.previous;
    var value = get(context, prop);
    context._changedAttrs.set(prop, {previous: last, current: value});
    if (last === null) {
      this._originalAttrs[prop] = value;
    }
  },

  //save: function () {
    //var operations = this.toJSONPatch();
    //if (isArray(operations)) {
      //var opPromises = operations.map(transformFactory.bind(this));
      //return Ember.RSVP.all(opPromises);
    //} else if (isObject(operations)) {
      //return transformFactory.call(this, operations);
    //}
  //},

  save: function () {
    var changes = this._changedAttrs.keys.list;
    if (!changes.length) return null;
    var promises = changes.map(function (property) {
      return new Ember.RSVP.Promise(function (resolve, reject) {
        var type = this.__type__;
        var id = this.get('id');
        var value = this.get(property);
        return this.dataSource.patch(type, id, property, value).then(
          function done(payload) {
            resolve(payload);
          },
          function fail(error) {
            reject(error);
          }
        );
      }.bind(this));
    }.bind(this));

    return (promises.length > 1) ? Ember.RSVP.all(promises) : promises[0];
  },

  rollback: function () {
    return this.setProperties(this._originalAttrs);
  },

  destroy: function () {
    var operation = this.toJSONPatch('remove');
  },

  toJSON: function () {
    var json = {};
    forIn.call(this, function (prop) {
      json[prop] = get(this, prop);
    }.bind(this));
    return json;
  }

  //toJSONPatch: function (op) {
    //var changes = this._changedAttrs.keys.list;
    //if (!changes.length) return null;
    //var op = op || (changes.length) ? 'replace' : 'add';
    //var changeSet = [];
    //var operations = changes.map(function (prop) {
      //return operationFactory(op, prop, this);
    //}.bind(this));

    //return (operations.length > 1) ? operations : operations[0]
  //}

});

var forIn = function (callback) {
  var localProps = "_changedAttrs _originalAttrs isEditing".w();
  for (var prop in this) {
    if (this.hasOwnProperty(prop) && !isFunction(this[prop]) && !inArray(localProps, prop)) {
      callback(prop);
    }
  }
};

//var operationFactory = function (op, prop, context) {
  //var operation = {
    //op: op,
    //path: "/%@/%@".fmt(pluralize(context.__type__), context.get('id'))
  //};
  //if (op !== 'remove') {
    //operation.path = "%@/%@".fmt(operation.path, prop);
    //operation.value = context.get(prop);
  //}
  //return operation;
//};

//var transformFactory = function (operation) {
  //return new Ember.RSVP.Promise(function (resolve, reject) {
    //this.dataSource.transform(operation).then(
      //function success(payload) {
        //resolve(payload);
      //},
      //function fail(error) {
        //reject(error);
      //}
    //);
  //}.bind(this));
//};

// Type checking helpers, See: https://github.com/necolas/idiomatic-js#type

var isUndefined = function (o) {
  return typeof o === 'undefined';
};

var isFunction = function (o) {
  return typeof o === 'function';
};

var inArray = function (a, prop) {
  return a.indexOf(prop) > -1;
};

var isArray = function (a) {
  return Array.isArray(a);
};

var isObject = function (o) {
  return typeof o === 'object';
};

var pluralize = function (prop) {
  // TODO use inflector? https://github.com/emberjs/data/blob/master/packages/ember-inflector/
  return prop + 's';
};
