class AI {
  constructor(game, player) {
    this.player = player
    this.game = game
  }

  play() {
    if (!this.player.hasRolledDice) {
      console.log('AI - Roll Dice')
      this.player.rollDice()

      return
    }

    const dice = this.player.getAvailableDice()
    const roll = random(dice.filter(roll => this.game.position.validMoves.get(roll).length))

    if (!roll) {
      console.log('AI - Skip Turn')
      this.player.skipTurn()

      return
    }

    const { checker } = random(this.game.position.validMoves.get(roll))

    this.player.pickup(checker)

    let newPoint = this.game.position.findTargetPoint(roll, checker)
    if (!newPoint) {
      newPoint = this.game.position.getBearOffPoint(checker.color)
    }

    this.player.play(newPoint)
  }
}
