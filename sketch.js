const WHITE = 1;
const BLACK = 0;

let unitW;
let unitH;

let position;

const dice = Array(2).fill();

const checkers = []

let diceImages;
function preload () {
	diceImages = Array(6).fill().map((_, i) => loadImage(`assets/images/dice/${i + 1}.png`))	
}

function createCheckers(i, n) {
	for (let _n = 0; _n < n; _n++) {
		let point = position.grid.find(point => point.index === i)
		let checker = new Checker(BLACK, point)
		checkers.push(checker)
		position.grid[i].checkers.push(checker)

		point = position.grid.find(point => point.index === 19 - i)
		checker = new Checker(WHITE, point)
		checkers.push(checker)
		position.grid[19 - i].checkers.push(checker)
	}
}

function createStartingPosition() {
	createCheckers(0, 2);
	createCheckers(9, 5);
	createCheckers(13, 3);
	createCheckers(15, 5);
	position.update();
}

function setup() {
	const grid = Array(20).fill().map((_, i) => new Point(i, []))
	position = new Position(grid);


	createCanvas(750, 950);
	background(0);
	unitW = width / 10;
	unitH = (height / 2) - (height / 15);
	createStartingPosition();
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
	position.grid.forEach((point) => {
		point.checkers.forEach((checker, i) => {
			checker.show(i);
		})
	})
}

function rollDice() {
	dice[0] = int(random(1, 7));
	dice[1] = int(random(1, 7));
	return dice;
}


function showDice() {
	const diceSize = 75;
	imageMode(CENTER);
	image(diceImages[dice[0] - 1], width / 2 - diceSize, height / 2, diceSize, diceSize)
	image(diceImages[dice[1] - 1], width / 2 + diceSize, height / 2, diceSize, diceSize)	
}

function keyPressed() {
  if (keyCode === 32) {
    rollDice();
    showDice();
  } else if (keyCode === 65) {
  	ai = new AI(BLACK);
  	ai.play();
  }
}
