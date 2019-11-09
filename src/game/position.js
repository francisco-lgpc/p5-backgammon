class Position {
  constructor(game, grid) {
    this.game = game
    this.grid = grid
    this.updateClosedPoints()

    this.validMoves = undefined
  }

  canPlay(checker, newPoint) {
    return !!Array.from(this.validMoves.values())
      .flat()
      .find(move => checker === move.checker && newPoint === move.point)
  }

  play(checker, newPoint) {
    const roll = this._getRoll(checker, newPoint)
    const playerDie = this.game.activePlayer.dice.find(die => !die.played && die.roll === roll)
    playerDie.played = true

    if (newPoint.checkers.length > 1) {
      const otherChecker = newPoint.checkers[0]
      if (otherChecker.color !== checker.color && !newPoint.isBearOffPoint) {
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

    const dice = player.getAvailableDice()

    const hitCheckers = player.myCheckers.filter(checker => checker.point === checker.startPoint())
    const availableCheckers = hitCheckers.length ? hitCheckers : player.myCheckers

    this.validMoves = new Map(dice.map(roll => [
      roll, this._getPlayableCheckers(availableCheckers, player.myColor, roll)
    ]))

    // when bearing off and no moves available, try to find other available bearing off moves
    if (
      this.isBearingOff(player.myColor) &&
      Array.from(this.validMoves.values()).every(moves => !moves.length)
    ) {
      const bearOffDice = dice
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

    return !!this.validMoves.get(roll).find(move => move.checker === checker)
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
    let playableCheckers = availableCheckers
      .map(checker => ({ checker, point: this.findTargetPoint(roll, checker) }))
      .filter(({ point }) => {
        if (!point) return false

        if (mustBearOff) {
          return point === this.getBearOffPoint(color)
        }

        if (this.isBearingOff(color) && point === this.getBearOffPoint(color)) {
          return true
        }

        return (
          (point.closed === color || point.closed === false) &&
          !this.getBearOffPoints().includes(point)
        )
      })

    if (mustBearOff && !playableCheckers.length && this.isBearingOff(color) && roll > 1) {
      playableCheckers = this._getPlayableCheckers(availableCheckers, color, roll - 1, true)
    }

    return playableCheckers
  }

  _getRoll(checker, point) {
    const found = Array.from(this.validMoves).find(([_roll, moves]) => {
      return moves.find(move => move.checker === checker && move.point === point)
    })

    return found && found[0]
  }
}
