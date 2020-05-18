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

const { sizeFormat, parseString } = require('abraia/utils')
const abraia = require('abraia/abraia')

const stat = util.promisify(fs.stat)

const PLUGIN_NAME = 'gulp-abraia'

const createFile = (file, output, dest) => {
  const newFile = new Vinyl(file)
  if (dest) newFile.dirname = path.dirname(path.join(newFile.cwd, dest, newFile.relative))
  if (output) {
    const newName = parseString(output, { name: newFile.stem, ext: newFile.extname.slice(1) })
    newFile.stem = newName.slice(0, newName.lastIndexOf('.'))
    newFile.extname = `.${newName.split('.').pop()}`
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
      const dest = (options && options.constructor === Object) ? options.dest : undefined
      const variants = (options) ? ((options.constructor === Array) ? options : options.variants ? options.variants : [{}]) : [{}]
      if (!variants.length) return cb(new PluginError(PLUGIN_NAME, 'Options are incorrect'))
      try {
        let upload
        for (let k = 0; k < variants.length; k++) {
          const variant = Object.assign({}, variants[k])
          const { output } = variants[k]
          const newFile = createFile(file, output, dest)
          const compare = await compareFiles(file.stat, newFile.path)
          if (!dest || compare) {
            if (!upload) {
              log(`${PLUGIN_NAME}:`, 'processing ' + c.magenta(file.relative) + '...')
              upload = abraia.fromFile(file)
            }
            const fmt = newFile.extname.slice(1).toLowerCase()
            // TODO: Update to fix this mess; log(fmt, variant)
            const data = await upload.resize(variant).process(variant).toBuffer({ fmt })
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
        if (err.code === 402) return cb(new PluginError(PLUGIN_NAME, 'Error 402: Buy more credits to continue processing'))
        return cb(new PluginError(PLUGIN_NAME, `Error ${err.code}: ${err.message}`))
      }
    }
  })
}

module.exports = gulpAbraia
