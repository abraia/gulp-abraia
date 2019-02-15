const through = require('through2-concurrent')
const PluginError = require('plugin-error')
const log = require('fancy-log')
const c = require('ansi-colors')

const abraia = require('abraia/abraia')

const PLUGIN_NAME = 'gulp-abraia'

const sizeFormat = (bytes, decimals = 1) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = 0
  let u = -1
  do {
    value = bytes
    bytes /= 1024
    u += 1
  } while (Math.abs(bytes) >= 1 && u < units.length)
  return value.toFixed(decimals) + ' ' + units[u]
}

const gulpAbraia = (options) => {
  return through.obj({ maxConcurrency: 4 }, (file, enc, cb) => {
    if (file.isNull()) return cb(null, file)
    if (file.isStream()) return cb(new PluginError(PLUGIN_NAME, 'Streams are not supported'))
    if (file.isBuffer()) {
      log(`${PLUGIN_NAME}:`, 'compressing ' + c.magenta(file.relative) + '...')
      const fmt = (options && options.rename && options.rename.extname) ? { fmt: options.rename.extname.slice(1).toLowerCase() } : undefined
      abraia.fromFile(file).resize(options).toBuffer(fmt)
        .then(data => {
          if (options && options.rename) {
            const { prefix, suffix, extname } = options.rename
            if (suffix) file.stem = `${file.stem}${suffix}`
            if (prefix) file.stem = `${prefix}${file.stem}`
            if (extname) file.extname = extname
          }
          const saved = file.contents.length - data.length
          const percent = saved / (file.contents.length + 0.00001) * 100
          const msg = `saved ${sizeFormat(saved)} - ${percent.toFixed(1)}%`
          log(`${PLUGIN_NAME}:`, c.green('✔ ') + c.magenta(file.relative) + c.gray(` (${msg})`))
          if (options || saved > 0) file.contents = data
          return cb(null, file)
        })
        .catch(error => {
          const status = error.response.status
          if (status === 401) return cb(new PluginError(PLUGIN_NAME, 'Error 401: Set ABRAIA_KEY as environment variable'))
          if (status === 403) return cb(new PluginError(PLUGIN_NAME, 'Error 403: Buy more credits to continue optimizing'))
          return cb(new PluginError(PLUGIN_NAME, error.message))
        })
    }
  })
}

module.exports = gulpAbraia
