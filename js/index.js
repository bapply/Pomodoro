import $ from 'jquery'
import Horizon from '@horizon/client'

const hz = new Horizon()
const Pomodoro = hz('pomodoro')

const timer = {
  model: 'timer',
  active: false, // boolean, duh!
  pause: false, // really?
  time: 0, // seconds
  max: 60*25, // max time of pomodoro
  count: 0 // number of pomodoro
}

const relax = {
  model: 'relax',
  active: false,
  time: 0,
  max: 60*5,
  count: 0
}

timer.other = relax
relax.other = timer

const $timer = $('#timer')
const $start = $('#start')
const $pause = $('#pause')
const $stop = $('#stop')
const $count = $('#count')

$start.on('click', () => {
  timer.active = true
  if (!timer.pause) {
    timer.id = Date.now()
    timer.count++
  }
  timer.pause = false
  logTime(timer)
  processModel(timer)
})

$pause.on('click', () => {
  timer.active = false
  timer.pause = true
  processModel(timer)
})

$stop.on('click', () => {
  timer.active = false
  timer.pause = false
  timer.count = 0
  timer.time = 0
  relax.count = 0
  relax.time = 0
  processModel(timer)
})

function logTime (model) {
  setTimeout(() => {
    if (!model.active) return
    model.time++

    if (model.time >= model.max) {
      model.active = false
      model.time = 0
      model.other.active = true
      model.other.count++
      processModel(model)
      model.other.id = Date.now()
      logTime(model.other)
      return
    }

    processModel(model)
    logTime(model)
  }, 1000)
}

let state = 'stop'
function processModel (model) {
  if (timer.active) state = 'active'
  else if (relax.active) state = 'relax'
  else if (timer.pause) state = 'pause'
  else state = 'stop'

  $timer.text(format($timer.data(state), model.time))
  $count.text($count.data('always').replace('%count', timer.count))
  $start.text($start.data(state))
    .toggle(shouldDisplay($start))
  $pause.text($pause.data(state))
    .toggle(shouldDisplay($pause))
  $stop.text($stop.data(state))
    .toggle(shouldDisplay($stop))
  console.log(model)
}

function format (f, time) {
  let minutes = Math.floor(time / 60)
  let seconds = time % 60

  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  return f
    .replace('%m', minutes)
    .replace('%s', seconds)
}

function shouldDisplay (el) {
  return el.data('hide').indexOf(state) === -1
}

processModel(timer)