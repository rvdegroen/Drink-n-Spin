// IMPORTS src: https://socket.io/get-started/chat
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// VARIABLES
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4848;
const io = new Server(server);

// MIDDLEWARE EXPRESS
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

// ROUTES
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/chat', function (req, res) {
	// username is a queryparam
	const { username } = req.query;
	// give chat.ejs, username variable
	res.render('chat', { username });
});

// SOCKET IO EVENTS

io.on('connection', (socket) => {
	console.log('a user connected');

	// emits message to every user's client
	socket.on('message', (message) => {
		io.emit('message', message);
	});

	// user disconnected
	socket.on('disconnect', () => {
		console.log('a user disconnected');
	});
});

server.listen(port);
