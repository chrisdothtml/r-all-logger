import dotenv from 'dotenv'
import express from 'express'
import fetchPosts from './fetch-posts.js'
import initialize from './init.js'
import Tock from 'tocktimer'

dotenv.load()
initialize()

const PORT = process.env.PORT || 1337
const app = express()
const timer = new Tock({
  callback: () => {
    fetchPosts()
      .then(() => { console.log(`/r/all posts saved at ${new Date().toString()}`) })
      .catch(console.error)
  }
})

// run every half hour
timer.interval = timer.timeToMS('00:30:00')
timer.start()

// pointless server to stop heroku from fucking crashing
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})
