var $fh = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = $fh.mbaasExpress();
var cors = require('cors');
var mediator = require('fh-wfm-mediator/lib/mediator');
var bodyParser = require('body-parser');
var raincatcherUser = require('fh-wfm-user/lib/router/mbaas');

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

// Session and Cookie configuration
// This is being consumed in the raincatcher-user mbaas router.
var sessionOptions = {
  store: 'redis',
  config: {
    secret: process.env.FH_COOKIE_SECRET || 'raincatcher',
    host: process.env.FH_REDIS_HOST || '127.0.0.1',
    port: process.env.FH_REDIS_PORT || '6379',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
      path: '/'
    }
  }
};

// find out mongodb connection string from $fh.db
function run(cb) {
  $fh.db({
    act: 'connectionString'
  }, function(err, connectionString) {
    if (err || !connectionString) {
      console.log('$fh.db connectionString not found, assuming database on localhost');
    } else {
      sessionOptions.url = connectionString;
    }
    // List the user fields which you don't want appearing in the authentication response.
    // This is being consumed in the raincatcher-user mbaas router.
    var authResponseExclusionList = ['password'];
    raincatcherUser.init(mediator, app, authResponseExclusionList, sessionOptions, function(err) {
      if (err) {
        return console.error(err);
      }
      return require('./lib/user')(mediator).then(function() {
        // Important that this is last!
        app.use(mbaasExpress.errorHandler());

        var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
        var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
        app.listen(port, host, function() {
          cb(null, port);
        });
      }).catch(cb);
    });
  });
}

module.exports = run;

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
