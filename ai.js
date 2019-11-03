class AI {
  constructor(player) {
    this.player = player
  }

  play() {
    const roll = random(dice.filter(roll => position.validMoves.get(roll).length))

    if (!roll) {
      this.player.skipTurn()

      return
    }

    const checker = random(position.validMoves.get(roll))

    this.player.pickup(checker)

    let newPoint = position.findTargetPoint(roll, checker)
    if (!newPoint) {
      newPoint = position.getBearOffPoint(checker.color)
    }

    this.player.play(newPoint)
  }
}
