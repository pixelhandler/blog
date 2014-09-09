import Ember from 'ember';

export default Ember.Mixin.create({
/*
  beforeModel: function () {
    this.socketSanityCheck();
    this._super();
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

  patchableCollections: "application index postsIndex".w(),

  onDidAdd: function () {
    try {
      this.socket.on('didAdd', this.addToCollections.bind(this));
    } catch (e) {
      console.log(e);
    }
  }.on('init'),

  addToCollections: function (payload) {
    console.log('addToCollections', payload);
    // if (!payload.op) { return; } TODO use JSON Patch syntax for payload?
    var type = this._extractType(payload);
    var typeKey = this.store.schema._schema.pluralize(type);
    var model = this.store.retrieve(type, payload[typeKey].id);
    if (!model) {
      model = Ember.Object.create(payload[typeKey]);
    }
    this.get('patchableCollections').forEach(function (name) {
      try {
        var collection = this.modelFor(name);
        if (collection) {
          collection.insertAt(0, model);
          var controller = this.controllerFor(name);
          if (controller) {
            controller.set('content', collection);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }.bind(this));
  },

  onDidPatch: function () {
    try {
      this.socket.on('didPatch', this.patchInCollections.bind(this));
    } catch (e) {
      console.log(e);
    }
  }.on('init'),

  patchInCollections: function (payload) {
    console.log('patchInCollections', payload);
    if (payload.op && payload.op === 'remove') {
      this.removeFromCollections(payload);
    } else if (payload) {
      this.updateInStore(payload);
    }
  },

  removeFromCollections: function (payload) {
    console.log('removeFromCollections', payload);
    var model = this._retrieveModel(payload);
    if (model) {
      this.get('patchableCollections').forEach(function (name) {
        try {
          var collection = this.modelFor(name);
          if (collection) {
            collection.removeObject(model);
            var controller = this.controllerFor(name);
            if (controller) {
              controller.set('content', collection);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }.bind(this));
      if (model.constructor.typeKey) {
        this.store.remove(model.constructor.typeKey, model.get('id'));
      }
    }
  },

  updateInStore: function (payload) {
    console.log('updateInStore', payload);
    var type = this._extractType(payload);
    var typeKey = this.store.schema._schema.pluralize(type);
    var model = this.store.retrieve(type, payload[typeKey].id);
    // TODO perhaps need to use JSON Patch payload not model as JSON
    var record = payload[typeKey];
    if (model && record) {
      delete record.id;
      model.setProperties(payload[typeKey]);
    }
  },

  _extractType: function (payload) {
    var models = this.store.schema._schema.models;
    var type;
    for (var key in payload) {
      if (payload.hasOwnProperty(key)) {
        key = this.store.schema._schema.singularize(key);
        if (models[key]) {
          type = key;
          continue;
        }
      }
    }
    if (!type) {
      throw new Error('Cannot extract type');
    } else {
      return type;
    }
  },

  _retrieveModel: function (payload) {
    if (!payload.path) { return undefined; }
    var path = payload.path.split('/');
    var type = this.store.schema._schema.singularize(path[1]);
    var id = path[2];
    var model = this.store.retrieve(type, {id: id});
    return (model) ? model : undefined;
  }
*/
});
