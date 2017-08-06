import fetchPosts from './fetch-posts.js'
import initialize from './init.js'
import Tock from 'tocktimer'

initialize()

const timer = new Tock({
  callback () {
    fetchPosts()
      .then(() => { console.log(`/r/all posts saved at ${new Date().toString()}`) })
      .catch(console.error)
  }
})

// run every half hour
timer.interval = timer.timeToMS('00:30:00')
timer.start()
