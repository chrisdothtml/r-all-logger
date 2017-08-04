import mongoose from 'mongoose'
import SnooWrap from 'snoowrap'
import { version } from '../package.json'

export default function connect () {
  const { CLIENT_ID, CLIENT_SECRET, MONGODB_URI, REFRESH_TOKEN } = process.env
  const reddit = new SnooWrap({
    userAgent: `nodejs:r-all-logger:v${version}`,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN
  })

  mongoose.connect(MONGODB_URI)
  return { reddit }
}
