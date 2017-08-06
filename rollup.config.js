import json from 'rollup-plugin-json'

const { BUILD } = process.env

function getExternals () {
  return Object.keys(require('./package.json').dependencies)
    .concat(require('repl')._builtinLibs)
}

export default {
  entry: `src/${BUILD}/index.js`,
  format: 'cjs',
  preferConst: true,
  dest: `build/${BUILD}.js`,
  external: getExternals(),
  plugins: [
    json()
  ]
}
