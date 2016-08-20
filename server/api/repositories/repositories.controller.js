'use strict';

var User  = require('../../models/user.model'),
    Repo  = require('../../models/repo.model'),
    Event = require('../../models/event.model');

var url = require('url');

exports.index = (req, res) => {

	var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  //Since we have lots of repos, paginate them
  var paginate = (query.paginate) ? query.paginate: 20,
      page     = (query.page && query.page != 0) ? (query.page - 1): 0,

      // SORT BY: Number of events (max by a user); user's name or the repo's name | DEFAULTS TO USER_EVENTS
      sort_by  = (query.sort_by) ? sortValue(query.sort_by) : "user_events",
      // SORT ASC OR DESC | DEFAULTS TO DESC
      sort     = (query.sort && query.sort == 'ASC') ? 1 : -1;
  
  //Create sort object that will be passed to query
  var sort_obj = {}; sort_obj[sort_by] = sort;

  //Query for data
  Event.aggregate([
    { $group: {
        _id: { repo: "$repo", actor: "$actor" },
        events: { $sum: 1 }
    }},
    { $project: {
        repo: "$_id.repo",
        actor: "$_id.actor",
        events: 1, _id: 0
    }},
    { $group: {
        _id: "$repo",
        max: { $max: "$events" },
        data: { $addToSet: { actor: "$actor", events: "$events" }}
    }},
    { $project: {
        _id: 0, repo: "$_id",
        actor: {
          $filter: {
            input: "$data",
            as: "actorData",
            cond: { $eq: [ "$$actorData.events", "$max" ] }
        }}
    }},
    { $project: {
        repo: 1,
        actor: { $arrayElemAt: ["$actor", 0] }
    }},
    { $lookup: {
        from: "users",
        localField: "actor.actor",
        foreignField: "_id",
        as: "user"
    }},
    { $lookup: {
        from: "repos",
        localField: "repo",
        foreignField: "_id",
        as: "repo"
    }},
    { $unwind: "$repo" },
    { $unwind: "$user" },
    { $project: {
        id: "$repo.id", name: "$repo.name", url: "$repo.url",
        user_events: "$actor.events", user: 1
    }},
    { $sort: sort_obj },
    { $skip: page * paginate },
    { $limit: paginate }
  ], (err, data) => {
    if (err) return handleError(res, err);
    Repo.count().exec( (err, count) => {
     //Pagination object
     var paginator = {
       total: Number(count),
       current_page: Number(page+1),
       per_page: Number(paginate),
       last_page: Number(Math.ceil(count/paginate))
     };
     //Send back the response
     return res.status(200).json({"success" : true, "data" : data, "paginate": paginator});
    });
  });
}

exports.show = (req, res) => {
	var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

	//Find the repository
	Repo.findOne({id: Number(req.params.id)}, (err, repo) => {
		
		//Error handling
		if(err) return handleError(res, err);
		if(! repo) return res.status(404).json({error: true, message: "The requested repo does not exist"});

		var finder = {
			repo: repo._id
		};

  	//If we have filters selected (type filter => it will filter events based on eventType)
  	if(query.type) finder.type = query.type;

		//Find the events associated with the repo (and populate events with actor and org details)
		Event.find(finder, {_id:0, repo: 0}, (err, events) => {
			return res.json({repo: repo, events: events});
		}).populate([{path:'actor', select:'-_id'}, {path:'org', select:'-_id'}]).sort('created_at');
	});
}

function handleError(res, err) {
  return res.status(500).send(err);
}

function sortValue(sort) {
  if(sort == 'user_name') return 'user.login';
  if(sort == 'repo_name') return 'name';
  return 'user_events';
}