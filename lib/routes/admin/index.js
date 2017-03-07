'use strict';
var express = require('express');

module.exports = function buildAdminRouter(mediator) {
  var router = express.Router();

  /**
   * Asks for data to be reset to the default list of users
   * This is intended only for demonstration/debugging purposes.
   * TODO: Remove this endpoint in production or when not needed
   */
  require('./addResetEndpoint')(router, mediator);

  return router;
};