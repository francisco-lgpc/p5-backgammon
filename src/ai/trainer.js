let BREAK

class Trainer {
  constructor() {
    this.ga = new GeneticAlgorithm()
    this.isTraining = false
  }

  train(n = 1) {
    this.isTraining = true

    for (let i = 0; i < n; i++) {
      this.ga.nextGeneration()
      console.log(this.ga.currPopulation)
      console.log(this.ga.nextPopulation)

      this.best = this.ga.currPopulation.sort((a, b) => a.fitness - b.fitness)[0]

      this.ga.currPopulation.forEach(ind => ind !== this.best && ind.dispose())
    }

    this.isTraining = false

    this.best.save(`generation_${this.ga.generation}`)
  }
}
