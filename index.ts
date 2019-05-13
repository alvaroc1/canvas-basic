import { runApp, Subscription } from './app'
import { drawCloud, drawCharacter } from './draw'

type Key = "left" | "right" | "up" | "down"

type KeyUp = {
  "type": "keyup",
  key: Key
}

const keyMap: {[k: number]: Key} = {
  38: "up",
  40: "down",
  37: "left",
  39: "right"
}

namespace Event {
  export const keyUp = (k: Key): Event => ({"type": "keyup", key: k})
  export const keyDown = (k: Key): Event => ({"type": "keydown", key: k})
}

type KeyDown = {
  "type": "keydown",
  key: Key
}

type Event = KeyUp | KeyDown

type State = {
  offset: number,
  speed: number,
  y: number,
  yspeed: number,
  keysHeld: Array<Key>
}

const jump = new Audio("https://github.com/alvaroc1/canvas-basic/blob/master/jump.mp3?raw=true")
jump.load()

const distinct = <T>(array: Array<T>): Array<T> => {
  return array.reduce(
    (acc, el) => acc.indexOf(el) !== -1 ? acc : [...acc, el],
    []
  )
}

const subscriptions = (_: State): Array<Subscription<Event>> => [
  Subscription.keyDown(event => {
    const k = keyMap[event.keyCode]
    return Event.keyUp(k)
  }),
  Subscription.keyUp(event => {
    const k = keyMap[event.keyCode]
    return Event.keyUp(k)
  })
]

runApp <State, Event>(
  "game",
  300, 300,
  {
    initial: {
      offset: 0, 
      speed: 10,
      y: 0,
      yspeed: 0,
      keysHeld: []
    },

    tick: (model, delta) => {
      let speed = model.speed
      if (model.keysHeld.indexOf("left") !== -1) {
        speed -= 5 * (delta/100)
        speed = Math.max(speed, -20)
      }
      if (model.keysHeld.indexOf("right") !== -1) {
        speed += 5 * (delta/100)
        speed = Math.min(speed, 20)
      }
      if (model.keysHeld.length === 0) {
        if (speed > 0) {
          speed -= 5 * (delta/100)
          speed = Math.max(speed, 0)
        } else {
          speed += 5 * (delta/100)
          speed = Math.min(speed, 0)
        }
      }
      let y = model.y
      let yspeed = model.yspeed
    
      y = model.y + (yspeed * (delta/32))
      yspeed -= (delta/32)

      if (y < 0) {
        y = 0
        yspeed = 0
      }

      return {
        ...model,
        offset: model.offset + (delta/100) * model.speed,
        y: y,
        yspeed: yspeed,
        speed: speed
      }
    },

    update: (model, event) => {
      if (event.type == "keydown" && event.key == "up") {
        console.log("play")
        jump.play().catch(e => console.log(e.getMessage()))

        console.log(jump)
        return {
          ...model,
          yspeed: 12
        }
      }
      switch (event.type) {
        case "keydown": return {
          ...model,
          keysHeld: distinct<Key>([...model.keysHeld, event.key])
        }
        case "keyup": return {
          ...model,
          keysHeld: model.keysHeld.filter(k => k !== event.key)
        }
        default: return model
      }
    },

    view: (model, ctx) => {
      // draw sky
      ctx.fillStyle = "lightblue"
      ctx.fillRect(0, 0, 300, 250)

      // draw ground
      ctx.fillStyle = "green"
      ctx.fillRect(0, 250, 300, 50)


      // draw clouds
      drawCloud(ctx, -model.offset + 50, 50)
      drawCloud(ctx, -model.offset + 180, 70)

      // draw character
      drawCharacter(ctx, 140, model.y)

      drawCloud(ctx, -model.offset + 50 + 400, 50)
      drawCloud(ctx, -model.offset + 180 + 400, 70)

      ctx.fillText("Speed: " + model.speed, 30, 270)
      ctx.fillText("Keys: " + model.keysHeld, 30, 285)

      ctx.fillText("ySpeed: " + model.yspeed, 30, 295)
    },
    
    subscriptions: subscriptions
    /*
    onKeyDown: event => {
      const k = keyMap[event.keyCode]
      return (k ? Event.keyDown(k) : null)
    },

    onKeyUp: event => {
      const k = keyMap[event.keyCode]
      return (k ? Event.keyUp(k) : null)
    },
    */
  }
)
