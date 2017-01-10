const assert = require('assert');
const mediator = require('fh-wfm-mediator/lib/mediator');
const data = require('./data');

const daisyId = 'rJeXyfdrH';

describe('user topics', function() {
  before(function() {
    return require('./user')(mediator);
  });
  describe('auth', function() {
    it('should read single', function() {
      return mediator.request('wfm:user:auth',{
        username: 'trever',
        password: '123'
      }, {uid: 'trever'})
      .then(function(match) {
        assert(match, 'password shouldve been valid');
      });
    });
  });
  describe('reset', function() {
    it('should reset users to original list', function() {
      return mediator.request('wfm:user:delete', daisyId)
      .then(function() {
        return mediator.request('wfm:data:reset');
      })
      .then(function() {
        return mediator.request('wfm:user:list');
      })
      .then(function(users) {
        return assert.deepEqual(users, data);
      });
    });
  });
});
