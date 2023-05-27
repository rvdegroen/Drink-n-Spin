require('dotenv').config();

// IMPORTS src: https://socket.io/get-started/chat
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// VARIABLES
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4848;
const io = new Server(server);

const historySize = 50;
let history = [];

let connectedClients = 0;
const pages = ['Mojito Blanco', 'Bloody Mary', 'Cosmopolitan', 'Sex on the Beach'];
let page = 0;

// MIDDLEWARE EXPRESS
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

// ROUTES
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/chat', async function (req, res) {
	// username is a queryparam
	const { username } = req.query;

	// for book
	//const cocktail = await getCocktailByQuery(pages[0]);

	// promise.all takes all the promises, turns it into one promise and we can await it (because getcocktailbyquery is async, it returns promises)
	// pages.map(name) turns an array of promises
	const cocktails = await Promise.all(pages.map((name) => getCocktailByQuery(name)));

	// console.log('cocktails', cocktails);

	// give chat.ejs, username variable
	res.render('chat', { username, cocktails });
});

// api from my own server
app.get('/api/cocktail', async (req, res) => {
	// api from api ninjas
	// https://api.api-ninjas.com/v1/cocktail?name=
	const { name } = req.query;

	const response = await fetch(`https://api.api-ninjas.com/v1/cocktail?name=${name}`, {
		headers: {
			'X-Api-Key': process.env.API_KEY,
		},
	});
	const data = await response.json();

	// how to make sure if something is an array
	if (Array.isArray(data)) {
		const firstCocktail = data[0];
		return res.json(firstCocktail);
	}
	// response that the server sends to the client in cocktails.js
	res.json(data);
});

// FUNCTIONS
async function getCocktailByQuery(query) {
	const response = await fetch(`https://api.api-ninjas.com/v1/cocktail?name=${query}`, {
		headers: {
			'X-Api-Key': process.env.API_KEY,
		},
	});
	const data = await response.json();

	// how to make sure if something is an array
	if (Array.isArray(data)) {
		// return the first recipe
		const firstCocktail = data[0];
		return firstCocktail;
	}
	// response that the server sends to the client in cocktails.js
	return data;
}

// SOCKET IO EVENTS

io.on('connection', (socket) => {
	console.log('a user connected');
	// with every connection, increment users
	connectedClients++;

	io.emit('history', history);

	// emits message to every user's client
	socket.on('message', (message) => {
		while (history.length > historySize) {
			history.shift();
		}
		history.push(message);

		io.emit('message', message);
	});

	socket.on('get-page', () => {
		socket.emit('get-page', page);
	});

	socket.on('spin', () => {
		const rng = Math.floor(Math.random() * 1440 + 360);
		io.emit('spin', rng);
	});

	socket.on('next-page', () => {
		page++;
		if (page >= pages.length) {
			page = page % pages.length;
		}
		io.emit('next-page');
	});

	socket.on('previous-page', () => {
		page--;
		if (page < 0) {
			page = pages.length + page;
		}
		io.emit('previous-page');
	});

	// user disconnected
	socket.on('disconnect', () => {
		console.log('a user disconnected');
		connectedClients--;

		// emit to client disconnected and connected clients
		io.emit('connectedClients', connectedClients);
	});

	// emit to client newly connected users
	io.emit('connectedClients', connectedClients);
});

server.listen(port);
