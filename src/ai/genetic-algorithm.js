const MUTATION_RATE = 0.1
const POPULATION_SIZE = 3

class Individual extends NeuralNetwork {
  constructor(nn) {
    super(nn)

    this.score = 0
    this.fitness = undefined
  }
}

function rr(arr) {
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

class GeneticAlgorithm {
  constructor() {
    this.currPopulation = []
    this.nextPopulation = this.generateInitialPopulation()
  }

  // Create the next generation
  nextGeneration() {
    this.currPopulation = this.nextPopulation.slice()

    this.calculateFitness()

    this.generateNewPopulation()

    this.currPopulation.forEach(player => player.dispose())
  }

  generateInitialPopulation() {
    return Array(POPULATION_SIZE).fill().map(() => new Individual())
  }

  generateNewPopulation() {
    this.nextPopulation = this.currPopulation.map(() => this.poolSelection(this.currPopulation))
  }

  calculateFitness() {
    rr(this.currPopulation).forEach(round => {
      round.forEach(([individual1, individual2]) => {
        const game = new Game()

        const ai1 = new NeuralNetworkAI(game, game.player1, individual1)
        const ai2 = new NeuralNetworkAI(game, game.player2, individual2)

        // let color = 0
        // let count = 0

        while (!game.isOver()) {
          // count++
          // if (count % 100 === 0) {
          //   debugger
          // }
          const activeAI = ai1.player === game.activePlayer ? ai1 : ai2

          activeAI.play()

          // if (count > 10) {
          //   debugger
          // }

          // if (color === game.activePlayer.myColor) {
          //   count++
          // } else {
          //   color = game.activePlayer.myColor
          //   count = 0
          // }

          if (game.activePlayer.isTurnOver()) {
            game.newTurn()
          }
        }

        const result = game.getResult()

        individual1.score += result.player1
        individual2.score += result.player2
      })
    })

    // set fitness as a normalized score

    this.currPopulation.forEach(individual => {
      individual.fitness = pow(individual.score, 2)
    })

    const sum = this.currPopulation.reduce((sum, individual) => sum + individual.fitness, 0)

    this.currPopulation.forEach(individual => {
      individual.fitness = individual.fitness / sum
    })
  }

  // An algorithm for picking one player from an array
  // based on fitness
  poolSelection(pool) {
    // Start at -1 so that ater the first iteration index will be 0
    let index = -1

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    for (let r = random(1); r > 0; r -= pool[index].fitness) {
      index += 1
    }

    const nn = this.mutate(pool[index])

    return new Individual(nn)
  }

  mutate(nn) {
    const nnCopy = nn.copy()

    nnCopy.mutate(weight => {
      if (random(1) < MUTATION_RATE) {
        const offset = randomGaussian() * 0.5
        return weight + offset
      } else {
        return weight
      }
    })

    return nnCopy
  }
}
