'use strict';

var express = require('express');
var controller = require('./utils.controller');

var router = express.Router();

/**
 * @api {post} /utils/data Process Data
 * @apiGroup Utils
 * @apiDescription Process the data and save it in the database. The file is picked from the app root.
 * @apiParam {String} file=data.json The name of the file to be inserted.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json"
 *     }
 * @apiParamExample {json} Request-Example:
 *     {
 *       "file": "data.json"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {'success': true, 'message': "The file is being added to database"}
 *
 * @apiError FileNotFound The data file was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": true,
 *		 "message": "The data file does not exist"
 *     }
 */
router.post('/data', controller.data);

module.exports = router;