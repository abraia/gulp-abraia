const through = require('through2-concurrent')
const PluginError = require('plugin-error')
const Vinyl = require('vinyl')
const path = require('path')
const util = require('util')
const fs = require('fs')

const log = require('fancy-log')
const c = require('ansi-colors')

const config = require('abraia/config')
config.folder = 'gulp/'

const abraia = require('abraia/abraia')

const stat = util.promisify(fs.stat)

const PLUGIN_NAME = 'gulp-abraia'

const sizeFormat = (bytes, decimals = 1) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = 0
  for (var u = 0; u < units.length; u++) {
    value = bytes
    bytes /= 1024
    if (bytes > -1 && bytes < 1) break
  }
  return value.toFixed(decimals) + ' ' + units[u]
}

const createNewFile = (file, variant, dest) => {
  const newFile = new Vinyl(file)
  if (dest) newFile.dirname = path.join(newFile.cwd, dest)
  if (variant && variant.rename) {
    const { prefix, suffix, extname } = variant.rename
    if (suffix) newFile.stem = `${newFile.stem}${suffix}`
    if (prefix) newFile.stem = `${prefix}${newFile.stem}`
    if (extname) newFile.extname = extname
  }
  return newFile
}

const compareFiles = async (sourceStat, targetPath) => {
  try {
    const targetStat = await stat(targetPath)
    return sourceStat.mtime > targetStat.mtime
  } catch (err) {
    return true
  }
}

const gulpAbraia = (options) => {
  return through.obj({ maxConcurrency: 4 }, async function (file, enc, cb) {
    if (file.isNull()) return cb(null, file)
    if (file.isStream()) return cb(new PluginError(PLUGIN_NAME, 'Streams are not supported'))
    if (file.isBuffer()) {
      const variants = (options) ? options : [{}]
      if (!variants.length) return cb(new PluginError(PLUGIN_NAME, 'Options are incorrect'))
      try {
        let upload
        for (let k = 0; k < variants.length; k++) {
          const variant = variants[k]
          // const dest = 'public'
          const dest = undefined
          // TODO: Add dest parameter just to process unprocessed images
          const newFile = createNewFile(file, variant, dest)
          const compare = await compareFiles(file.stat, newFile.path)
          // console.log(compare, newFile.path)
          if (!dest || compare) {
            if (!upload) {
              log(`${PLUGIN_NAME}:`, 'optimizing ' + c.magenta(file.relative) + '...')
              upload = abraia.fromFile(file)
            }
            const fmt = (variant && variant.rename && variant.rename.extname) ? { fmt: variant.rename.extname.slice(1).toLowerCase() } : undefined
            const data = await upload.resize(variant).process(variant).toBuffer(fmt)
            const saved = file.contents.length - data.length
            const percent = saved / (file.contents.length + 0.00001) * 100
            const msg = `saved ${sizeFormat(saved)} - ${percent.toFixed(1)}%`
            log(`${PLUGIN_NAME}:`, c.green('✔ ') + c.magenta(newFile.relative) + c.gray(` (${msg})`))
            if (options || saved > 0) newFile.contents = data
            this.push(newFile)
          }
        }
        return cb()
      } catch (err) {
        if (err.code === 401) return cb(new PluginError(PLUGIN_NAME, 'Error 401: Set ABRAIA_KEY as environment variable'))
        if (err.code === 402) return cb(new PluginError(PLUGIN_NAME, 'Error 402: Buy more credits to continue optimizing'))
        return cb(new PluginError(PLUGIN_NAME, `Error ${err.code}: ${err.message}`))
      }
    }
  })
}

module.exports = gulpAbraia
