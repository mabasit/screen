'use strict';

var express = require('express');
var controller = require('./repositories.controller');

var router = express.Router();

/**
 * @api {get} /repositories Show repositories
 * @apiGroup Repositories
 * @apiDescription Get all the repositories along with the most contributing actor
 * @apiParam {String="user_name", "repo_name", "user_events"} sort_by=user_events Sort by.
 * @apiParam {Number} page=1 Page number.
 * @apiParam {String="ASC", "DESC"} sort=DESC Sort as.
 * @apiParam {Number} paginate=20 Number of results per page.
 */
router.get('/', controller.index);

/**
 * @api {get} /repositories/{id} Show repository
 * @apiGroup Repositories
 * @apiDescription Get repository based on its id along with its events .
 * @apiParam {Number} id Repository's id.
 * @apiParam {String} type Type of the event.
 * @apiError RepoNotFound The id of the repository was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": true,
 *		 "message": "The requested repo does not exist"
 *     }
 */
router.get('/:id', controller.show);

module.exports = router;