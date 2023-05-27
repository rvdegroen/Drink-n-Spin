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
// const instructionsButton = document.getElementById('instructions__button');
// const ingredientsButton = document.getElementById('ingredients__button');
// const instructions = document.getElementById('cocktail__instructions');
// const ingredients = document.getElementById('cocktail__ingredients');

// default
// ingredients.classList.add('hidden');
// instructions.classList.remove('hidden');

// // cocktail things
// instructionsButton.addEventListener('click', function () {
// 	ingredients.classList.add('hidden');
// 	instructions.classList.remove('hidden');
// });

// ingredientsButton.addEventListener('click', function () {
// 	instructions.classList.add('hidden');
// 	ingredients.classList.remove('hidden');
// });

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

// receives history
socket.on('history', (history) => {
	history.forEach((message) => {
		addMessage(message);
	});
});

function addMessage(message) {
	messages.appendChild(
		Object.assign(document.createElement('li'), {
			textContent: `${message.username}: ${message.message}`,
		})
	);
	messages.scrollTop = messages.scrollHeight;
}

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

// Recipes
const pages = document.querySelectorAll('.book__page');

let page = 0;
socket.on('get-page', (serverPage) => {
	page = serverPage;

	if (pages.length > 0) {
		pages[page].classList.add('active');
	}
});
socket.emit('get-page');

function goNextPage() {
	socket.emit('next-page');
}

function nextPage() {
	pages[page].classList.remove('active');
	page++;
	if (page >= pages.length) {
		page = page % pages.length;
	}
	pages[page].classList.add('active');
}

function goPreviousPage() {
	socket.emit('previous-page');
}

function previousPage() {
	pages[page].classList.remove('active');
	page--;
	if (page < 0) {
		page = pages.length + page;
	}
	pages[page].classList.add('active');
}

socket.on('next-page', nextPage);
socket.on('previous-page', previousPage);
