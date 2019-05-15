import { runApp, Subscription } from './app'

type Event = "tick"

const update = (model: boolean, ev: "tick") => {
  return model
}

const view = (model: boolean, ctx: CanvasRenderingContext2D): void => {
  ctx.fillRect(0, 0, 20, 20)
}

const subscriptions = (model: boolean): Array<Subscription<Event>> => []

runApp <boolean,Event>(
  "game",
  300,
  300,
  {
    initial: true,
    update: update,
    tick: (x, v) => true,
    view: view,
    subscriptions: subscriptions
  }
)