const GROUP_SIZE = 4

class Tournament {
  static rr(arr) {
    let ps = arr.slice()

    let n = ps.length

    const dummy = -1

    var rs = [] // rs = round array
    if (!ps) {
      ps = []
      for (var k = 1; k <= n; k += 1) {
        ps.push(k)
      }
    } else {
      ps = ps.slice()
    }

    if (n % 2 === 1) {
      ps.push(dummy) // so we can match algorithm for even numbers
      n += 1
    }

    for (var j = 0; j < n - 1; j += 1) {
      rs[j] = [] // create inner match array for round j
      for (var i = 0; i < n / 2; i += 1) {
        if (ps[i] !== dummy && ps[n - 1 - i] !== dummy) {
          rs[j].push([ps[i], ps[n - 1 - i]]) // insert pair as a match
        }
      }
      ps.splice(1, 0, ps.pop()) // permutate for next round
    }

    return rs
  };

  static match(individual1, individual2) {
    const game = new Game()

    const ai1 = new NeuralNetworkAI(game, game.player1, individual1)
    const ai2 = new NeuralNetworkAI(game, game.player2, individual2)

    while (!game.isOver()) {
      const activeAI = ai1.player === game.activePlayer ? ai1 : ai2

      activeAI.play()

      if (game.activePlayer.isTurnOver()) {
        game.newTurn()
      }
    }

    return game.getResult()
  }

  static run(population, roundNum = 1) {
    // console.log({ roundNum })

    if (population.length === 1) {
      population[0].score += Math.exp(roundNum)
      return
    }

    const all = population.slice()

    const groups = []

    while (all.length) {
      groups.push(all.splice(0, GROUP_SIZE))
    }

    groups.forEach(group => {
      this.rr(group).forEach(round => {
        round.forEach(([individual1, individual2]) => {
          const result = this.match(individual1, individual2)

          individual1.score += result.player1 * Math.exp(roundNum)
          individual2.score += result.player2 * Math.exp(roundNum)
        })
      })
    })

    this.run(groups.map(group => group.sort((a, b) => a.score - b.score)[0]), roundNum + 1)
  }

  constructor(population) {
    this.population = population
  }

  start() {
    Tournament.run(this.population)
  }
}
