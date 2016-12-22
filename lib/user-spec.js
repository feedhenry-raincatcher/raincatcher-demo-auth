const assert = require('assert');
const mediator = require('fh-wfm-mediator/lib/mediator');
const store = require('fh-wfm-user/lib/user/store');
require('./user')(mediator, store);

describe('user topics', function() {
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
