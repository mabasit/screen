'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	id : {
	  type: Number,
	  index: {
	  	unique: true
	  }
	},
	login : String,
	gravatar_id : String,
	url : String,
	avatar_url : String,
	type: {
      type: String,
      enum: ['actor', 'org']
  	}
},{
	versionKey: false
});


UserSchema.index({ 'id' : 1, 'login': 1 });

module.exports = mongoose.model('User', UserSchema);
