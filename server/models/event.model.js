'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var EventSchema = new Schema({
	id : {
	  type: Number,
	  index: {
	  	unique: true
	  }
	},
	type : String,
	actor : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	repo : {type: mongoose.Schema.Types.ObjectId, ref: 'Repo'},
	payload : Object,
	public: Boolean,
	created_at: Date,
	org : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},{
	versionKey: false
});


EventSchema.index({ 'id' : 1 });

module.exports = mongoose.model('Event', EventSchema);
