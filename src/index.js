import connect from './connect.js'
import dotenv from 'dotenv'
import { parsePost } from './utils.js'

// load environment vars
dotenv.load()

const { reddit } = connect()
const FIVE_MINS = 5 * 60 * 1000
const ONE_HOUR = FIVE_MINS * 12
let LAST_FETCH

reddit
  .getSubreddit('all')
  .getHot()
  .then(posts => {
    //
  })

// check if an hour has passed every 5 minutes
setTimeout(() => {
  let shouldFetch = true

  if (LAST_FETCH) {
    //
  }

  if (shouldFetch) {
    //
  }
}, FIVE_MINS)
