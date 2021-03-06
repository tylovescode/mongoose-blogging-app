'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Blogpost } = require('./models');

const app = express();
app.use(bodyParser.json());


//Mongoose Model: Blogpost
//Local Database Name: mongo-blog-app
//Collection Name: blogposts


//GET requests
app.get('/blogposts', (req, res) => {
	Blogpost
		.find()
		.then(blogposts => {
			res.json({
				blogposts: blogposts.map(
					(posts) => posts.serialize())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal Server Error' });
		});
});

//GET requests by ID
app.get('/blogposts/:id', (req, res) => {
	Blogpost
		.findById(req.params.id)
		.then(post => res.json(post.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

//POST requests
app.post('/blogposts', (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Blogpost
		.create({
			title: req.body.title,
			content: req.body.content,
			author: req.body.author
		})
		.then(post => res.status(201).json(post.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

//PUT requests by id
app.put('/blogposts/:id', (req, res) => {
	if (!(req.params.id && req.body.id === req.body.id)) {
		const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
		console.error(message);
		return res.status(400).json({ message: message });
	}

	const toUpdate = {};
	const updateableFields = ['title', 'content', 'author'];

	updateableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	Blogpost
		.findByIdAndUpdate(req.params.id, { $set: toUpdate })
		.then(post => res.status(204).end())
		.catch(err => res.status(500).json({ message: 'Internal Server Error'}));
});

//DELETE request
app.delete('/blogposts/:id', (req, res) => {
	Blogpost
		.findByIdAndRemove(req.params.id)
		.then(post => res.status(204).end())
		.catch(err => res.status(500).json({ message: 'Internal Server Error'}));
});

//NON-EXISTENT ENDPOINTS
app.use('*', function (req, res) {
	res.status(404).json({ message: '404 - File Not Found'});
});


// Running and closing the server
let server;

// Connect to database, then start server
function runServer(databaseUrl, port = PORT) {
	return new Promise((res, rej) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return rej(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				res();
			})
			.on('error', err => {
				console.log(error);
				mongoose.disconnect();
				rej(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((res, rej) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return rej(err);
				}
				res();
			});
		});
	});
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };