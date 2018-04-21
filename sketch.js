const WHITE = 1;
const BLACK = 0;

let unitW;
let unitH;

const grid = Array(20).fill().map(() => [])


function createCheckers() {
	let i = 0;
	for (let n = 0; n < 2; n++) {
		grid[i].push(new Checker(BLACK, i))
		grid[19 - i].push(new Checker(WHITE, 19 - i))
	}
	i = 4
	for (let n = 0; n < 5; n++) {
		grid[i].push(new Checker(WHITE, i))
		grid[19 - i].push(new Checker(BLACK, 19 - i))
	}

	i = 6;
	for (let n = 0; n < 3; n++) {
		grid[i].push(new Checker(WHITE, i))
		grid[19 - i].push(new Checker(BLACK, 19 - i))
	}

	i = 9;
	for (let n = 0; n < 5; n++) {
		grid[i].push(new Checker(BLACK, i))
		grid[19 - i].push(new Checker(WHITE, 19 - i))
	}
}

function setup() {
	createCanvas(800, 950);
	background(0);
	unitW = width / 10;
	unitH = (height / 2) - (height / 20);
	createCheckers();
	drawBoard();
	showCheckers();
}

function showPosition() {
	drawBoard();
	showCheckers();
}

function drawBoard() {
	background(0);
	noStroke(255)

	for (let i = 0; i < 10; i++) {
		fill(i % 2 === 0 ? 200 : 100);
		const x1 = unitW * i;
		const x2 = unitW * (i + 0.5);
		const x3 = unitW * (i + 1.0);

		let y1 = 0;
		let y2 = unitH;
		let y3 = 0;
		triangle(x1, y1, x2, y2, x3, y3);

		y1 = height - y1;
		y2 = height - y2;
		y3 = height - y3;
		triangle(x1, y1, x2, y2, x3, y3);
	}	
}

function showCheckers() {
	grid.forEach((point) => {
		point.forEach((checker, i) => {
			checker.show(i);
		})
	})
}