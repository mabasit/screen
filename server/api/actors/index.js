'use strict';

var express = require('express');
var controller = require('./actors.controller');

var router = express.Router();

/**
 * @api {get} /actors Show actors
 * @apiGroup Actors
 * @apiDescription Get all the actors (actors and org)
 * @apiParam {Number} page=1 Page number.
 * @apiParam {Number} paginate=20 Number of results per page.
 * @apiParam {String="ASC", "DESC"} sort=ASC Sort as.
 * @apiParam {String="actor","org"} type Type of the actor.
 */
router.get('/', controller.index);

/**
 * @api {get} /actors/{login} Show actor
 * @apiGroup Actors
 * @apiDescription Get user along with its details and repositories contributed to.
 * @apiParam {String} login Users login id.
 * @apiError UserNotFound The login of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": true,
 *		 "message": "The requested user does not exist"
 *     }
 */
router.get('/:login', controller.show);

/**
 * @api {get} /actors/{login}/repositories/popular Show repository with most events
 * @apiGroup Actors
 * @apiDescription Show the repository with highest number of events based on actor's login. If multiple repositories have same number of events, th eone with latest event is shown.
 * @apiParam {String} login Users login id.
 * @apiError UserNotFound The login of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": true,
 *		 "message": "The requested user does not exist"
 *     }
 */
router.get('/:login/repositories/popular', controller.popularRepo);

/**
 * @api {delete} /actors/{login}/events/{eventId} Delete event
 * @apiGroup Events
 * @apiDescription Delete event user based on user login and event id
 * @apiParam {String} login Users login id.
 * @apiParam {Number} eventId Events id.
 * @apiError UserNotFound The login of the User was not found.
 * @apiError EventNotFound The event was not found.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 202 OK
 *     {'success': true, 'message': "Event deleted successfully."}
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": true,
 *		 "message": "The requested resource does not exist"
 *     }
 *     HTTP/1.1 422 Unprocessible Entity
 *     {
 *       "error": true,
 *		 "message": "The user login is invalid"
 *     }
 */
router.delete('/:login/events/:eventId', controller.deleteEvent);

module.exports = router;