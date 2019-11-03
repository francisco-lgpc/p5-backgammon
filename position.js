class Position {
  constructor(game, grid) {
    this.game = game
    this.grid = grid
    this.updateClosedPoints()

    this.validMoves = undefined
  }

  canPlay(checker, newPoint) {
    const roll = this._getRoll(checker, newPoint)
    if (this.getBearOffPoints().includes(newPoint) && !this.game.dice.includes(roll)) {
      for (let _hypotheticalRoll = roll + 1; _hypotheticalRoll <= 6; _hypotheticalRoll++) {
        if (
          this.game.dice.includes(_hypotheticalRoll) &&
          this.isValidMove(checker, _hypotheticalRoll)
        ) {
          return true
        }
      }
    }

    return this.isValidMove(checker, roll)
  }

  play(checker, newPoint) {
    // remove die and update valid moves
    const idx = this.game.dice.findIndex(roll => roll === this._getRoll(checker, newPoint))
    this.game.dice.splice(idx, 1)

    if (newPoint.checkers.length > 1) {
      const otherChecker = newPoint.checkers[0]
      if (otherChecker.color !== checker.color) {
        console.error('*****')
      }
    }

    if (newPoint.checkers.length === 1) {
      const otherChecker = newPoint.checkers[0]
      if (otherChecker.color !== checker.color) {
        newPoint.checkers[0].gotHit()
      }
    }
    checker.point = newPoint
    checker.isPickedUp = false
    this.game.position.update()
  }

  update() {
    this.updateGrid()
    this.updateClosedPoints()
    this.updateValidMoves(this.game.activePlayer)
  }

  findPoint(i) {
    return this.grid.find(point => point.index === i)
  }

  findTargetPoint(roll, checker) {
    const increment = roll * (checker.color === BLACK ? 1 : -1)

    return this.game.position.findPoint(checker.point.index + increment)
  }

  updateGrid() {
    this.grid.forEach(point => point.updateCheckers())
  }

  updateClosedPoints() {
    this.grid.forEach(point => point.updateClosed())
  }

  updateValidMoves(player) {
    if (!player) return

    const hitCheckers = player.myCheckers.filter(checker => checker.point === checker.startPoint())
    const availableCheckers = hitCheckers.length ? hitCheckers : player.myCheckers

    this.validMoves = new Map(this.game.dice.map(roll => [
      roll, this._getPlayableCheckers(availableCheckers, player.myColor, roll)
    ]))

    // when bearing off and no moves available, try to find other available bearing off moves
    if (
      this.isBearingOff(player.myColor) &&
      Array.from(this.validMoves.values()).every(moves => !moves.length)
    ) {
      const bearOffDice = this.game.dice
        .sort((a, b) => b - a)
        .filter(roll => (
          availableCheckers.every(checker => this._isInBearOffPosition(checker, roll))
        ))

      if (!bearOffDice.length) return

      const playableCheckers = this._getPlayableCheckers(
        availableCheckers, player.myColor, bearOffDice[0], true
      )

      if (playableCheckers.length) {
        this.validMoves.set(bearOffDice[0], playableCheckers)
      } else {
        const playableCheckers = this._getPlayableCheckers(
          availableCheckers, player.myColor, bearOffDice[1], true
        )
        this.validMoves.set(bearOffDice[1], playableCheckers)
      }
    }
  }

  isValidMove(checker, roll) {
    if (!this.validMoves) return false
    if (!this.validMoves.get(roll)) return false

    return this.validMoves.get(roll).includes(checker)
  }

  isBearingOff(color) {
    return !this.game.checkers.filter(checker => checker.color === color).some(checker => (
      color === BLACK ? checker.point.index < 19 : checker.point.index > 6
    ))
  }

  getBearOffPoint(color) {
    return color === BLACK ? this.findPoint(25) : this.findPoint(0)
  }

  getBearOffPoints() {
    return [this.getBearOffPoint(BLACK), this.getBearOffPoint(WHITE)]
  }

  _isInBearOffPosition(checker, roll) {
    return checker.color === BLACK ? checker.point.index > roll : checker.point.index < roll
  }

  _getPlayableCheckers(availableCheckers, color, roll, mustBearOff = false) {
    let playableCheckers = availableCheckers.filter(checker => {
      const newPoint = this.findTargetPoint(roll, checker)

      if (mustBearOff) {
        return newPoint && (newPoint.index === 25 || newPoint.index === 0)
      }

      return (
        newPoint &&
        (newPoint.closed === color || newPoint.closed === false) &&
        (this.isBearingOff(color) || (newPoint.index !== 25 && newPoint.index !== 0))
      )
    })

    if (mustBearOff && !playableCheckers.length && this.isBearingOff(color) && roll > 1) {
      playableCheckers = this._getPlayableCheckers(availableCheckers, color, roll - 1, true)
    }

    return playableCheckers
  }

  _getRoll(checker, point) {
    return (checker.color === WHITE ? 1 : -1) * (checker.point.index - point.index)
  }
}
