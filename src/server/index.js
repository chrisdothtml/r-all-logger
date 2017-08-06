import env from '../env.js'
import Koa from 'koa'
import serve from 'koa-static'

const { PORT } = env.get()
const PUBLIC_PATH = './public'
const server = new Koa()

server.use(serve(PUBLIC_PATH))
server.listen(PORT)

console.log(`Server started on http://localhost:${PORT}`)
