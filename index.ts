import { runApp, Subscription } from './app'

type Event = "tick"

const update = (model: number, ev: "tick") => {
  return model + 1
}

const view = (model: number, ctx: CanvasRenderingContext2D): void => {
  ctx.fillRect(model, 0, 20, 20)
}

const subscriptions = (model: number): Array<Subscription<Event>> => [
  Subscription.keyUp.map<"tick">(_ => "tick"),
  Subscription.animationFrame.map<"tick">(_ => "tick")
]

const initial = 4

runApp <number,Event>(
  "game",
  300,
  300,
  {
    initial: initial,
    update: update,
    tick: (x, v) => x,
    view: view,
    subscriptions: subscriptions
  }
)