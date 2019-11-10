class Trainer {
  constructor() {
    this.ga = new GeneticAlgorithm()
  }

  train(n = 1) {
    for (let i = 0; i < n; i++) {
      this.ga.nextGeneration()
      console.log(this.ga.currPopulation)
      console.log(this.ga.nextPopulation)
    }
  }
}
