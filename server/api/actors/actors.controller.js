'use strict';

var User  = require('../../models/user.model'),
    Repo  = require('../../models/repo.model'),
    Event = require('../../models/event.model');

var url = require('url');

exports.index = (req, res) => {

	var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  //Since we have lots of users, paginate them
  var paginate = (query.paginate) ? query.paginate: 20,
      page     = (query.page && query.page != 0) ? (query.page - 1): 0;

  //Sort
  var sort_obj = {}; sort_obj['login'] = 1;
  if(query.sort && query.sort == 'DESC') sort_obj['login'] = -1;

  //Type filter
  var finder = {};
  if(query.type) finder.type = query.type;

  //Find the data based on the request
  User.find(finder, {_id: 0}, (err, users) => {
    if(err) return handleError(res, err);
    //Get the Count (only for pagination)
    User.find(finder).count().exec( (err, count) => {
    	//Pagination object
    	var paginator = {
    		total: Number(count),
    		current_page: Number(page+1),
    		per_page: Number(paginate),
    		last_page: Number(Math.ceil(count/paginate))
    	};
    	//Send back the response
    	return res.status(200).json({"success" : true, "data" : users, "paginate": paginator});
    });
  }).sort(sort_obj).skip(paginate * page).limit(paginate);
}

exports.show = (req, res) => {
  User.findOne({login: req.params.login}, (err, user) => {

    //Error handling
    if(err) return handleError(res, err);
    if(! user) return res.status(404).json({error: true, message: "The requested user does not exist"});

    //Can org also be a contributer or org is just to know actor belongs to it?
    /*var finder = {};
    if(user.type == 'actor'){
      finder.actor = user._id;
    }else if(user.type == 'org'){
      finder.org = user._id;
    }*/

    Event.find({actor: user._id}, (err, events) => {
      var repos = reposFromEvents(events);
      return res.json({user: user, contributed_to: repos});
    }).populate([{path:'repo', select:'-_id'}]).sort('created_at');
  });
}

exports.popularRepo = (req, res) => {
  User.findOne({login: req.params.login}, (err, user) => {

    //Error handling
    if(err) return handleError(res, err);
    if(! user) return res.status(404).json({error: true, message: "The requested user does not exist"});

    Event.aggregate([
      { $match: {
          actor: user._id
      }},
      { $sort: { created_at: 1 } },
      { $group: {
          _id: "$repo",
          count: {$sum: 1}
      }},
      { $limit: 1 },
      { $lookup: {
          from: "repos",
          localField: "_id",
          foreignField: "_id",
          as: "repo"
      }},
      { $unwind: "$repo"},
      { $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "repo",
          as: "events"
      }},
      { $project: {
          id: "$repo.id", name: "$repo.name", url: "$repo.url", _id: 0,
          events: { $filter: {
              input: "$events",
              as: "ev",
              cond: { $eq: [ "$$ev.actor", user._id ] }
          }}
      }},
    ], (err, data) => {
      //Error handling
      if(err) return handleError(res, err);
      data = (data.length > 0) ? data[0] : [];
      return res.json(data);
    });
  });
}

exports.deleteEvent = (req, res) => {
  var login = req.params.login, eventId = Number(req.params.eventId);
  if(! login)   return res.status(422).json({error: true, message: "The user login is invalid"});
  if(! eventId) return res.status(422).json({error: true, message: "The event id is invalid"});

  User.findOne({login: login}, (err, user) => {
    if(err)     return handleError(res, err);
    if(! user)  return res.status(404).json({error: true, message: "The user does not exist"});

    Event.findOne({actor: user._id, id: eventId}, (err, event) => {
      if(err)     return handleError(res, err);
      if(! event)  return res.status(404).json({error: true, message: "The event does not exist"});
      event.remove( (err) => {
        if(err) return handleError(res, err);
        return res.status(202).json({"success": true, "message": "Event deleted successfully."});
      });
    })

  });
}

function handleError(res, err) {
  return res.status(500).send(err);
}

function reposFromEvents(events){
  var repos = {};
  events.forEach( (event) => {
    var repo_id = event.repo.id;
    if(! repos[repo_id]){
      repos[repo_id] = {
        name: event.repo.name,
        url: event.repo.url,
        events: [{
          id: event.id,
          type: event.type,
          created_at: event.created_at
        }]
      };
    }else{
      repos[repo_id].events.push({
        id: event.id,
        type: event.type,
        created_at: event.created_at
      });
    }
  });
  return repos;
}