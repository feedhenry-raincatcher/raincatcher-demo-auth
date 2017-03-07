var $fh = require('fh-mbaas-api');
var _ = require('lodash');

/**
 * MongoDb is the only currently supported data store.
 */
var SUPPORTED_STORES = ['mongo'];

/**
 * Gets mongodb connection information from $fh.db
 * Use Data Browser > Upgrade Database to get the connection information available
 */
function mongoInit(app, sessionOptions, cb) {
  // Check if direct mongo connection url exist (available after upgrading db) as mongoStore requires
  // direct url and will throw an error when trying to connect.
  $fh.db({
    act: 'connectionString'
  }, function(err, connectionString) {
    if (err) {
      return cb(err);
    }
    if (!connectionString) {
      var message = {
        ERROR: 'Mongo Connection Error',
        MESSAGE: 'Please upgrade database in Data Browser part of the Studio and re-deploy your service',
        DETAIL: 'MongoStore requires FH_MONGODB_CONN_URL system environment variable to be set, check Environment Variables part of the Studio'
      };
      idleAndListen(app, sessionOptions.appCfg, message);
    } else {
      console.log('$fh.db connectionString found');
      sessionOptions.config.url = connectionString;
      cb();
    }
  });
}

/**
 * Initialize parameters for redis client from default env vars supplied
 * by the platform
 */
function redisInit(sessionOptions, cb) {
  sessionOptions.config.host = process.env.FH_REDIS_HOST || '127.0.0.1';
  sessionOptions.config.port = process.env.FH_REDIS_PORT || '6379';
  cb();
}

/**
 * Mutates the sessionOptions object adding parameters required for the
 * store's type
 */
function sessionInit(app, sessionOptions, cb) {
  if (_.includes(SUPPORTED_STORES, sessionOptions.store)) {
    switch (sessionOptions.store) {
    case 'redis':
      redisInit(sessionOptions, cb);
      break;
    case 'mongo':
      mongoInit(app, sessionOptions, cb);
      break;
    }
  } else {
    cb('sessionOptions.store not in the list of supported stores: ' + SUPPORTED_STORES.join(' '));
  }

}

/**
 * Idle and listen, leaves app running in order to allow database upgrade.
 * @param port
 * @param host
 * @param message - message to return via http
 */
function idleAndListen(app, appCfg, message) {
  console.error(message);

  app.post('/api/wfm/user/auth', function(req, res) {
    res.json(message);
  });

  app.listen(appCfg.port, appCfg.host, function(err) {
    console.log(err);
  });

}

module.exports = sessionInit;