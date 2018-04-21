class AI {
	constructor(color) {
		this.myColor  = color;
		this.oppColor = color === WHITE ? BLACK : WHITE;
		this.myCheckers  = checkers.filter(checker => checker.color === this.myColor)
		this.oppCheckers = checkers.filter(checker => checker.color === this.oppColor)
	}

	play() {
		dice.forEach(die => {
			const myPlayableCheckers = this.myCheckers.slice()
			while(true) {
				const checker = myPlayableCheckers.splice(int(random(myPlayableCheckers.length)), 1)[0];
				let newPoint;

				if (this.myColor === BLACK) {
					newPoint = position.findPoint(checker.point.index + die)
				} else {
					newPoint = position.findPoint(checker.point.index - die)
				}

				if (newPoint && newPoint.closed !== this.oppColor ) {
					checker.point = newPoint
					break;
				}

				if (myPlayableCheckers.length === 0) {
					console.log('no legal moves');
					break;
				}
			}
		})
		position.update();
		showPosition();
	}
}