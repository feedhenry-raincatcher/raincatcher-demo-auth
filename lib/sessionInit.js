var $fh = require('fh-mbaas-api');
const supportedStores = ['redis', 'mongo'];
/**
 * Gets mongodb connection information from $fh.db
 * Use Data Browser > Upgrade Database to get the connection information available
 */
function mongoInit(sessionOptions, cb) {
  $fh.db({
    act: 'connectionString'
  }, function(err, connectionString) {
    if (err) {
      return cb(err);
    }
    if (!connectionString) {
      console.error('WARN: $fh.db connectionString not found, assuming database on localhost');
      console.error('WARN: if you wish to use $fh.db with your cloud app, run a database upgrade');
      console.error('WARN: through the Data Browser > Upgrade Database command');
    } else {
      console.log('$fh.db connectionString found');
      sessionOptions.config.url = connectionString;
    }
    cb();
  });
}

/**
 * Initialize parameters for redis client from default env vars supplied
 * by the platform
 */
function redisInit(sessionOptions, cb) {
  sessionOptions.config.host = process.env.FH_REDIS_HOST || '127.0.0.1',
  sessionOptions.config.port = process.env.FH_REDIS_PORT || '6379',
  cb();
}

/**
 * Mutates the sessionOptions object adding parameters required for the
 * store's type
 */
function sessionInit(sessionOptions, cb) {
  switch (sessionOptions.store) {
  case 'redis':
    redisInit(sessionOptions, cb);
    break;
  case 'mongo':
    mongoInit(sessionOptions, cb);
    break;
  default:
    cb('sessionOptions.store not in the list of supported stores: ' + supportedStores.join(' '));
    break;
  }
}

module.exports = sessionInit;