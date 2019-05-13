
namespace AnimationFrame {

}

class KeyboardSubscription<T> {
  constructor (readonly fn: (ev: KeyboardEvent) => T) {}
}
export type Subscription<T> = KeyboardSubscription<T>

export namespace Subscription {
  const keyDown = <T>(fn: (ev: KeyboardEvent) => T): Subscription<T> =>
    new KeyboardSubscription(fn)
}

type App<Model, Event> = {
  initial: Model,
  update: (_:Model, ev: Event) => Model,
  tick: (_:Model, delta: number) => Model,
  view: (_:Model, ctx: CanvasRenderingContext2D) => void,
  subscriptions: (_:Model) => Array<Subscription<Event>>
  /*
  onClick? : (ev: MouseEvent) => Event | null,
  onKeyDown? : (ev: KeyboardEvent) => Event | null,
  onKeyUp? : (ev: KeyboardEvent) => Event | null,
  onKeyPress? : (ev: KeyboardEvent) => Event | null
  */
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

const setupCanvas = (id: string, width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.getElementById(id) as HTMLCanvasElement
  const scale = window.devicePixelRatio
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  canvas.width = width * scale
  canvas.height = height * scale

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

const loop = (fn: (_: number) => void) => {
  const start = performance.now()
  loopInternal(fn, start)
}
