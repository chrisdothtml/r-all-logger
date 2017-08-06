import dotenv from 'dotenv'
import Koa from 'koa'
import serve from 'koa-static'

// local env vars
dotenv.load()

const PORT = process.env.PORT || 1337
const PUBLIC_PATH = './public'
const server = new Koa()

server.use(serve(PUBLIC_PATH))
server.listen(PORT)

console.log(`Server started on http://localhost:${PORT}`)
