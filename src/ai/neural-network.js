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
  predict(inputArray) {
    return tf.tidy(() => {
      const xs = tf.tensor([inputArray])
      const ys = this.model.predict(xs)
      const yValues = ys.dataSync()
      return yValues
    })
  }

  static createModel() {
    const model = tf.sequential()
    const hidden = tf.layers.dense({
      inputShape: [INPUTS],
      units: HIDDEN,
      activation: 'sigmoid'
    })
    const output = tf.layers.dense({
      units: OUTPUTS,
      activation: 'softmax'
    })
    model.add(hidden)
    model.add(output)
    return model
  }

  // Adding function for neuro-evolution
  copy() {
    return tf.tidy(() => {
      const modelCopy = NeuralNetwork.createModel()
      const w = this.model.getWeights()
      for (let i = 0; i < w.length; i++) {
        w[i] = w[i].clone()
      }
      modelCopy.setWeights(w)
      const nn = new NeuralNetwork(modelCopy)
      return nn
    })
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    tf.tidy(() => {
      const w = this.model.getWeights()
      for (let i = 0; i < w.length; i++) {
        const shape = w[i].shape
        const arr = w[i].dataSync().slice()
        for (let j = 0; j < arr.length; j++) {
          arr[j] = func(arr[j])
        }
        const newW = tf.tensor(arr, shape)
        w[i] = newW
      }
      this.model.setWeights(w)
    })
  }
}
