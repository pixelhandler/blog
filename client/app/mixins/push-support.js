import Ember from 'ember';

export default Ember.Mixin.create({

  beforeModel: function () {
    this.socketSanityCheck();
    return this._super();
  },

  socketSanityCheck: function () {
    // Sanity check, is socket working? check output browser console.
    var socket = this.socket;
    socket.on('hello', function (data) {
      console.log(data);
      socket.emit('talk-to-me', 'I like talking.', function (msg) {
        console.log('back talk', msg);
      });
    });
  },

  // Template methods...

  onDidPatch: Ember.required,

  patchRecord: function (operation) {
    this._patchRecord(operation);
  },

  addLink: Ember.K,
  replaceLink: Ember.K,
  removeLink: Ember.K,
  addRecord: Ember.K,
  updateAttribute: Ember.K,
  deleteRecord: Ember.K,

  // Use in template methods...

  _patchRecord: function (operation) {
    console.log('patchRecord', operation);
    operation = (typeof operation === 'string') ? JSON.parse(operation) : operation;
    if (!operation.op || !operation.path) {
      console.error('Push error! Invalid patch operation.');
      return;
    }
    if (operation.path.match('/links/') !== null) {
      if (operation.op === 'add') {
        Ember.run.later(this, 'addLink', operation, this._delay);
      } else if (operation.op === 'replace') {
        Ember.run.next(this, 'replaceLink', operation);
      } else if (operation.op === 'remove') {
        Ember.run.next(this, 'removeLink', operation);
      }
    } else {
      if (operation.op === 'add') {
        Ember.run.next(this, 'addRecord', operation);
      } else if (operation.op === 'replace') {
        Ember.run.next(this, 'updateAttribute', operation);
      } else if (operation.op === 'remove') {
        Ember.run.next(this, 'deleteRecord', operation);
      }
    }
  },

  _addLink: function(operation) {
    var model = this._retrieveModel(operation);
    if (model) {
      var type = operation.path.split('/links/')[1];
      var relation = this.store.retrieve(type, { primaryId: operation.value });
      if (relation) {
        model.addLink(type, relation);
      }
    }
  },

  _replaceLink: function(operation) {
    console.error('replaceLink not supported', operation);
  },

  _removeLink: function(operation) {
    console.log('removeLink');
    var model = this._retrieveModel(operation);
    if (model) {
      var path = operation.path.split('/links/')[1].split('/');
      var type = path[0];
      var id = path[1];
      var relation = null;
      if (id) {
        relation = this.store.retrieve(type, { primaryId: id });
      }
      model.removeLink(type, relation);
    }
  },

  _addRecord: function (operation) {
    var type = this._extractType(operation);
    var id = operation.value.id;
    var model = this.store.retrieve(type, { primaryId: id });
    if (!model) {
      this.store.add(type, operation.value);
      this.store.then(function() {
        model = this.store.retrieve(type, { primaryId: id });
        var name = this.get('routeName');
        var collection = this.modelFor(name);
        if (collection && !collection.contains(model)) {
          collection.insertAt(0, model);
          this.controllerFor(name).set('model', collection);
        }
      }.bind(this));
    }
  },

  _updateAttribute: function(operation) {
    var type = this._extractType(operation);
    if (!type) {
      return;
    }
    var typeKey = this.store.schema._schema.pluralize(type);
    var path = operation.path.split('/' + typeKey + '/')[1];
    var id, attribute;
    if (path.indexOf('/') !== -1) {
      path = path.split('/');
      id = path[0];
      attribute = path[1];
    }
    var model = this.store.retrieve(type, {primaryId: id});
    if (model && attribute) {
      model.set(attribute, operation.value);
    }
  },

  _deleteRecord: function (operation) {
    var model = this._retrieveModel(operation);
    if (model) {
      var name = this.get('routeName');
      var collection = this.modelFor(name);
      if (collection) {
        collection.removeObject(model);
      }
      var controller = this.controllerFor(name);
      if (controller) {
        controller.removeObject(model);
      }
      if (model.constructor.typeKey) {
        var type = model.constructor.typeKey;
        var id = model.get('primaryId');
        Ember.run.later(this.store, 'remove', type, id, this._delay);
      }
    }
  },

  _extractType: function (operation) {
    var path = operation.path.split('/');
    var type = this.store.schema._schema.singularize(path[1]);
    if (!this.store.schema._schema.models[type]) {
      console.error('Cannot extract type', path);
    }
    return type;
  },

  _retrieveModel: function (operation) {
    var path = operation.path.split('/');
    var type = this.store.schema._schema.singularize(path[1]);
    var id = path[2];
    return this.store.retrieve(type, { primaryId: id });
  },

  _delay: 1000

});
