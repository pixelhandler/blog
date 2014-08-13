import Ember from 'ember';
import RecordChunksMixin from '../mixins/record-chunks';
import ResetScroll from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, RecordChunksMixin, {

  resourceName: 'post',

  beforeModel: function () {
    this.socketSanityCheck();
    this._super();
  },

  actions: {
    showMore: function () {
      this.preventScroll = true;
      this.refresh();
    }
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

  onDidAdd: function () {
    try {
      this.socket.on('didAdd', this.addToCollections.bind(this));
    } catch (e) {
      console.log(e);
    }
  }.on('init'),

  addToCollections: function (payload) {
    var type = this.get('resourceName');
    var resource = type + 's';
    var model = this.store.retrieve(type, payload[resource].id);
    if (!model) {
      model = Ember.Object.create(payload[resource]);
    }
    "application index".w().forEach(function (name) {
      try {
        var collection = this.modelFor(name);
        if (collection) {
          collection.addObject(model); // TODO use ArrayProxy#insertAt 0
        }
      } catch (e) {
        console.log(e);
      }
    }.bind(this));
  },

  onDidRemove: function () {
    try {
      this.socket.on('didRemove', this.removeFromCollections.bind(this));
    } catch (e) {
      console.log(e);
    }
  }.on('init'),

  removeFromCollections: function (payload) {
    var type = this.get('resourceName');
    var resource = type + 's';
    var model = this.store.retrieve(type, payload[resource].id);
    if (model) {
      "application index".w().forEach(function (name) {
        try {
          var collection = this.modelFor(name);
          if (collection) {
            collection.removeObject(model);
          }
        } catch (e) {
          console.log(e);
        }
      }.bind(this));
    }
  }

});
