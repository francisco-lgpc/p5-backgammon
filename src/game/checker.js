class Checker {
  constructor(game, color, point) {
    this.game = game
    this.color = color
    this.point = point
    this.isPickedUp = false
  }

  show(heightIdx) {
    stroke(150)
    strokeWeight(3)
    fill(this.color * 255)
    let x = (this.point.index - 0.5) * unitW
    let y = (heightIdx + 0.5) * unitW

    if (this.point === this.startPoint()) {
      x = 100 + heightIdx * 5
      y = height / 2
      Logger.log('start')
    }

    if (this.point.index >= 13) {
      x = width - (x % width)
      y = height - y
    }

    if (this.isPickedUp) {
      stroke(255, 100, 51)
    }

    ellipse(x, y, unitW)
  }

  startPoint() {
    return this.color === BLACK ? this.game.position.findPoint(0) : this.game.position.findPoint(25)
  }

  gotHit() {
    this.point = this.startPoint()
    Logger.log('hit', this.color)
  }
}
