const through = require('through2-concurrent')
const PluginError = require('plugin-error')
const Vinyl = require('vinyl')
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
  return through.obj({ maxConcurrency: 4 }, async function (file, enc, cb) {
    if (file.isNull()) return cb(null, file)
    if (file.isStream()) return cb(new PluginError(PLUGIN_NAME, 'Streams are not supported'))
    if (file.isBuffer()) {
      const variants = (options) ? options : [{}]
      if (!variants.length) return cb(new PluginError(PLUGIN_NAME, 'Options are incorrect'))
      try {
          log(`${PLUGIN_NAME}:`, 'optimizing ' + c.magenta(file.relative) + '...')
          const upload = abraia.fromFile(file)
          for (let k = 0; k < variants.length; k++) {
              const variant = variants[k]
              const fmt = (variant && variant.rename && variant.rename.extname) ? { fmt: variant.rename.extname.slice(1).toLowerCase() } : undefined
              const data = await upload.resize(variant).toBuffer(fmt)
              const newFile = new Vinyl({
                cwd: file.cwd,
                base: file.base,
                path: file.path,
                contents: file.contents
              })
              if (variant && variant.rename) {
                const { prefix, suffix, extname } = variant.rename
                if (suffix) newFile.stem = `${file.stem}${suffix}`
                if (prefix) newFile.stem = `${prefix}${file.stem}`
                if (extname) newFile.extname = extname
              }
              const saved = file.contents.length - data.length
              const percent = saved / (file.contents.length + 0.00001) * 100
              const msg = `saved ${sizeFormat(saved)} - ${percent.toFixed(1)}%`
              log(`${PLUGIN_NAME}:`, c.green('✔ ') + c.magenta(file.relative) + c.gray(` (${msg})`))
              if (options || saved > 0) newFile.contents = data
              this.push(newFile)
          }
          return cb()
      } catch (error) {
          const { status } = error.response
          if (status === 401) return cb(new PluginError(PLUGIN_NAME, 'Error 401: Set ABRAIA_KEY as environment variable'))
          if (status === 403) return cb(new PluginError(PLUGIN_NAME, 'Error 403: Buy more credits to continue optimizing'))
          return cb(new PluginError(PLUGIN_NAME, error.message))
      }
    }
  })
}

module.exports = gulpAbraia
