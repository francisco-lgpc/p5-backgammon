let unitW
let unitH

let game

let trainer
let ai

let diceImages
function preload() {
  diceImages = Array(6).fill().map((_, i) => loadImage(`assets/images/dice/${i + 1}.png`))
}

function setup() {
  createCanvas(750, 930)
  background(0)
  const hitAreaGap = height / 7
  unitW = width / 12
  unitH = (height / 2) - (hitAreaGap / 2)

  game = new Game()
  frameRate(1)

  drawBoard()
  game.show()

  trainer = new Trainer()
}

function draw() {
  if (game.isOver()) {
    Logger.log(game.getResult())

    return
  }

  if (ai && ai.player === game.activePlayer) {
    this.playWithAI()
    drawBoard()
    game.show()
  }

  // if (!trainer.isTraining) {
  //   trainer.train()
  // }
}

function drawBoard() {
  background(0)
  noStroke(255)

  for (let i = 0; i < 12; i++) {
    const x1 = unitW * i
    const x2 = unitW * (i + 0.5)
    const x3 = unitW * (i + 1.0)

    fill(i % 2 === 0 ? 200 : 100)
    let y1 = 0
    let y2 = unitH
    let y3 = 0
    triangle(x1, y1, x2, y2, x3, y3)

    fill(i % 2 === 0 ? 100 : 200)
    y1 = height - y1
    y2 = height - y2
    y3 = height - y3
    triangle(x1, y1, x2, y2, x3, y3)
  }
}

function keyPressed() {
  switch (keyCode) {
    case 13:
      game.activePlayer.skipTurn()
      if (game.activePlayer.isTurnOver()) {
        game.newTurn()
      }
      drawBoard()
      game.show()

      break

    case 32:
      game.activePlayer.rollDice()
      drawBoard()
      game.show()
      break

    case 65: {
      ai = new NeuralNetworkAI(game, game.player2, trainer.best)

      break
    }

    case 27:
      game.activePlayer.releaseChecker()
      drawBoard()
      game.show()

      break

    case 80:
      noLoop()
      break
    case 84:
      trainer.train()
      break

    case 83:
      tf.loadLayersModel('assets/model/player-nn.json').then(model => {
        ai = new NeuralNetworkAI(game, game.player2, new NeuralNetwork(model))
      })
      break

    default:
      break
  }
}

function playWithAI() {
  ai.play()

  if (ai.player.isTurnOver()) {
    game.newTurn()
  }
}

function isInHitArea(x, y) {
  return y > unitH && y < height - unitH
}

function getPointIndex(x, y) {
  if (isInHitArea(x, y)) {
    return x < width / 2 ? 0 : 25
  }

  const n = floor(x / unitW) + 1
  return y < height / 2 ? n : 25 - n
}

function getPoint(index) {
  return game.position.grid.find(point => point.index === index)
}

function mousePressed({ x, y }) {
  const index = getPointIndex(x, y)
  const point = getPoint(index)

  if (game.activePlayer.checker) {
    game.activePlayer.play(point)

    if (game.activePlayer.isTurnOver()) {
      game.newTurn()
    }
  } else {
    game.activePlayer.pickup(point.checkers[point.checkers.length - 1])
  }

  drawBoard()
  game.show()
}
