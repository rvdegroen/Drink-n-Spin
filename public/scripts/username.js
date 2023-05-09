// VARIABLES
const socket = io();
const usernameForm = document.getElementById('username__form');
const usernameInput = document.getElementById('username__input');

// FUNCTION FOR INDEX.EJS
usernameForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const username = usernameInput.value;
	// queryparam in url with username
	const url = `/chat?username=${encodeURIComponent(username)}`;
	socket.emit('username', username);
	// redirect to url with query param
	window.location.href = url;
});

console.log('testing username');
