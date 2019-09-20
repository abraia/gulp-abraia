require('dotenv').config()

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
  }).timeout(30000)

  it('resize image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ width: 750 }]))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(30000)

  it('convert image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ rename: { extname: '.webp' } }]))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(30000)

  it('smartcrop image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ width: 750, height: 1500, output: '{name}_s750x1500.{ext}' }]))
      // .pipe(gulp.dest('images'))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(30000)

  it('padding image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ width: 750, height: 750, rename: { suffix: '_p750x750' } }]))
      // .pipe(gulp.dest('images'))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(30000)

  it('canvas image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ width: 750, action: 'abraia.atn', output: '{name}_c750x750.jpg' }]))
      // .pipe(gulp.dest('images'))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(30000)

  it('emit error on wrong file', (done) => {
    gulp.src('index.js')
      .pipe(abraia())
      .once('error', (err) => {
        console.error(err)
        assert(err instanceof Object)
        done()
      })
  }).timeout(30000)
})
