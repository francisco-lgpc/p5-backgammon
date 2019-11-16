const MUTATION_RATE = 0.1
const POPULATION_SIZE = 64

class Individual extends NeuralNetwork {
  constructor(nn) {
    super(nn)

    this.score = 0
    this.fitness = undefined
  }

  copy() {
    return new Individual(super.copy())
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
    this.nextPopulation = this.currPopulation.map(() => {
      const child = this.crossover(
        this.poolSelection(this.currPopulation),
        this.poolSelection(this.currPopulation)
      )

      return this.mutate(child)
    })
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

  poolSelection(pool) {
    // Start at -1 so that ater the first iteration index will be 0
    let index = -1

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    for (let r = random(1); r > 0; r -= pool[index].fitness) {
      index += 1
    }

    return pool[index]
  }

  crossover(dominantParent, parent2) {
    // initialize child as a copy of dominant parent
    const child = dominantParent.copy()

    // the probability of each weight remaining the same
    const dominantParentProb = random(0.7, 1)

    // randomly set some weights to the weight of the other parent
    const parent2Weights = parent2.getFlatWeights()
    child.mutate((weight, i) => random() <= dominantParentProb ? weight : parent2Weights[i])

    return child
  }

  mutate(ind) {
    const indCopy = ind.copy()

    indCopy.mutate(weight => {
      if (random() >= MUTATION_RATE) return weight

      return weight + randomGaussian() * 0.5
    })

    return indCopy
  }
}
