'use strict';

const mongoose = require('mongoose');

// This is our schema to represent a blog post
const blogpostSchema = mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: [{
		firstName: String,
		lastName: String,
	}],
	created: Date
});

// Virtuals
blogpostSchema.virtual('authorString').get(function() {
	return `${this.author.firstName} ${this.author.lastName}`.trim()
});

blogpostSchema.methods.serialize = function() {
	return {
		title: this.title,
		content: this.content,
		author: this.authorString
	};
}

const Blogpost = mongoose.model('Blogpost', blogpostSchema);

module.exports = {Blogpost};