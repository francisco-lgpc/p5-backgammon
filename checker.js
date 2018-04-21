class Checker {
	constructor(color, point) {
		this.color = color;
		this.point = point;
	}
	show(heightIdx) {
		stroke(150);
		strokeWeight(3);
		fill(this.color * 255);
		let x = (this.point.index + 0.5) * unitW;
		let y = (heightIdx + 0.5) * unitW;
		if (this.point.index >= 10) {
			x = width  - (x % width)
			y = height - y
		}
		ellipse(x, y, unitW)
	}
}