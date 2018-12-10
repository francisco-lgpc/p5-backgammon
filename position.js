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

	getPlayableCheckers(color, roll) {
		const myCheckers  = checkers.filter(checker => checker.color === color)
		const hitCheckers = myCheckers.filter(checker => checker.point === checker.startPoint())

		if (hitCheckers.length > 0) {
			return hitCheckers;
		}

		myCheckers.filter(checker => {
			let newPoint;

			const increment = roll * (color === BLACK ? 1 : -1)
			newPoint = position.findPoint(checker.point.index + increment)

			return (
				newPoint &&
				(newPoint.closed === color || !newPoint.closed) &&
				(this.isBearingOff(color) || (newPoint.index !== 25 && newPoint.index !== 0))
			)
		});

		return myCheckers;
	}

	isBearingOff(color) {
		return !checkers.filter(checker => checker.color === color).some(checker => (
			color === BLACK ? checker.point.index < 19 : checker.point.index > 6
		))
	}
}

