// require necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

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
app.get('/api/notes', async (req, res) => {
	const json = await fs.readFile('./db/db.json', 'utf-8', (err) => {
		console.error(err);
	})
	
	const data = JSON.parse(json);
	res.json(data);
});

// POST route for /api/notes
app.post('/api/notes', async (req, res) => {
	const newNote = {
		id: uuidv4(),
		title: req.body.title,
		text: req.body.text,
	};
	const rawNotes = await fs.readFile('./db/db.json', 'utf-8', (err) => {
		console.error(err);
	});
	const notes = JSON.parse(rawNotes);
	notes.push(newNote);

	await fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
		console.error(err);
	});

	res.json(notes);

});

// DELETE route for /api/notes
// app.delete('/api/notes/:id', )

// start listening
app.listen(PORT, () => {
	console.log(`App listening at http://localhost:${PORT}`);
});