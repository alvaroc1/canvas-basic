
/*
type KeyboardSubscription<T> = {
  "type": "keyboard",
  "event": "keyup"|"keydown"|"keypress",
  "callback": (ev: KeyboardEvent) => T
}
*/
class KeyboardSubscription<T> {
  readonly type: "keyboard" = "keyboard"
  constructor (
    readonly event: "keyup"|"keydown"|"keypress",
    readonly callback: (ev: KeyboardEvent) => T
  ) {}

  map = <X>(fn: (v: T) => X) => new KeyboardSubscription(
    this.event,
    ev => {
      const x = this.callback(ev)
      return x !== null ? fn(x) : null
    }
  )
  filter = (fn: (v: T) => Boolean) => new KeyboardSubscription(
    this.event,
    ev => {
      const x = this.callback(ev)
      return fn(x) ? x : null
    }
  )
}
export type Subscription<T> = KeyboardSubscription<T>

export namespace Subscription {

  export const keyDown = new KeyboardSubscription("keydown", ev => ev)

  export const keyUp = new KeyboardSubscription("keyup", ev => ev)

}

type App<Model, Event> = {
  initial: Model,
  update: (_:Model, ev: Event) => Model,
  tick: (_:Model, delta: number) => Model,
  view: (_:Model, ctx: CanvasRenderingContext2D) => void,
  subscriptions: (_:Model) => Array<Subscription<Event>>
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

  let subscriptions = app.subscriptions(app.initial)
  canvas.addEventListener("keydown", ev => {
    subscriptions.map(s => {
      if (s.type === "keyboard" && s.event === "keydown") {
        const x = s.callback(ev)
        if (x !== null) queuedEvents.push(s.callback(ev))
      }
    })
  })
  canvas.addEventListener("keyup", ev => {
    subscriptions.map(s => {
      if (s.type === "keyboard" && s.event === "keyup") {
        const x = s.callback(ev)
        if (x !== null) queuedEvents.push(x)
      }
    })
  })

  const draw = (_: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    while (queuedEvents.length > 0) {
      let ev = queuedEvents.pop()
      currentModel = app.update(currentModel, ev)
    }

    currentModel = app.tick(currentModel, performance.now() - lastRender)
    subscriptions = app.subscriptions(currentModel)
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
