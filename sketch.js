const WHITE = 1;
const BLACK = 0;

let unitW;
let unitH;

const grid = Array(20).fill().map(() => [])
const dice = Array(2).fill();

function pushToPoint(i, n) {
	for (let _n = 0; _n < n; _n++) {
		grid[i].push(new Checker(BLACK, i))
		grid[19 - i].push(new Checker(WHITE, 19 - i))
	}
}

function createCheckers() {
	pushToPoint(0, 2);
	pushToPoint(9, 5);
	pushToPoint(13, 3);
	pushToPoint(15, 5);
}

function setup() {
	createCanvas(800, 950);
	background(0);
	unitW = width / 10;
	unitH = (height / 2) - (height / 20);
	createCheckers();
	showPosition();
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

function rollDice() {
	dice[0] = int(random(1, 7));
	dice[1] = int(random(1, 7));
	return dice;
}

