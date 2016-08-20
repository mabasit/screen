/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

  // Routes for repositories
  app.use('/api/repositories', require('./api/repositories'));

  // Routes for actors
  app.use('/api/actors', require('./api/actors'));

  // Routes for utilities 
  app.use('/api/utils', require('./api/utils'));

};
