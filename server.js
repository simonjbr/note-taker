// require necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const db = require('./db/db.json');

// set port for server
const PORT = process.env.port || 3001;

// initialise express application
const app = express();

// middleware for parsing json and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files in public dir
app.use(express.static('public'));

// GET route for notes.html
app.get('/notes', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET route for index.html
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

// GET route for /api/notes
app.get('/api/notes', (req, res) => {
	fs.readFile(db, 'utf-8', (err) => {
		console.error(err);
	})
		.then((data) => {
			res.json(data);
		})
});

// start listening
app.listen(PORT, () => {
	console.log(`App listening at http://localhost:${PORT}`);
});