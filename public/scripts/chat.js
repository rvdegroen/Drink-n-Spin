// when it runs, it console.logs that the user connected from the server
// VARIABLES
const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
// to put the username in params: see username.js
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const onePlayerText = document.getElementById('singular__player');
const gameStart = document.getElementById('game__start');

// SOCKET.IO

// emits message to server
form.addEventListener('submit', (e) => {
	// prevents the form from refreshing the page everytime you send a message
	e.preventDefault();
	if (input.value) {
		// server emits the message to multiple clients
		socket.emit('message', { message: input.value, username });
		input.value = '';
	}
});

// receives message from server and create a li element
socket.on('message', (message) => {
	const item = document.createElement('li');
	// add: username: message, in li element
	item.textContent = `${message.username}: ${message.message}`;
	// append li to the ul with an id of message
	messages.appendChild(item);
	// automatically scroll down
	window.scrollTo(0, document.body.scrollHeight);
});

// receives from server the number of connectedClients
socket.on('connectedClients', (connectedClients) => {
	const userCount = document.getElementById('user__count');

	if (connectedClients === 1) {
		userCount.textContent = `${connectedClients} user online`;
		onePlayerText.classList.remove('hidden');
		gameStart.classList.add('hidden');
	} else {
		userCount.textContent = `${connectedClients} users online`;
		onePlayerText.classList.add('hidden');
		gameStart.classList.remove('hidden');
	}
});
