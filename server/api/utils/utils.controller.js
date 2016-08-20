'use strict';

var waterfall = require('async-waterfall'),
    fs = require('fs');

var User  = require('../../models/user.model'),
    Repo  = require('../../models/repo.model'),
    Event = require('../../models/event.model');

exports.data = function(req, res) {

  var file = (req.body.file) ? req.body.file : 'data.json';
  file = process.cwd() + '/' + file;

  fs.exists(file, (exists) => {
    //Check if file exists
    if(! exists) return res.status(404).json({
      "error": true,
      "message": "The data file does not exist"
    });

    const lineReader = require('readline').createInterface({
      input: fs.createReadStream(file)
    });

    var counter = 1;

    lineReader.on('line', function (data) {
      data = JSON.parse(data);
      // Four ops:
      // 1: Check if actor exists. Create or get its _id
      // 2: Check if repo exists. Create or get its _id
      // 3: If organization (org) field is present in data, check if it (actor) exists. Create or get its _id
      // 4: Create an event

      waterfall([
        //Check if the user exists | If not create user else pass user's _id to next
        function(callback){
          User.findOne({id: data.actor.id}, (err, user) => {
            if(err) return callback(err);
            if(user) return callback(null, user._id);

            //Create User
            user = data.actor;
            user.type = 'actor';
            User.create(user, (err, user) => {
              if(err) console.log("Error at actor creation is: " + err);
              if(err) return callback(err);
              return callback(null, user._id);
            });
          });
        },
        //Check if the repo exists | If not create repo else pass repo's _id to next
        function(user_id, callback){
          Repo.findOne({id: data.repo.id}, (err, repo) => {
            if(err) return callback(err);
            if(repo) return callback(null, user_id, repo._id);

            //Create repo
            Repo.create(data.repo, (err, repo) => {
              if(err) console.log("Error at repo creation is: " + err);
              if(err) return callback(err);
              return callback(null, user_id, repo._id);
            });
          });
        },
        //Check if the org exists | If not create org else pass org's _id to next
        function(user_id, repo_id, callback){
          if(! data.org) return callback(null, user_id, repo_id, null);
          
          User.findOne({id: data.org.id}, (err, org) => {
            if(err) return callback(err);
            if(org) return callback(null, user_id, repo_id, org._id);

            //Create org
            org = data.org;
            org.type = 'org';
            User.create(org, (err, org) => {
              if(err) console.log("Error at organization creation is: " + err);
              if(err) return callback(err);
              return callback(null, user_id, repo_id, org._id);
            });
          });
        },
        //Create an event
        function(actor_id, repo_id, org_id, callback){
          var event   = data;
          event.actor = actor_id;
          event.repo  = repo_id;
          if(event.org) event.org = org_id;

          Event.create(event, (err, event) => {
            if(err) return callback(err);
            callback(null, event);
          });
        }
      ], function(event){
        console.log("Events added: " + counter);
        counter++;
      });
    });

    return res.json({'success': true, 'message': "The file is being added to database"});
  });

};

function handleError(res, err) {
  return res.status(500).send(err);
}