import Ember from 'ember';

var testing = function (app) {
  var $ = Ember.$;
  var rootElem = '#ember-testing';
  var helper = {
    container: function () {
      return app.__container__;
    },
    route: function (name) {
      return helper.container().lookup('route:' + name);
    },
    controller: function (name) {
      return helper.container().lookup('controller:' + name);
    },
    store: function () {
      return helper.container().lookup('store:main');
    },
    find: function (selector) {
      return $(selector, rootElem);
    },
    exists: function (selector) {
      return !!helper.find(selector).length;
    },
    text: function (selector) {
      return $.trim(helper.find(selector).text());
    },
    hasText: function (selector, text) {
      var elemText = helper.find(selector).text();
      return (elemText) ? elemText.match(new RegExp(text)) !== null : false;
    },
    hyperlink: function (selector) {
      return helper.find(selector).attr('href');
    }
  };

  return helper;
};

Ember.Test.registerHelper('route', function (app, name) {
  return testing(app).route(name);
});

Ember.Test.registerHelper('controller', function (app, name) {
  return testing(app).controller(name);
});

Ember.Test.registerHelper('exists', function (app, selector) {
  return testing(app).exists(selector);
});

Ember.Test.registerHelper('text', function (app, selector) {
  return testing(app).text(selector);
});

Ember.Test.registerHelper('hasText', function (app, selector, text) {
  return testing(app).hasText(selector, text);
});

Ember.Test.registerHelper('hyperlink', function (app, selector) {
  return testing(app).hyperlink(selector);
});

Ember.Test.registerHelper('unload', function (app, resource) {
  Ember.run(function () {
    testing(app).store().unloadAll(resource);
  });
});

export default testing;
