const express = require('express');

module.exports = function(mediator) {
  const router = express.Router();

  // TODO: Remove this endpoint when not needed
  if (process.env.NODE_ENV === 'development') {
    /**
     * Asks for data to be reset to the default list of users
     * This is intended only for demonstration/debugging purposes
     * and by default only runs on NODE_ENV === 'development'
     */
    router.route('/data').delete(function(req, res) {
      mediator.request('wfm:data:reset').then(function() {
        res.send('ok');
      }).catch(function(err) {
        res.status(500).send(err);
      });
    });
  }

  return router;
};