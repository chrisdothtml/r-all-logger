import SnooWrap from 'snoowrap'
import { version } from '../package.json'

export default function connect () {
  const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env

  return new SnooWrap({
    userAgent: `nodejs:r-all-logger:v${version}`,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN
  })
}
