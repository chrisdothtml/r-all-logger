import json from 'rollup-plugin-json'

function getExternals () {
  return Object.keys(require('./package.json').dependencies)
    .concat(require('repl')._builtinLibs)
}

export default {
  entry: 'src/index.js',
  format: 'cjs',
  dest: 'build/index.js',
  external: getExternals(),
  plugins: [
    json()
  ]
}
