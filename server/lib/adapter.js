/**
  @module app
  @submodule adapter

  Abstract Interface to use for db adapters and as proxy methods for a model object
**/

/**
  @class Adapter
  @constructor
  @param {Object} options - host, port, db, tables
**/
var Adapter = function (options) {

  /**
    @property host
    @type String
  **/
  this.host = options.host || 'localhost';

  /**
    @property port
    @type Number
  **/
  this.port = options.port || 28015;

  /**
    @property db - Name of database
    @type String
  **/
  this.db = options.db || '';

  /**
    @property tables
    @type Object - {String} resource : {String} primaryKey
  **/
  this.tables = options.tables || {};

  return this;
};

module.exports.Adapter = Adapter;

/**
  @method find
  @param {String} type - name of resource
  @param {String} id
  @param {Function} callback(err, result) - Callback args: Error, JSON Result
**/
Adapter.prototype.find = function (type, id, callback) {
  return new NotImplementedError();
};

/**
  @method findSlug
  @param {String} type - name of resource
  @param {String} slug
  @param {Function} callback(err, result) - Callback args: Error, JSON Result
**/
Adapter.prototype.findBySlug = function (type, slug, callback) {
  return new NotImplementedError();
};

/**
  @method findQuery
  @param {String} type - name of resource
  @param {Object} query - key/value pairs
  @param {Function} callback(err, results) - Callback args: Error, Results Array
**/
Adapter.prototype.findQuery = function (type, query, callback) {
  return new NotImplementedError();
};

/**
  @method findMany
  @param {String} type - name of resource
  @param {Array} ids
  @param {Function} callback(err, results) - Callback args: Error, Results Array
**/
Adapter.prototype.findMany = function (type, ids, callback) {
  return new NotImplementedError();
};

/**
  @method findAll
  @param {String} type - name of resource
  @param {Function} callback(err, results) - Callback args: Error, Results Array
**/
Adapter.prototype.findAll = function (type, callback) {
  return Adapter.prototype.find.call(this, type, null, callback);
};

/**
  @method createRecord
  @param {String} type
  @param {Object} record
  @param {Function} callback(err, result) - Callback args: Error, JSON Result
**/
Adapter.prototype.createRecord = function (type, record, callback) {
  return new NotImplementedError();
};

/**
  @method updateRecord
  @param {String} type
  @param {String) id
  @param {Object} record
  @param {Function} callback(err, result) - Callback args: Error, JSON Result
**/
Adapter.prototype.updateRecord = function (type, id, record, callback) {
  return new NotImplementedError();
};

/**
  @method updateRecord
  @param {String} type
  @param {String) id
  @param {Object} record
  @param {Function} callback(err, result) - Callback args: Error, JSON Result
**/
Adapter.prototype.updateRecordBySlug = function (type, id, record, callback) {
  return new NotImplementedError();
};


/**
  @method patchRecord
  @param {String} type
  @param {String) id
  @param {Object/Array} patchPayload
  @param {Function} callback(err, result) - Callback args: Error, JSON Result
**/
Adapter.prototype.patchRecord = function (type, id, patchPayload, callback) {
  return new NotImplementedError();
};


/**
  @method deleteRecord
  @param {String} type
  @param {Object} record
  @param {Function} callback(err, result) - Callback args: Error, (optional) JSON Result
**/
Adapter.prototype.deleteRecord = function (type, record, callback) {
  return new NotImplementedError();
};

/**
  @method deleteRecord
  @param {String} type
  @param {Object} record
  @param {Function} callback(err, result) - Callback args: Error, (optional) JSON Result
**/
Adapter.prototype.deleteRecordBySlug = function (type, record, callback) {
  return new NotImplementedError();
};

var NotImplementedError = function (name, message) {
  this.name = name || 'NotImplementedError';
  this.message = message || 'Method Not Implemeted.';
};
NotImplementedError.prototype = new Error();
NotImplementedError.prototype.constructor = NotImplementedError;
