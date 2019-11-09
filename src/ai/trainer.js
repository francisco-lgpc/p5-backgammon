class Trainer {
  constructor() {
    this.ga = new GeneticAlgorithm()
  }

  train() {
    this.ga.nextGeneration()
    console.log(this.ga.currPopulation)
    console.log(this.ga.nextPopulation)
  }
}
