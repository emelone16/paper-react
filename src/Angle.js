export class AngleArray {

  constructor(angles = []) {
    this.angles = angles
  }

  addLine = () => {
    this.angles.forEach(row => {
      row.push(null)
    })

    this.angles.push([null])
  }

  det = (a, b) => (a[0] * b[1]) - (a[1] * b[0])

  addAngle = (i1, i2, line1, line2) => {
    if (i1 >= i2) return

    let xDiff = [line1[0].x - line1[1].x, line2[0].x - line2[1].x]
    let yDiff = [line1[0].y - line1[1].y, line2[0].y - line2[1].y]
    let div = this.det(xDiff, yDiff)
    
    if (div === 0) return

    let d = [this.det([line1[0].x, line1[0].y], [line1[1].x, line1[1].y]), this.det([line2[0].x, line2[0].y], [line2[1].x, line2[1].y])]
    let position = {
      x: this.det(d, xDiff) / div,
      y: this.det(d, yDiff) / div
    }

    let angle = new AngleModel(position)
    this.angles[i1][i2] = angle
  }
}

class AngleModel {

  constructor(position, measurement = 0, active = false) {
    this.position = position
    this.measurement = measurement
    this.active = active
  }

}