import dotenv from 'dotenv'

// local env vars
dotenv.load()

let cache

export function get () {
  if (!cache) {
    const {
      CLIENT_ID,
      CLIENT_SECRET,
      MONGODB_URI,
      PORT,
      REFRESH_TOKEN
    } = process.env

    cache = {
      CLIENT_ID,
      CLIENT_SECRET,
      MONGODB_URI: MONGODB_URI || 'mongodb://localhost:27017',
      PORT: PORT || 1337,
      REFRESH_TOKEN
    }
  }

  return cache
}
