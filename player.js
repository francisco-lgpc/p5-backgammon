class Player {
  constructor(game, color) {
    this.game = game
    this.moves = 0

    this.myColor = color
    this.oppColor = color === WHITE ? BLACK : WHITE

    this.myCheckers = this.game.checkers.filter(checker => checker.color === this.myColor)
    this.oppCheckers = this.game.checkers.filter(checker => checker.color === this.oppColor)
  }

  resetMoves() {
    this.moves = 2
  }

  pickup(checker) {
    if (!this._pickupIsValid(checker)) {
      console.log('cannot pickup this checker')
      return
    }

    this.checker = checker
    this.checker.isPickedUp = true
  }

  releaseChecker() {
    if (!this.checker) return

    this.checker.isPickedUp = false
    this.checker = undefined
  }

  play(point) {
    if (this.moves === 0) {
      console.log('no moves')
      return
    }

    if (!this.checker) {
      console.log('cannot play without picking up a checker')
      return
    }

    if (!this.game.position.canPlay(this.checker, point)) {
      console.log('play is not valid')
      return
    }

    this.game.position.play(this.checker, point)
    this.checker = undefined
    this.moves--
  }

  noValidMoves() {
    return !this.game.dice.some(roll => this.game.position.validMoves.get(roll).length)
  }

  skipTurn() {
    if (!this.noValidMoves()) {
      console.log('cannot skip turn when valid moves are available')
      return
    }

    console.log('skipping turn')

    this.moves = 0
  }

  _pickupIsValid(checker) {
    return this.game.dice.some(roll => this.game.position.isValidMove(checker, roll))
  }
}
