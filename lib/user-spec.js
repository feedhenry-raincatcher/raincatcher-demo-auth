const assert = require('assert');
const mediator = require('fh-wfm-mediator/lib/mediator');
const sinon = require('sinon');
const Promise = require('bluebird');
const data = require('./data');

const daisyId = 'rJeXyfdrH';


describe('user topics', function() {
  before(function() {
    return require('./user')(mediator);
  });
  describe('auth', function() {
    it('should read single [slow]', function() {
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

function setupTopicsStub() {
  var requestStub = sinon.stub();
  requestStub.withArgs('list').returns(Promise.resolve([
    {id: 'id1'},
    {id: 'id2'}
  ]));
  requestStub.withArgs('delete').returns(Promise.resolve(true));
  return {
    request: requestStub
  };
}

describe('#deleteAll', function() {
  beforeEach(function() {
    this.deleteAll = require('./user').deleteAll;
    this.topics = setupTopicsStub();
  });
  it('should request for deleting of individual ids and finish', function() {
    var topics = this.topics;
    return this.deleteAll({ topics: topics })
    .then(function() {
      assert(topics.request.withArgs('list').calledOnce);
      assert(topics.request.withArgs('delete').calledTwice);
    });
  });
});