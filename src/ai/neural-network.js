// 26 white count in each point
// 26 black count in each point
// 24 for the dice (6 x 4)
const INPUTS = 76

// arbitrary
const HIDDEN = 60

// 26 for the point to play from
// 4 for the die
const OUTPUTS = 30

class NeuralNetwork {
  constructor(nn) {
    if (nn instanceof tf.Sequential) {
      this.model = nn
    } else {
      this.model = NeuralNetwork.createModel()
    }
  }

  dispose() {
    this.model.dispose()
  }

  save(name) {
    this.model.save(`downloads://player-nn-${name}`)
  }

  // Synchronous for now
  predict(inputs) {
    return tf.tidy(() => {
      const inputTensor = tf.tensor([inputs])
      const output = this.model.predict(inputTensor)

      return output.dataSync()
    })
  }

  static createModel() {
    const model = tf.sequential()
    const hidden1 = tf.layers.dense({
      inputShape: [INPUTS],
      units: HIDDEN,
      activation: 'sigmoid',
      useBias: true
    })
    const output = tf.layers.dense({
      units: OUTPUTS,
      activation: 'sigmoid',
      useBias: true
    })
    model.add(hidden1)
    model.add(output)
    return model
  }

  // Adding function for neuro-evolution
  copy() {
    return tf.tidy(() => {
      const modelCopy = NeuralNetwork.createModel()

      const weights = this.model.getWeights()

      const newWeights = weights.map(weight => weight.clone())

      modelCopy.setWeights(newWeights)

      return new NeuralNetwork(modelCopy)
    })
  }

  // Accept an arbitrary function for mutation
  mutate(mutationFunc) {
    tf.tidy(() => {
      const weights = this.model.getWeights()

      const newWeights = weights.map(weight => {
        const shape = weight.shape
        const values = weight.dataSync().slice()

        const newValues = values.map(mutationFunc)

        return tf.tensor(newValues, shape)
      })

      this.model.setWeights(newWeights)
    })
  }

  // Flat array of all weights
  getFlatWeights() {
    return tf.tidy(() => {
      return this.model.getWeights().flatMap(weight => weight.dataSync().slice())
    })
  }
}
