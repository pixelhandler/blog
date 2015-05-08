module.exports = {
  production: {
    store: {
      type: 'redis',
      host: process.env['REDIS_HOST'],
      port: process.env['REDIS_PORT'],
      password: process.env['REDIS_SECRET']
    },
    assets: {
      type: 's3',
      accessKeyId: process.env['AWS_ACCESS_KEY'],
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      bucket: 'cdn.pixelhandler.com'
    }
  }
};
