class Game {
  constructor() {
    this.dice = Array(2).fill()
    this.checkers = []

    const grid = Array(26).fill().map((_, i) => new Point(this, i, []))
    this.position = new Position(this, grid)
    this._createStartingPosition()

    this.player1 = new Player(this, WHITE)
    this.player2 = new Player(this, BLACK)
    this.activePlayer = this.player1

    this.newTurn()
  }

  rollDice() {
    this.dice[0] = int(random(1, 7))
    this.dice[1] = int(random(1, 7))
  }

  newTurn() {
    this.activePlayer.endTurn()
    this.activePlayer = this.activePlayer === this.player1 ? this.player2 : this.player1
    this._resetDice()
  }

  show() {
    this._showCheckers()
    this._showDice()
  }

  _createCheckers(i, n) {
    for (let _n = 0; _n < n; _n++) {
      let point = this.position.findPoint(i)
      let checker = new Checker(this, BLACK, point)
      this.checkers.push(checker)
      this.position.grid[i].checkers.push(checker)

      point = this.position.findPoint(25 - i)
      checker = new Checker(this, WHITE, point)
      this.checkers.push(checker)
      this.position.grid[25 - i].checkers.push(checker)
    }
  }

  _createStartingPosition() {
    this._createCheckers(1, 2)
    this._createCheckers(12, 5)
    this._createCheckers(17, 3)
    this._createCheckers(19, 5)
    this.position.update()
  }

  _resetDice() {
    this.dice[0] = undefined
    this.dice[1] = undefined
  }

  _showCheckers() {
    this.position.grid.forEach((point) => {
      point.checkers.forEach((checker, i) => {
        checker.show(i)
      })
    })
  }

  _showDie(die, xPos) {
    die && image(diceImages[die - 1], xPos, height / 2, DICE_SIZE, DICE_SIZE)
  }

  _showDice() {
    imageMode(CENTER)

    this._showDie(this.dice[0], width / 2 - DICE_SIZE)
    this._showDie(this.dice[1], width / 2 + DICE_SIZE)
  }
}
