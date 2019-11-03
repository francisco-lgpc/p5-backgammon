class Position {
	constructor(grid) {
		this.grid = grid;
    this.updateClosedPoints();

    this.validMoves = undefined;
  }
  
  canPlay(checker, newPoint) {
    return this.isValidMove(checker, this._getRoll(checker, newPoint))
  }

	play(checker, newPoint) {
    // remove die and update valid moves
    const idx = dice.findIndex(roll => roll === this._getRoll(checker, newPoint))
    dice.splice(idx, 1)

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
    checker.isPickedUp = false;
    position.update();
	}
	update() {
		this.updateGrid();
    this.updateClosedPoints();
    this.updateValidMoves(activePlayer);
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
  
  updateValidMoves(player) {
    if (!player) return

    const hitCheckers = player.myCheckers.filter(checker => checker.point === checker.startPoint())
    const availableCheckers = hitCheckers.length ? hitCheckers : player.myCheckers

    this.validMoves = new Map(dice.map(roll => [roll, this._getPlayableCheckers(player.myColor, roll)]))
  }

  isValidMove(checker, roll) {
    if (!this.validMoves) return false
    if (!this.validMoves.get(roll)) return false

    return this.validMoves.get(roll).includes(checker)
  }

	isBearingOff(color) {
		return !checkers.filter(checker => checker.color === color).some(checker => (
			color === BLACK ? checker.point.index < 19 : checker.point.index > 6
		))
  }
  
  _getPlayableCheckers(color, roll) {
		const myCheckers  = checkers.filter(checker => checker.color === color)
		const hitCheckers = myCheckers.filter(checker => checker.point === checker.startPoint())

		if (hitCheckers.length > 0) {
			return hitCheckers;
		}

		return myCheckers.filter(checker => {
			let newPoint;

			const increment = roll * (color === BLACK ? 1 : -1)
      newPoint = position.findPoint(checker.point.index + increment)

			return (
				newPoint &&
				(newPoint.closed === color || newPoint.closed === false) &&
				(this.isBearingOff(color) || (newPoint.index !== 25 && newPoint.index !== 0))
			)
		});
  }

  _getRoll(checker, point) {
    return (checker.color === WHITE ? 1 : -1) * (checker.point.index - point.index)
  }
}

