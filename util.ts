
export const setupCanvas = (id: string, width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.getElementById(id) as HTMLCanvasElement
  const scale = window.devicePixelRatio
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  canvas.width = width * scale
  canvas.height = height * scale

  /*
  canvas.addEventListener("click", () => {
    canvas.webkitRequestFullScreen()

    console.log("test")
  })
  */

  const ctx = canvas.getContext("2d")
  ctx.scale(scale, scale)
  return [canvas, ctx]
}

const loopInternal = (fn: (_: number) => void, start: number) => {
  window.requestAnimationFrame(ts => {
    fn(Math.round(ts - start))
    loopInternal(fn, start)
  })
}

export const loop = (fn: (_: number) => void) => {
  const start = performance.now()
  loopInternal(fn, start)
}
