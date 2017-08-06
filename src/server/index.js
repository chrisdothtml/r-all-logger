import env from '../env.js'
import Koa from 'koa'
import mongoose from 'mongoose'
import serve from 'koa-static'

const { MONGODB_URI, PORT } = env.get()
const PUBLIC_PATH = './public'
const server = new Koa()

// connect to mongo
mongoose.connect(MONGODB_URI)

server.use(serve(PUBLIC_PATH))
server.listen(PORT)

console.log(`Server started on http://localhost:${PORT}`)
