export default function bindMouseChanges(item) {
  const onMouseEnter = item.onMouseEnter
  item.onMouseEnter = event => {
    if (onMouseEnter) onMouseEnter(event)
    if (document.body.style.cursor === "default") document.body.style.cursor = "grab"
  }
  const onMouseLeave = item.onMouseLeave
  item.onMouseLeave = event => {
    if (onMouseLeave) onMouseLeave(event)
    if (document.body.style.cursor === "grab") document.body.style.cursor = "default"
  }
  const onMouseUp = item.onMouseUp
  item.onMouseUp = event => {
    if (onMouseUp) onMouseUp(event)
    document.body.style.cursor = "grab"
  }
  const onMouseDown = item.onMouseDown
  item.onMouseDown = event => {
    if (onMouseDown) onMouseDown(event)
    document.body.style.cursor = "grabbing"
  }
}