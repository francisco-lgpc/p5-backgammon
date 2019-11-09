class Player {
  constructor(game, color) {
    this.game = game
    this.dice = []

    this.myColor = color
    this.oppColor = color === WHITE ? BLACK : WHITE

    this.myCheckers = this.game.checkers.filter(checker => checker.color === this.myColor)
    this.oppCheckers = this.game.checkers.filter(checker => checker.color === this.oppColor)

    this.hasRolledDice = false
  }

  endTurn() {
    this.dice = []
    this.hasRolledDice = false
  }

  isTurnOver() {
    return this.hasRolledDice && this.dice.every(die => die.played)
  }

  rollDice() {
    if (this.hasRolledDice) {
      console.log('Dice Can only be rolled at the start of each turn')
      return
    }

    this.game.rollDice()

    this.hasRolledDice = true

    if (this.game.dice[0] === this.game.dice[1]) {
      this.dice = [...this._getInitialDice(), ...this._getInitialDice()]
    } else {
      this.dice = this._getInitialDice()
    }

    this.game.position.updateValidMoves(this)
  }

  getAvailableDice() {
    return this.dice
      .filter(move => !move.played)
      .map(move => move.roll)
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
    if (!this.hasRolledDice) {
      console.log('please roll the dice')
    }

    if (this.dice.every(move => move.played)) {
      console.log('no dice')
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
  }

  noValidMoves() {
    return !this.getAvailableDice().some(roll => this.game.position.validMoves.get(roll).length)
  }

  skipTurn() {
    if (!this.noValidMoves()) {
      console.log('cannot skip turn when valid dice are available')
      return
    }

    console.log('skipping turn')

    this.dice.forEach(die => { die.played = true })
  }

  _pickupIsValid(checker) {
    return this.getAvailableDice().some(roll => this.game.position.isValidMove(checker, roll))
  }

  _getInitialDice() {
    return this.game.dice.map(roll => ({ played: false, roll }))
  }
}
