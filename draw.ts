
export const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = "white"
  ctx.beginPath()
  ctx.arc(x,      y, 20, 0, 2 * Math.PI)
  ctx.arc(x + 30, y, 30, 0, 2 * Math.PI)
  ctx.arc(x + 60, y, 20, 0, 2 * Math.PI)
  ctx.fill()
}

const faceFill = new Path2D(
  "M 16.8 2.95 C 9.23 2.95 3.12 8.88 3.12 16.2 C 3.12 18 3.51 19.7 4.2 21.3 C 4.54 22.1 4.96 22.9 5.45 23.6 C 5.94 24.3 6.37 24.8 6.74 25.2 L 6.74 25.2 C 6.68 25.3 6.64 25.4 6.63 25.5 C 6.6 25.9 7.15 26.1 7.81 26.1 C 8.53 26.6 10.6 28 11.5 28.4 C 13.1 29 14.9 29.4 16.8 29.4 C 24.3 29.4 30.4 23.5 30.4 16.2 C 30.4 8.88 24.3 2.95 16.8 2.95 z"
)

const facePath = new Path2D(
  "M 6.93,25.2 C 6.56,24.8 6.13,24.3 5.64,23.6 5.15,22.9 4.73,22.1 4.39,21.3 3.7,19.7 3.31,18 3.31,16.2 3.31,8.87 9.42,2.97 17,2.97 c 7.5,0 13.6,5.9 13.6,13.23 0,7.3 -6.1,13.2 -13.6,13.2 -1.9,0 -3.7,-0.4 -5.3,-1 C 10.8,28 8.71,26.6 7.99,26.1 M 17,16 c -1.5,-1.9 -3.1,-3.3 -4.7,-4.3 l 0,0 m -9.04,3.4 c 1.16,-1.3 2.51,-2.6 4.38,-3.9 m 5.26,6.2 c -0.2,0.4 -0.7,0.6 -1,0.5 -0.3,-0.2 -0.4,-0.6 -0.2,-1.1 0.2,-0.4 0.7,-0.7 1,-0.5 0.3,0.1 0.4,0.6 0.2,1.1 z M 6.13,17.1 c -0.28,0.4 -0.7,0.6 -0.95,0.4 -0.25,-0.2 -0.23,-0.7 0,-1 0.28,-0.4 0.71,-0.6 0.96,-0.4 0.25,0.1 0.23,0.6 0,1 z m 4.07,2.2 c 0,0 0.2,-2.5 -1.87,-2.7 -1.03,-0.1 -2.38,1.1 -2.1,2 0.54,1.9 2.63,1.7 2.63,1.7 M 10.2,26 c 0,0 -3.46,0.5 -3.38,-0.5 0.11,-1.4 4.08,-0.4 4.08,-0.4 -0.96,-0.6 -1.81,-1.3 -3.15,-1.4 -0.2,-1 -0.2,-2.2 0.34,-3.4 M 24.4,19.1 c 0,0 2.6,-4.5 4.6,-3.7 2.7,1.1 -0.1,5.6 -2.1,7.1 -2,1.6 -3,-0.7 -3,-0.7 M 15.3,3.77 16,3.87 m 0.4,0.7 0.7,0.3 m 0.4,-0.8 0.9,0.2 m 0.2,0.7 0.6,0.3 m 1,-1.3 0.7,0.2 m -0.4,1.5 0.7,0.3 m 0,0.9 0.6,0.6 m 0.8,-0.6 0.6,0.7 m 0.9,-1.1 0.7,0.3 m -0.9,1.9 0.3,0.5 m 2.4,-1.3 0.5,0.5 m -2.8,2.53 0.4,0.8 m 1.2,-0.3 0.5,0.8 m 0.8,-2.43 0.6,0.63 m 0.8,2.3 0.5,0.8"
)

export const drawCharacter = (ctx: CanvasRenderingContext2D, x: number, heightPos: number) => {
  ctx.fillStyle = "blue"
  ctx.fillRect(x, 220 - heightPos, 20, 30)
  ctx.fillStyle = "tan"
  ctx.beginPath()
  //ctx.arc(x + 10, 210 - heightPos, 10, 0, 2 * Math.PI)
  ctx.fill()
  ctx.strokeStyle = "black"
  ctx.stroke()

  //drawFace(ctx, x, 210 - heightPos)

  const cx = 135
  const cy = 190 - heightPos
  ctx.translate(cx, cy)
  ctx.fill(faceFill)
  ctx.stroke(facePath)
  ctx.translate(-cx, -cy)
  //ctx.fill(facePath)
}

const drawFace = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.strokeStyle = "black"
  ctx.moveTo(50, 50)
  ctx.quadraticCurveTo(100, 0, 100, 50)
  ctx.stroke()
}
