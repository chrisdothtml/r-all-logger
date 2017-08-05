import dotenv from 'dotenv'
import fetchPosts from './fetch-posts.js'
import initialize from './init.js'
import Tock from 'tocktimer'

dotenv.load()
initialize()

const timer = new Tock({
  callback: () => {
    fetchPosts()
      .then(() => { console.log(`/r/all posts saved at ${new Date().toString()}`) })
      .catch(console.error)
  }
})

// run every minute
timer.interval = timer.timeToMS('00:01:00')
timer.start()
