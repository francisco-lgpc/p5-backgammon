const WHITE = 1;
const BLACK = 0;

let unitW;
let unitH;

let position;

const dice = Array(2).fill();
const checkers = []

let player1
let player2
let activePlayer

let diceImages;
function preload () {
	diceImages = Array(6).fill().map((_, i) => loadImage(`assets/images/dice/${i + 1}.png`))	
}

function createCheckers(i, n) {
	for (let _n = 0; _n < n; _n++) {
		let point = getPoint(i)
		let checker = new Checker(BLACK, point)
		checkers.push(checker)
		position.grid[i].checkers.push(checker)

		point = getPoint(25 - i)
		checker = new Checker(WHITE, point)
		checkers.push(checker)
		position.grid[25 - i].checkers.push(checker)
	}
}

function createStartingPosition() {
	createCheckers(1, 2);
	createCheckers(12, 5);
	createCheckers(17, 3);
	createCheckers(19, 5);
	position.update();
}

function setup() {
	const grid = Array(26).fill().map((_, i) => new Point(i, []))
	position = new Position(grid);


	createCanvas(750, 950);
	background(0);
	unitW = width / 12;
	unitH = (height / 2) - (height / 15);
	createStartingPosition();
	showPosition();
  position.update();
  
  choosePlayers()
}

function choosePlayers() {
  player1 = new Player(WHITE)
  player2 = new Player(BLACK)
  activePlayer = player1
  activePlayer.newTurn()
}

function showPosition() {
	drawBoard();
	showCheckers();
}

function drawBoard() {
	background(0);
	noStroke(255)

	for (let i = 0; i < 12; i++) {
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
let counter = 0;
function keyPressed() {
  if (keyCode === 32) {
    rollDice();
    showDice();
  } else if (keyCode === 65) {
		counter++;
  	let ai = new AI(counter % 2);
  	ai.play();
  }
}

function getPointIndex(x, y) {
  const n = floor(x / unitW) + 1
  return y < height / 2 ? n : 25 - n
}

function getPoint(index) {
  return position.grid.find(point => point.index === index)
}

function mousePressed({ x, y }) {
  const index = getPointIndex(x, y)
  const point = getPoint(index)

  if (activePlayer.checker) {
    activePlayer.play(point)

    if (activePlayer.moves === 0) {
      activePlayer = activePlayer === player1 ? player2 : player1
      activePlayer.newTurn()
    }
  } else {
    activePlayer.pickup(point.checkers[0])
  }

  showPosition()
  showDice()


  console.log(index)
}
