// when it runs, it console.logs that the user connected from the server
// VARIABLES
const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// SOCKET.IO

// emits message to server
form.addEventListener('submit', (e) => {
	// prevents the form from refreshing the page everytime you send a message
	e.preventDefault();
	if (input.value) {
		// server emits the message to multiple clients
		socket.emit('message', input.value);
		input.value = '';
	}
});

// receives message from server and create a li element
socket.on('message', (msg) => {
	const item = document.createElement('li');
	item.textContent = msg;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});
