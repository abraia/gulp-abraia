const through = require('through2-concurrent')
const PluginError = require('plugin-error')
const log = require('fancy-log')
const c = require('ansy-colors')
const abraia = require('abraia/abraia')

const PLUGIN_NAME = 'gulp-abraia'

const sizeFormat = (bytes, decimals = 2) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = 0
  let u = -1
  do {
    value = bytes
    bytes /= 1024
    u += 1
  } while (bytes >= 1 && u < units.length)
  return value.toFixed(decimals) + ' ' + units[u]
}

const gulpAbraia = () => {
  return through.obj({ maxConcurrency: 4 }, (file, enc, cb) => {
    if (file.isNull()) return cb(null, file)
    if (file.isStream()) return cb(new PluginError(PLUGIN_NAME, 'Streams are not supported'))
    if (file.isBuffer()) {
      abraia.fromFile(file).toBuffer()
        .then(data => {
          const saved = file.contents.length - data.length
          const percent = saved / (file.contents.length + 0.00001) * 100
          const msg = `saved ${sizeFormat(saved)} - ${percent.toFixed(1)}%`
          log(`${PLUGIN_NAME}:`, c.green('✔ ') + file.relative + c.gray(` (${msg})`))
          if (saved > 0) file.contents = data
          return cb(null, file)
        })
        // .catch(error => {
        //   return cb(new PluginError(PLUGIN_NAME, error))
        // })
    }
  })
}

module.exports = gulpAbraia
