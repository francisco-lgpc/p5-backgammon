const WHITE = 1;
const BLACK = 0;

let unitW;
let unitH;

function setup() {
	createCanvas(900, 900);
	background(0);
	unitW = width / 10;
	unitH = (height / 2) - (height / 20);
}

function draw() {
	drawBoard();

	checker = new Checker
	checker.show()
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
