const assert = require('assert');
const mediator = require('fh-wfm-mediator/lib/mediator');

describe('user topics', function() {
  before(function() {
    return require('./user')(mediator);
  });
  describe('auth', function() {
    it('should read single', function(done) {
      mediator.request('wfm:user:auth',{
        username: 'trever',
        password: '123'
      }, {uid: 'trever'})
      .then(function(match) {
        assert(match, 'password shouldve been valid');
      }).then(done).catch(done);
    });
  });
});
