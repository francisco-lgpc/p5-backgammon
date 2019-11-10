const MUTATION_RATE = 0.1
const POPULATION_SIZE = 64

class Individual extends NeuralNetwork {
  constructor(nn) {
    super(nn)

    this.score = 0
    this.fitness = undefined
  }
}

class GeneticAlgorithm {
  constructor() {
    this.generation = 1
    this.currPopulation = []
    this.nextPopulation = this.generateInitialPopulation()
  }

  // Create the next generation
  nextGeneration() {
    this.currPopulation = this.nextPopulation.slice()

    this.calculateFitness()

    this.generateNewPopulation()

    this.generation++
  }

  generateInitialPopulation() {
    return Array(POPULATION_SIZE).fill().map(() => new Individual())
  }

  generateNewPopulation() {
    this.nextPopulation = this.currPopulation.map(() => this.poolSelection(this.currPopulation))
  }

  calculateFitness() {
    const tournament = new Tournament(this.currPopulation)
    tournament.start()

    // set fitness as a normalized score

    const sum = this.currPopulation.reduce((sum, individual) => sum + individual.score, 0)

    this.currPopulation.forEach(individual => {
      individual.fitness = individual.score / sum
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
