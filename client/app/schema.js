module.exports = {
  post: {
    attributes: {
      id: {type: 'string'},
      slug: {type: 'string'},
      title: {type: 'string'},
      author: {type: 'object'},
      date: {type: 'date'},
      excerpt: {type: 'string'},
      body: {type: 'string'}
    }
  }
};