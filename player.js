class Player {
  constructor(color) {
    this.moves = 0

    this.myColor  = color;
		this.oppColor = color === WHITE ? BLACK : WHITE;
		this.myCheckers  = checkers.filter(checker => checker.color === this.myColor)
		this.oppCheckers = checkers.filter(checker => checker.color === this.oppColor)
  }

  newTurn() {
    this.moves = 2
  }

  pickup(checker) {
    if (!this._pickupIsValid(checker)) {
      console.log('cannot pickup this checker')
      return
    }

    this.checker = checker
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

    if (!this._playIsValid(point)) {
      console.log('play is not valid')
      return
    }

    position.play(this.checker, point)
    this.checker = undefined
    this.moves--
  }

  _pickupIsValid(checker) {
    return dice.some(die => (
      position.getPlayableCheckers(this.myColor, die).some(_checker => _checker === checker)
    ))
  }

  _playIsValid(point) {
    return dice.some(die => die === this.checker.point.index - point.index)
  }
}