class Checker {
	constructor() {
		this.point = 0;
		this.color = BLACK;
	}
	show() {
		stroke(150);
		strokeWeight(3);
		fill(this.color * 255);
		ellipse((this.point + 0.5) * unitW, unitW / 2, unitW)
	}
}