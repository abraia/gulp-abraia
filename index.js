const through = require('through2-concurrent')
const PluginError = require('plugin-error')
const abraia = require('abraia/abraia')

const PLUGIN_NAME = 'gulp-abraia'

const gulpAbraia = () => {
  return through.obj({ maxConcurrency: 3 }, function (file, enc, cb) {
    if (file.isNull()) return cb(null, file)
    if (file.isBuffer()) {
      // file.contents = file.contents
      console.log('Buffer', file.path)
      abraia.fromFile(file).toBuffer().then(data => {
        console.log('Size', file.contents.length, data.length)
        if (data.length < file.contents.length) {
          file.contents = data
        }
        cb(null, file)
      })
    }
    if (file.isStream()) {
      console.log('Stream', file.path)
      cb(null, file)
    }
  })
}

module.exports = gulpAbraia
