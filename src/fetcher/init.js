import mongoose from 'mongoose'
import postSchema from '../schemas/post.js'
import SnooWrap from 'snoowrap'
import store from '../store.js'
import { version } from '../../package.json'

function initReddit () {
  const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env

  store.reddit = new SnooWrap({
    userAgent: `nodejs:r-all-logger:v${version}`,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN
  })
}

function initMongo () {
  const { MONGODB_URI } = process.env

  mongoose.connect(MONGODB_URI)
  store.models.Post = mongoose.model('Post', postSchema)
}

export default function initialize () {
  initReddit()
  initMongo()
}
