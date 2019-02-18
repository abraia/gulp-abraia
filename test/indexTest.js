const assert = require('chai').assert
const gulp = require('gulp')

const abraia = require('../index')

describe('gulp-abraia', () => {
  it('optimize image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia())
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(20000)

  it('resize image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ width: 750 }]))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(20000)

  it('convert image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ rename: { extname: '.webp' } }]))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(20000)

  it('emit error on wrong file', (done) => {
    gulp.src('index.js')
      .pipe(abraia())
      .once('error', (err) => {
        console.error(err)
        assert(err instanceof Object)
        done()
      })
  }).timeout(20000)
})
