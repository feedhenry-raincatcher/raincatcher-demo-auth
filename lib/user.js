'use strict';

var UserStore = require('fh-wfm-user/lib/user/store');
// Seed data for users, replace with your own.
var data = require('./data.json');

/**
 * Mediator listener for the user module, manipulates 'wfm:user:*' mediator topics
 * @param  {Mediator} mediator a mediator instance to publish/subscribe to
 */
module.exports = function(mediator) {
  var store = new UserStore('user');
  return store.init(data).then(function() {
    return store.listen('', mediator);
  });
};
