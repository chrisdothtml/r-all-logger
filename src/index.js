// import connect from './connect.js'
import dotenv from 'dotenv'
import fs from 'fs'
import * as postUtils from './posts.js'
import { join } from 'path'
import { promisify } from 'util'

// load environment vars
dotenv.load()

const writeFile = promisify(fs.writeFile)
// const reddit = connect()

// reddit
//   .getSubreddit('all')
//   .getHot()
//   .then(async posts => {
//     await writeFile(
//       join(__dirname, '../results.json'),
//       JSON.stringify(posts, null, 4)
//     )
//   })

async function testParser (posts) {
  posts = posts.map(postUtils.parse)

  await writeFile(
    join(__dirname, '../parsed.json'),
    JSON.stringify(posts, null, 2)
  )
}

testParser(require('../results.json'))
  .catch(console.error)
