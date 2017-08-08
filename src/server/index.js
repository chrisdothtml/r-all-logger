import auth from 'basic-auth'
import env from '../env.js'
import Koa from 'koa'
import mongoose from 'mongoose'
import router from 'koa-route'
import serve from 'koa-static'
import { getPosts } from './api.js'

const { MONGODB_URI, NODE_ENV, PORT } = env.get()
const PUBLIC_PATH = './public'
const server = new Koa()

if (NODE_ENV === 'production') {
  const { AUTH_USER, AUTH_PASS } = env.get()

  server.use(async (ctx, next) => {
    let isAuthorized

    try {
      const user = auth(ctx)
      isAuthorized = user.name === AUTH_USER && user.pass === AUTH_PASS
    } catch (error) {
      isAuthorized = false
    }

    if (isAuthorized) {
      return next()
    } else {
      ctx.set('WWW-Authenticate', 'Basic')
      ctx.status = 401
    }
  })
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
