const NUM_CHECKERS_PER_PLAYER = 15

class NeuralNetworkAI {
  constructor(game, player, nn) {
    this.game = game
    this.player = player

    this.nn = nn
  }

  play() {
    if (!this.player.hasRolledDice) {
      console.log('AI - Roll Dice')
      this.player.rollDice()

      return
    }

    if (this.player.noValidMoves()) {
      console.log('AI - Skip Turn')
      this.player.skipTurn()

      return
    }

    // Now create the inputs to the neural network
    const inputs = []

    const dice = this.player.getAvailableDice()

    let idx = 0

    this.game.position.grid.forEach(point => {
      let numMine = 0
      let numOpp = 0
      point.checkers.forEach(checker => {
        if (checker.color === this.player.myColor) numMine += 1
        if (checker.color === this.player.oppColor) numOpp += 1
      })
      inputs[idx] = map(numMine, 0, NUM_CHECKERS_PER_PLAYER, 0, 1)
      inputs[idx + 1] = map(numOpp, 0, NUM_CHECKERS_PER_PLAYER, 0, 1)

      idx += 2
    })

    // dice inputs
    for (let diceIdx = 0; diceIdx < 4; diceIdx++) {
      for (let i = 0; i < 6; i++) {
        inputs[idx] = dice[diceIdx] === i ? 1 : 0
        idx += 1
      }
    }

    // Get the outputs from the network
    const action = this.nn.predict(inputs)

    const pointToPlayPriority = Array.from(action.slice(0, 26))
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value)
      .map(({ index }) => this.game.position.findPoint(index))

    const dieToPlayPriority = Array.from(action.slice(26, 30))
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value)
      .map(({ index }) => dice[index])

    let move

    dieToPlayPriority.find(roll => {
      if (!roll) return false

      const validMoves = this.game.position.validMoves.get(roll)

      if (!validMoves.length) return

      return pointToPlayPriority.find(point => {
        move = validMoves.find(move => move.point === point)

        return move
      })
    })

    this.player.pickup(move.checker)
    this.player.play(move.point)
  }
}
