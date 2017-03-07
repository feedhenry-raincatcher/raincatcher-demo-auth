'use strict';
/**
 * Adds the data reset endpoint to the supplied router under DELETE /data
 * TODO: Disabe this endpoint on production scenarios, preferrably by deleting this file
 * @param  {express.Router} router   router instance to modify
 * @param  {Mediator} mediator       mediator instance to publish reset topic requests
 */
module.exports = function addResetEndpoint(router, mediator) {
  router.route('/data').delete(function(req, res) {
    mediator.request('wfm:data:reset').then(function() {
      res.status(204).end();
    }).catch(function(err) {
      res.status(500).json(err);
    });
  });
};