class Point {
	constructor(index, checkers) {
		this.index = index;
		this.checkers = checkers;
		this.closed = checkers.count
		this.updateClosed();
	}
	updateClosed() {
		if (this.isClosed(BLACK)) {
			this.closed = BLACK;
		} else if (this.isClosed(WHITE)) {
			this.closed = WHITE;
		} else {
			this.closed = false;
		}
	}

	updateCheckers() {
		this.checkers = checkers.filter(checker => checker.point === this) || []
		this.checkers.forEach(checker => checker.point = this)
	}

	isClosed(color) {
		return this.checkers.filter(checker => checker.color === color).length > 1
	}
}
