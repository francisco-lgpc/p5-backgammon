class Player {
  constructor(color) {
    this.moves = 0

    this.myColor  = color;
		this.oppColor = color === WHITE ? BLACK : WHITE;
		this.myCheckers  = checkers.filter(checker => checker.color === this.myColor)
		this.oppCheckers = checkers.filter(checker => checker.color === this.oppColor)
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

    if (!position.canPlay(this.checker, point)) {
      console.log('play is not valid')
      return
    }

    position.play(this.checker, point)
    this.checker = undefined
    this.moves--
  }

  _pickupIsValid(checker) {
    return dice.some(roll => position.isValidMove(checker, roll))
  }
}