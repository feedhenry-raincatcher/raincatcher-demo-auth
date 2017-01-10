'use strict';

var UserStore = require('fh-wfm-user/lib/user/store');
var Topics = require('fh-wfm-mediator/lib/topics');
// TODO: replace this seed data for users with your own
// i.e. a single initial user to create others through the portal app
var data = require('./data.json');

/**
 * Mediator listener for the user module, manipulates 'wfm:user:*' mediator topics
 * @param  {Mediator} mediator a mediator instance to publish/subscribe to
 */
module.exports = function(mediator) {
  var store = new UserStore('user');
  return store.init(data).then(function() {
    store.listen('', mediator);

    var dataTopics = new Topics(mediator);
    dataTopics.prefix('wfm').entity('data')
    .on('reset', function() {
      return store.deleteAll().then(function() {
        return store.init(data);
      });
    });
  });
};
