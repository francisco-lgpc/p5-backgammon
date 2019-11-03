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

    const newPoint = position.findTargetPoint(roll, checker)

    this.player.play(newPoint)
  }
}
