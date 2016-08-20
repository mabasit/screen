'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RepoSchema = new Schema({
	id : {
	  type: Number,
	  index: {
	  	unique: true
	  }
	},
	name : String,
	url : String
},{
	versionKey: false
});


RepoSchema.index({ 'id' : 1, 'name': 1 });

module.exports = mongoose.model('Repo', RepoSchema);