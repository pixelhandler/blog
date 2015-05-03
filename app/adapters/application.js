import JSONAPISource from 'orbit-common/jsonapi-source';

export default JSONAPISource.extend({

  _transformAddStd: function(operation) {
    const type = operation.path[0];
    const json = this.serializer.serialize(type, operation.value);
    // hack for post resource, type error from server and missing id
    json.data.links.author.linkage = { id: 1, type: 'authors' };
    delete json.data.id; // don't send a client id

    return this.ajax(this.resourceURL(type), 'POST', {data: json}).then(
      function(raw) {
        const id = raw.data.id;
        this.deserialize(type, id, raw, operation);
      }.bind(this)
    ).catch(function(err) {
      console.error(err);
    });
  },

  _transformUpdateAttributeStd: function(operation) {
    const type = operation.path[0];
    const id = operation.path[1];
    const attr = operation.path[2];

    const record = {};
    record[attr] = operation.value;

    const primaryKey = this.schema.models[type].primaryKey.name;
    const resourceType = this.serializer.resourceType(type);
    const serialized = { type: resourceType };
    serialized[primaryKey] = id;
    this.serializer.serializeAttribute(type, record, attr, serialized);

    const json = { data: serialized };

    return this.ajax(this.resourceURL(type, id), 'PUT', {data: json}).then(
      function() {
        this._transformCache(operation);
      }.bind(this)
    );
  }
});
