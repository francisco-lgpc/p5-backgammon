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
      Logger.log('Dice Can only be rolled at the start of each turn')
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
      Logger.log('cannot pickup this checker')
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
    if (this.noValidMoves()) {
      debugger
    }

    if (!this.hasRolledDice) {
      Logger.log('please roll the dice')
    }

    if (this.dice.every(move => move.played)) {
      Logger.log('no dice')
      return
    }

    if (!this.checker) {
      Logger.log('cannot play without picking up a checker')
      return
    }

    if (!this.game.position.canPlay(this.checker, point)) {
      Logger.log('play is not valid')
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
      Logger.log('cannot skip turn when valid dice are available')
      return
    }

    Logger.log('skipping turn')

    this.dice.forEach(die => { die.played = true })
  }

  getState() {
    const indeces = this.myCheckers.map(checker => (
      this.myColor === BLACK ? checker.point.index : 25 - checker.point.index
    ))

    const min = Math.min(...indeces)

    if (min === 25) return STATES.BEARED_OFF
    if (min >= 19) return STATES.BEARING_OFF
    if (min > 6) return STATES.OUT_OPP_BOARD
    return STATES.IN_OPP_BOARD
  }

  _pickupIsValid(checker) {
    return this.getAvailableDice().some(roll => this.game.position.isValidMove(checker, roll))
  }

  _getInitialDice() {
    return this.game.dice.map(roll => ({ played: false, roll }))
  }
}
