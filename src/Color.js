export class ColorModel {
  constructor(
    base = "red",
    unselected = "rgba(255, 0, 0, 0.20)",
    selected = "rgba(255, 0, 0, 0.50)"
  ) {
    this.base = base
    this.unselected = unselected
    this.selected = selected
  }
}
