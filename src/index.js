import connect from './connect.js'
import dotenv from 'dotenv'
import { parsePost } from './utils.js'
import Tock from 'tocktimer'

// load environment vars
dotenv.load()

const { reddit } = connect()

reddit
  .getSubreddit('all')
  .getHot()
  .then(posts => {
    //
  })

const timer = new Tock({
  callback: () => {
    fetchPosts()
      .then(() => { console.log(`/r/all posts saved at ${new Date().toString()}`) })
      .catch(console.error)
  }
})

// run every hour
timer.interval = timer.timeToMS('01:00:00')
timer.start()
