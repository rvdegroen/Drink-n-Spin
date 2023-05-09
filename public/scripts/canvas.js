// VARIABLES
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// last known position for canvas
const pos = { x: 0, y: 0 };

// FUNCTIONS
// new position from mouse or touch event
const setPosition = (e) => {
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	if (e.type.startsWith('mouse')) {
		pos.x = (e.clientX - rect.left) * scaleX;
		pos.y = (e.clientY - rect.top) * scaleY;
	} else if (e.type.startsWith('touch')) {
		pos.x = (e.touches[0].clientX - rect.left) * scaleX;
		pos.y = (e.touches[0].clientY - rect.top) * scaleY;
	}
};

const setTouchPosition = (e) => {
	e.preventDefault();
	setPosition(e);
};

const draw = (e) => {
	// mouse left button must be pressed, otherwise you draw without holding click
	// 1 is the primary button (left mouse btn), 2 secondary, 3 primary + secondary
	if (e.buttons !== 1 && e.type.startsWith('mouse')) return;

	ctx.beginPath(); // begin

	ctx.lineWidth = 5;
	ctx.lineCap = 'round';
	ctx.strokeStyle = '#000000';

	ctx.moveTo(pos.x, pos.y); // from
	setPosition(e);
	ctx.lineTo(pos.x, pos.y); // to

	ctx.stroke(); // draw it!
};

// EVENT LISTENERS
// add event listeners to canvas
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);

// for mobile devices
canvas.addEventListener('touchstart', setTouchPosition);
canvas.addEventListener('touchmove', draw);
