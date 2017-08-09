import auth from './auth.js'
import env from '../env.js'
import Koa from 'koa'
import mongoose from 'mongoose'
import router from 'koa-route'
import serve from 'koa-static'
import { getPosts } from './api.js'
import '../handle-exit.js'

const { MONGODB_URI, NODE_ENV, PORT } = env.get()
const PUBLIC_PATH = './public'
const server = new Koa()

if (NODE_ENV === 'production') {
  server.use(auth)
}

server.use(
  router.get('/api/posts', async ctx => {
    ctx.body = await getPosts()
  })
)

server.use(serve(PUBLIC_PATH))

mongoose.connect(MONGODB_URI)
server.listen(PORT)
console.log(`Server started on http://localhost:${PORT}`)
