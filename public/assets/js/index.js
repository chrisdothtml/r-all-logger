import * as components from './components/index.js'

const { keys } = Object
const doc = window.document
const componentElements = {
  exportButton: doc.getElementById('export-btn'),
  subredditChart: doc.querySelector('#sr-chart canvas'),
  topCounts: doc.getElementById('top-counts')
}

function init () {
  return Promise.all(
    keys(components).map(async name => {
      return components[name].init(
        componentElements[name]
      )
    })
  )
}

init()
  .then(() => {
    doc.body.classList.remove('loading')
  })
  .catch(console.error)
