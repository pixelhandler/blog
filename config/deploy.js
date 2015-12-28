var VALID_DEPLOY_TARGETS = ['production'];

module.exports = function(deployTarget) {
  var ENV = {
    build: {},
    redis: {
      allowOverwrite: true,
      keyPrefix: 'pixelhandler-blog:index'
    },
    s3: {
      prefix: 'pixelhandler-blog'
    }
  };
  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }

  if (deployTarget === 'production') {

    ENV.s3 = {
      accessKeyId: process.env['AWS_ACCESS_KEY'],
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      bucket: 'cdn.pixelhandler.com',
      region: 'us-east-1'
    };

    ENV.redis = {
      host: process.env['REDIS_HOST'],
      port: process.env['REDIS_PORT'],
      password: process.env['REDIS_SECRET']
    };
  }

  return ENV;
}
