// require necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

// set port for server
const PORT = process.env.PORT || 3001;

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

// GET route for /api/notes
app.get('/api/notes', async (req, res) => {

	// read existing notes in db.json
	const json = await fs.readFile('./db/db.json', 'utf-8', (err) => {
		console.error(err);
	})

	const data = JSON.parse(json);
	res.json(data);
});

// POST route for /api/notes
app.post('/api/notes', async (req, res) => {

	// create new note, assign unique id and inject data from request
	const newNote = {
		id: uuidv4(),
		title: req.body.title,
		text: req.body.text,
	};

	// read existing notes in db.json
	const rawNotes = await fs.readFile('./db/db.json', 'utf-8', (err) => {
		console.error(err);
	});
	const notes = JSON.parse(rawNotes);

	// add new note to notes array
	notes.push(newNote);

	// overwrite db.json with altered notes array
	await fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
		console.error(err);
	});

	res.send(notes);
});

// DELETE route for /api/notes
app.delete('/api/notes/:id', async (req, res) => {
	const id = req.params.id;

	// read existing notes in db.json
	const rawNotes = await fs.readFile('./db/db.json', 'utf-8', (err) => {
		console.error(err);
	});

	const notes = JSON.parse(rawNotes);

	// find the index of note object with the same id and splice it out of the array
	for (let i = 0; i < notes.length; i++) {
		const note = notes[i];
		if (note.id === id) {
			notes.splice(i, 1);
		}
	}

	// overwrite db.json with altered notes array
	await fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
		console.error(err);
	});

	res.send(notes);
});

// GET route for index.html
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

// start listening
app.listen(PORT, () => {
	console.log(`App listening at http://localhost:${PORT}`);
});