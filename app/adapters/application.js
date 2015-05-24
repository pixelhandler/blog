import JSONAPISource from 'orbit-common/jsonapi-source';

export default JSONAPISource.extend({

  _transformAddStd(operation) {
    const type = operation.path[0];
    const payload = this.serializer.serialize(type, operation.value);
    // hack for post resource, type error from server and missing id
    payload.data.links.author.linkage = { id: 1, type: 'authors' };
    delete payload.data.id; // don't send a client id
    return this.ajax(this.resourceURL(type), 'POST', { data: payload }).then(
      function(raw) {
        const id = raw.data.id;
        this.deserialize(type, id, raw, operation);
      }.bind(this)
    ).catch(function(err) {
      console.error(err);
    });
  },

  _transformUpdateAttributeStd(operation) {
    const type = operation.path[0];
    const id = operation.path[1];
    const attr = operation.path[2];

    const record = {};
    record[attr] = operation.value;
    const payload = { data: { attributes: {} } };
    const primaryKey = this.schema.models[type].primaryKey.name;
    payload.data[primaryKey] = id;
    payload.data.type = this.serializer.resourceType(type);
    this.serializer.serializeAttribute(type, record, attr, payload.data.attributes);

    return this.ajax(this.resourceURL(type, id), 'PUT', { data: payload }).then(
      function() {
        this._transformCache(operation);
      }.bind(this)
    );
  }
});
