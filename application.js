var $fh = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = $fh.mbaasExpress();
var cors = require('cors');
var mediator = require('fh-wfm-mediator/lib/mediator');
var bodyParser = require('body-parser');
var raincatcherUser = require('fh-wfm-user/lib/router/mbaas');
var sessionInit = require('./lib/sessionInit');
var adminRouter = require('./lib/routes/admin');

// list the endpoints which you want to make securable here
var securableEndpoints;

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/api', bodyParser.json({limit: '10mb'}));

app.use('/admin', adminRouter(mediator));

/**
 * Session and Cookie configuration
 * This is being consumed in the raincatcher-user mbaas router.
 * For available stores, see
 * {@link https://github.com/feedhenry-raincatcher/raincatcher-user/tree/master/lib/session/mongoProvider.js}
 *
 * This application requires a valid mongodb connection string to store session data.
 */
var sessionOptions = {
  store: 'mongo',
  config: {
    secret: process.env.FH_COOKIE_SECRET || 'raincatcher',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      path: '/'
    }
  }
};

// find out mongodb connection string from $fh.db
function run(cb) {
  var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
  var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

  sessionOptions.appCfg = {port: port, host: host};

  sessionInit(app, sessionOptions, function(err) {
    if (err) {
      return cb(err);
    }
    // List the user fields which you don't want appearing in the authentication response.
    // This is being consumed in the raincatcher-user mbaas router.
    var authResponseExclusionList = ['password'];
    raincatcherUser.init(mediator, app, authResponseExclusionList, sessionOptions, function(err) {
      if (err) {
        return cb(err);
      }
      return require('./lib/user')(mediator).then(function() {
        // Important that this is last!
        app.use(mbaasExpress.errorHandler());

        app.listen(port, host, function(err) {
          cb(err, port);
        });
      });
    });
  });
}

module.exports = run;

// We need to allow this file to be required with a node-style callback in order
// to support unit testing since application initialization is async
// But if this file is run directly it should just run the express application
if (require.main === module) {
  // file called directly, run app from here
  run(function(err, port) {
    if (err) {
      return console.error(err);
    }
    console.log("App started at: " + new Date() + " on port: " + port);
  });
} else {
  console.log('application.js required by another file, not running application');

}