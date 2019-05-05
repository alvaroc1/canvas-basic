import { loop, setupCanvas } from './util'

type App<Model, Event> = {
  initial: Model,
  update: (_:Model, ev: Event) => Model,
  tick: (_:Model, delta: number) => Model,
  view: (_:Model, ctx: CanvasRenderingContext2D) => void,
  onClick? : (ev: MouseEvent) => Event | null,
  onKeyDown? : (ev: KeyboardEvent) => Event | null,
  onKeyUp? : (ev: KeyboardEvent) => Event | null,
  onKeyPress? : (ev: KeyboardEvent) => Event | null
}

export const runApp = <Model, Event> (
  id: string,
  width: number,
  height: number,
  app: App<Model, Event>
) => {
  const [canvas, ctx] = setupCanvas("game", 300, 300)

  const start = performance.now()
  app.view(app.initial, ctx)
  let lastRender = start
  let currentModel = app.initial
  let queuedEvents: Event[] = []
  
  if (app.onClick) {
    canvas.addEventListener("click", ev => {
      queuedEvents.push(app.onClick(ev))
    })
  }
  if (app.onKeyDown) {
    canvas.addEventListener("keydown", ev => {
      if (!ev.repeat) {
        const x = app.onKeyDown(ev)
        if (x) queuedEvents.push(x)
      }
    })
  }
  if (app.onKeyUp) {
    canvas.addEventListener("keyup", ev => {
      if (!ev.repeat) {
        const x = app.onKeyUp(ev)
        if (x) queuedEvents.push(x)
      }
    })
  }
  if (app.onKeyPress) {
    canvas.addEventListener("keypress", ev => {
      const x = app.onKeyPress(ev)
      if (x) queuedEvents.push(x)
    })
  }

  const draw = (_: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    while (queuedEvents.length > 0) {
      let ev = queuedEvents.pop()
      currentModel = app.update(currentModel, ev)
    }

    currentModel = app.tick(currentModel, performance.now() - lastRender)
    
    app.view(currentModel, ctx)
    lastRender = performance.now()
  }

  loop(draw)
}

export default runApp
