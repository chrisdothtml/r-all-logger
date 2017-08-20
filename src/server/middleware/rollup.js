import router from 'koa-route'
import store from '../../store.js'
import { rollup } from 'rollup'
import { join } from 'path'

const cache = store.cache.rollup
const config = {
  format: 'iife',
  sourceMap: 'inline'
}

export default function serveJS (PUBLIC_PATH) {
  return router.get('**/*.js', async ctx => {
    const FILE_PATH = join(PUBLIC_PATH, ctx.path)
    const bundle = await rollup({
      cache: cache[FILE_PATH],
      entry: FILE_PATH
    })
    const output = await bundle.generate(config)

    cache[FILE_PATH] = bundle
    ctx.body = output.code
  })
}
