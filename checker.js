class Checker {
	constructor(color, point) {
		this.color = color;
		this.point = point;
  }

	show(heightIdx) {
		stroke(150);
		strokeWeight(3);
		fill(this.color * 255);
		let x = (this.point.index - 0.5) * unitW;
		let y = (heightIdx + 0.5) * unitW;

		if (this.point === this.startPoint()) {
			x = 100 + heightIdx * 5;
			y = height / 2;
			console.log('start');
		}

		if (this.point.index >= 13) {
			x = width  - (x % width);
			y = height - y;
		}

		ellipse(x, y, unitW);
	}

	startPoint() {
		return this.color === BLACK ? position.findPoint(0) : position.findPoint(25);
	}

	gotHit() {
		this.point = this.startPoint();
		console.log('hit', this.color);
	}
}