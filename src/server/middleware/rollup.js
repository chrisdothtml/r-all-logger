import fs from 'fs'
import router from 'koa-route'
import store from '../../store.js'
import { rollup } from 'rollup'
import { join } from 'path'
import { promisify } from 'util'

const ROLLUP_CACHE = store.cache.rollup
const CONFIG = {
  format: 'iife',
  sourceMap: 'inline'
}

async function fileExists (path) {
  const absPath = join(process.cwd(), path)
  let result = true

  try {
    await promisify(fs.access)(absPath)
  } catch (error) {
    if (error) {
      result = false
    }
  }

  return result
}

export default function serveJS (PUBLIC_PATH) {
  return router.get('**/*.js', async ctx => {
    const entry = join(PUBLIC_PATH, ctx.path)

    if (await fileExists(entry)) {
      const cache = ROLLUP_CACHE[entry]
      const bundle = await rollup({ cache, entry })
      const output = await bundle.generate(CONFIG)

      ROLLUP_CACHE[entry] = bundle
      ctx.body = output.code
    }
  })
}
