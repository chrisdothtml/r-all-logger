import fetchPosts from './fetch-posts.js'
import initialize from './init.js'
import Tock from 'tocktimer'

function startFetcher () {
  const timer = new Tock({
    callback () {
      fetchPosts()
        .then(() => {
          const timestamp = new Date().toString()
          console.log(`/r/all posts saved at ${timestamp}`)
        })
        .catch(console.error)
    }
  })

  // every half hour
  timer.interval = timer.timeToMS('00:30:00')
  timer.start()
}

initialize()
startFetcher()
