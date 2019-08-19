import { AngleModel } from "./Angle"

export class AngleArrayUtility {
  static addLine = angles => {
    angles.forEach(row => {
      row.push(null)
    })
    let row = new Array(angles.length + 1)
    row = row.fill(undefined, 0)
    angles.push(row)
    return angles
  }

  static det = (a, b) => a[0] * b[1] - a[1] * b[0]

  static isInsideEndPoints = (point, line) => {
    var xRange = []
    var yRange = []
    if (line[0].x < line[1].x) {
      xRange = [line[0].x, line[1].x]
    } else {
      xRange = [line[1].x, line[0].x]
    }
    if (line[0].y < line[1].y) {
      yRange = [line[0].y, line[1].y]
    } else {
      yRange = [line[1].y, line[0].y]
    }
    return (
      point.x >= xRange[0] &&
      point.x <= xRange[1] &&
      point.y >= yRange[0] &&
      point.y <= yRange[1]
    )
  }

  static calculateAngle(A, B, C) {
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2))
    var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2))
    var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2))

    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB))
  }

  static addAngle = (line1, line2, prevAngle) => {
    let xDiff = [line1[0].x - line1[1].x, line2[0].x - line2[1].x]
    let yDiff = [line1[0].y - line1[1].y, line2[0].y - line2[1].y]
    let div = this.det(xDiff, yDiff)
    if (div === 0) {
      return null
    }
    let d = [
      this.det([line1[0].x, line1[0].y], [line1[1].x, line1[1].y]),
      this.det([line2[0].x, line2[0].y], [line2[1].x, line2[1].y])
    ]
    let position = {
      x: this.det(d, xDiff) / div,
      y: this.det(d, yDiff) / div
    }
    if (
      !this.isInsideEndPoints(position, line1) ||
      !this.isInsideEndPoints(position, line2)
    ) {
      return null
    }
    const measurement = this.calculateAngle(line1[0], position, line2[0])

    let angle = new AngleModel(position, measurement)

    if (prevAngle) {
      angle.complement = prevAngle.complement
      angle.active = prevAngle.active
    }

    return angle
  }

  static updateAngles = (angles, i, rulers) => {
    for (var j = 0; j < i; j++) {
      angles[j][i] = this.addAngle(
        rulers[j].position,
        rulers[i].position,
        angles[j][i]
      )
    }
    let row = angles[i]
    row.forEach((angle, j) => {
      if (angle !== undefined) {
        angles[i][j] = this.addAngle(
          rulers[i].position,
          rulers[j].position,
          angles[i][j]
        )
      }
    })
    return [...angles]
  }

  static toList = (angles, rulers) => {
    var list = []
    angles.forEach((row, i) => {
      row.forEach((angle, j) => {
        if (angle !== null && angle !== undefined) {
          list.push({
            angleModel: angle,
            line1: rulers[i].position,
            line2: rulers[j].position,
            i,
            j
          })
        }
      })
    })
    return list
  }
}
