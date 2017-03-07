'use strict';

var UserStore = require('fh-wfm-user/lib/user/store')({
  persistent: process.env.WFM_USE_MEMORY_STORE !== 'true'
});

var Topics = require('fh-wfm-mediator/lib/topics');
var Promise = require('bluebird');

// TODO: replace this seed data for users with your own
// i.e. a single initial user to create others through the portal ap
// Seed data for users, replace with your own.
var data = require('./data.json');

function deleteAll(store) {
  var topics = store.topics;
  return topics.request('list').then(function(users) {
    return Promise.map(users, function(user) {
      return topics.request('delete', user.id, {uid: user.id});
    });
  });
}

/**
 * Mediator listener for the user module, manipulates 'wfm:user:*' mediator topics
 * @param  {Mediator} mediator a mediator instance to publish/subscribe to
 */
module.exports = function setupUserStore(mediator) {
  var store = new UserStore('user');

  return store.list().then(function(list) {
    // Dont push all seed data at start if there is data already, if you want to reset back to seed data use
    // DELETE'/admin/data or use Settings > Reset Data function on Portal Demo app
    if (list && list.length > 0) {
      data = store.isPersistent  ? null : [];
    }
    return store.init(data).then(function() {
      store.listen('', mediator);
      var dataTopics = new Topics(mediator);
      dataTopics.prefix('wfm').entity('data')
        .on('reset', function() {
          return deleteAll(store).then(function() {
            return store.init(data);
          });
        });
    });
  });
};

// export function for unit testing
module.exports.deleteAll = deleteAll;