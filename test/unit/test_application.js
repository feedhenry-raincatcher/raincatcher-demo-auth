var sinon = require('sinon');
var proxyquire = require('proxyquire');
var assert = require('assert');

// mock out express app to allow verification in tests
var mockExpress = {
  use: function() {},
  listen: sinon.stub().yields([null, 8001]),
  static: function() {}
};
var mockExpressApp = function() {
  return mockExpress;
};
var mockStaticHandler = function static() {};
mockExpressApp.static = function() {
  return mockStaticHandler;
};

// mock out fh-mbaas-api to allow verification in tests
var mockMbaasApi;
var mockSys;
var mockFhMiddleware;
var mockCloud;
var mockError;
var mockSysHandler = function sys() {};
var mockMbaasHandler = function mbaas() {};
var mockFhMiddlewareHandler = function fhmiddleware() {};
var mockCloudHandler = function cloud() {};
var mockErrorHandler = function errorHandler() {};
var createMockMbaasApi = function() {
  return {
    mbaasExpress: sinon.spy(function() {
      mockSys = sinon.spy(function() {
        return mockSysHandler;
      });

      mockFhMiddleware = sinon.spy(function() {
        return mockFhMiddlewareHandler;
      });

      mockCloud = sinon.spy(function() {
        return mockCloudHandler;
      });

      mockError = sinon.spy(function() {
        return mockErrorHandler;
      });

      return {
        sys: mockSys,
        mbaas: mockMbaasHandler,
        fhmiddleware: mockFhMiddleware,
        cloud: mockCloud,
        errorHandler: mockError
      };
    })
  };
};

// simple mock cors middleware
var mockCorsHandler = function cors() {};
var mockCors = function() {
  return mockCorsHandler;
};

// require the main app file, with mocked dependencies
var runApp = function(cb) {
  mockMbaasApi = createMockMbaasApi();
  proxyquire('../../application.js', {
    'express': mockExpressApp,
    'fh-mbaas-api': mockMbaasApi,
    'cors': mockCors
  })(cb);
};

describe('Test mbass functionality', function() {

  it('test instantiate the user module with the required parameters', function(done) {
    // stub the init function in the mbass router in fh-wfm-user
    var authInit = sinon.stub(require('fh-wfm-user/lib/router/mbaas'), 'init');
    authInit.yields();

    // setup paramaters to send
    var expectedMediator = {};
    var expectedApp = {};
    var expectedAuthResponseExclusionList = ['password'];

    // setup spy, this will spy on the init method in the mbass router in fh-wfm-user
    var callback = sinon.spy();

    // called the init function in the mbass router in fh-wfm-user
    require('fh-wfm-user/lib/router/mbaas').init(expectedMediator, expectedApp, expectedAuthResponseExclusionList, callback);

    authInit.restore();

    // confrm that the function was called with the correct parameters
    sinon.assert.calledOnce(callback);
    sinon.assert.calledWith(authInit, expectedMediator, expectedApp, expectedAuthResponseExclusionList);

    done();
  });

  it('test express app listen is called', function(done) {
    // var mock = sinon.mock(mockExpress);
    // mock.expects("listen").once().withArgs(8001, '0.0.0.0');

    runApp(function() {
      assert(mockExpress.listen
        .withArgs(8001, '0.0.0.0')
        .calledOnce);
      done();
    });
  });

  it('test all mbaas routes are mounted', function(done) {
    var mock = sinon.mock(mockExpress);
    mock.expects("use").once().withArgs('/sys', mockSysHandler);
    mock.expects("use").once().withArgs('/mbaas', mockMbaasHandler);
    mock.expects("use").atLeast(4); // allow for other calls to use()

    runApp(function() {
      mock.verify();
      done();
    });

  });
});
