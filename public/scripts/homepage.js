// VARIABLES FOR INDEX.EJS
const createRoomButton = document.getElementById('create__room');
const enterRoomButton = document.getElementById('enter__room');
const overviewPage = document.querySelector('.overviewpage');
const createRoomPage = document.querySelector('.userpage');
const enterRoomPage = document.querySelector('.roompage');

createRoomButton.addEventListener('click', (e) => {
	overviewPage.classList.add('hidden');
	createRoomPage.classList.remove('hidden');
});

enterRoomButton.addEventListener('click', (e) => {
	overviewPage.classList.add('hidden');
	enterRoomPage.classList.remove('hidden');
});
