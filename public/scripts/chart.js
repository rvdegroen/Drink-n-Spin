// src: https://codepen.io/ninadepina/pen/WNaWjLq

const padding = { top: 20, right: 40, bottom: 0, left: 0 };
const w = 500 - padding.left - padding.right;
const h = 500 - padding.top - padding.bottom;
const r = Math.min(w, h) / 2;
let rotation = 0;
let oldrotation = 0;
let picked = 100000;
const oldpick = [];

const data = [
	{ label: 'drink', value: 1 },
	{ label: 'person to the right drinks', value: 2 },
	{ label: 'everyone drinks', value: 3 },
	{ label: 'choose someone to drink', value: 4 },
	{ label: 'free', value: 5 },
	{ label: 'person to your left drinks', value: 6 },
	{ label: 'choose someone to drink with', value: 7 },
	{ label: 'chug', value: 8 },
];

const svg = d3
	.select('#chart')
	.append('svg')
	.data([data])
	.attr('width', w + padding.left + padding.right)
	.attr('height', h + padding.top + padding.bottom);

const container = svg
	.append('g')
	.attr('class', 'chartholder')
	.attr('transform', 'translate(' + (w / 2 + padding.left) + ',' + (h / 2 + padding.top) + ')');

const vis = container.append('g');

const pie = d3.layout
	.pie()
	.sort(null)
	.value(function () {
		return 1;
	});

const arc = d3.svg.arc().outerRadius(r);

const arcs = vis.selectAll('g.slice').data(pie(data)).enter().append('g').attr('class', 'slice');

arcs.append('path').attr('d', function (d) {
	return arc(d);
});

arcs
	.append('text')
	.attr('transform', function (d) {
		d.innerRadius = 0;
		d.outerRadius = r;
		d.angle = (d.startAngle + d.endAngle) / 2;
		return (
			'rotate(' + ((d.angle * 180) / Math.PI - 90) + ')translate(' + (d.outerRadius - 10) + ')'
		);
	})
	.attr('text-anchor', 'end')
	.text(function (d, i) {
		return data[i].label;
	});

container.on('click', spin);

function spin() {
	container.on('click', null);
	if (oldpick.length == data.length) {
		console.log('done');
		container.on('click', null);
		return;
	}
	const ps = 360 / data.length,
		rng = Math.floor(Math.random() * 1440 + 360);

	rotation = Math.round(rng / ps) * ps;

	picked = Math.round(data.length - (rotation % 360) / ps);
	picked = picked >= data.length ? picked % data.length : picked;
	if (oldpick.indexOf(picked) !== -1) {
		d3.select(this).call(spin);
		return;
	} else {
		oldpick.push(picked);
	}
	rotation += 90 - Math.round(ps / 2);
	vis
		.transition()
		.duration(3000)
		.attrTween('transform', rotTween)
		.each('end', function () {
			oldrotation = rotation;
			console.log(data[picked].value);
			container.on('click', spin);
		});
}

svg
	.append('g')
	.attr('transform', 'translate(' + (w / 2 + padding.left) + ',' + (h / 2.28 + padding.top) + ')')
	.append('path')
	.attr('d', 'M0,-34.5L27,0L-27,0Z');

container.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 40);

container.append('text').attr('x', 0).attr('y', 15).attr('text-anchor', 'middle').text('spin');

function rotTween() {
	return d3.interpolateString('rotate(' + (oldrotation % 360) + ')', 'rotate(' + rotation + ')');
}

function getRandomNumbers() {
	const array = new Uint16Array(1000);
	if (window.crypto?.getRandomValues instanceof Function) {
		window.crypto.getRandomValues(array);
		console.log('works');
	} else {
		for (let i = 0; i < array.length; i++) {
			array[i] = Math.floor(Math.random() * 100000) + 1;
		}
	}
	return array;
}
