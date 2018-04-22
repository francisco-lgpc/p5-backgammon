class Position {
	constructor(grid) {
		this.grid = grid;
		this.updateClosedPoints();
	}
	play(checker, newPoint) {
		if (newPoint.checkers.length > 1) {
			const otherChecker = newPoint.checkers[0]
			if (otherChecker.color !== checker.color) {	
				console.error('*****');
			}
		}


		if (newPoint.checkers.length === 1) {
			const otherChecker = newPoint.checkers[0]
			if (otherChecker.color !== checker.color) {	
				newPoint.checkers[0].gotHit();
			}
		}
		checker.point = newPoint;
		position.update();
	}
	update() {
		this.updateGrid();
		this.updateClosedPoints();
	}
	findPoint(i) {
		return this.grid.find(point => point.index === i)
	}
	updateGrid() {
		this.grid.forEach(point => point.updateCheckers());
	}
	updateClosedPoints() {
		this.grid.forEach(point => point.updateClosed());
	}
}

