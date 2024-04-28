// require necessary modules
const express = require('express');
const path = require('path');

// set port for server
const PORT = process.env.port || 3001;

// initialise express application
const app = express();

// middleware for parsing json and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET route for notes.html
app.get('/notes', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET route for index.html
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

// start listening
app.listen(PORT, () => {
	console.log(`App listening at http://localhost:${PORT}`);
});