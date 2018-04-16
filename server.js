'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Blogpost } = require('./models');

const app = express();
app.use(bodyParser.json());

<<<<<<< HEAD
//GET requests to /blogposts
app.get('/blogposts', (req, res) => {
	Blogposts
	.find()
	.then(blogposts => {
		res.json({
			blogposts: blogposts.map(
				(blogpost) => blogpost.serialize())
		});
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error' });
	});
});












=======
//Mongoose Model: Blogpost
//Database Name: mongo-blog-app
//Collection Name: posts


//GET requests
app.get('/blogposts', (req, res) => {
	console.log(Blogpost.find());
	Blogpost
		.find()
		.then(posts => {
			console.log('hello');
			res.json({
				posts: posts.map(post => {
					post.serialize();
					console.log('post')
				})

			});
		
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal Server Error' });
		});
});

>>>>>>> 3cfd08e9a36eb7ebf7a24d6f6c1120214c35f1e5
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