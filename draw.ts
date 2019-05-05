
export const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = "white"
  ctx.beginPath()
  ctx.arc(x,      y, 20, 0, 2 * Math.PI)
  ctx.arc(x + 30, y, 30, 0, 2 * Math.PI)
  ctx.arc(x + 60, y, 20, 0, 2 * Math.PI)
  ctx.fill()
}

export const drawCharacter = (ctx: CanvasRenderingContext2D, x: number, heightPos: number) => {
  ctx.fillStyle = "blue"
  ctx.fillRect(x, 220 - heightPos, 20, 30)
}