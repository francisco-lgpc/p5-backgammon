function setup() {
	createCanvas(1000, 700);
	background(0);
}

function draw() {
	drawBoard();	
}


function drawBoard() {
	background(0);
	const unitW = width / 10;
	const unitH = (height / 2) - (height / 20);
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
