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
  }).timeout(10000)

  it('resize image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ width: 750 }]))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(10000)

  it('convert image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ format: 'webp' }]))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(10000)

  it('smartcrop image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ width: 750, height: 1500, output: '{name}_s750x1500.{ext}' }]))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(10000)

  it('padding image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ width: 750, height: 750, output: '{name}_p750x750.{ext}' }]))
      // .pipe(gulp.dest('images'))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(10000)

  it('canvas image from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia([{ width: 750, action: 'test.atn', output: '{name}_c750x750.jpg' }]))
      // .pipe(gulp.dest('images'))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(10000)

  it('create poster from video file', (done) => {
    gulp.src('images/coffee.mp4')
      .pipe(abraia([{ output: '{name}_p.jpg' }]))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(50000)

  it('create video poster with logo', (done) => {
    gulp.src('images/coffee.mp4')
      .pipe(abraia([{ action: 'traffic.atn', output: '{name}_l.jpg' }]))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(50000)

  // it('emit error on wrong file', (done) => {
  //   gulp.src('index.js')
  //     .pipe(abraia())
  //     .once('error', (err) => {
  //       console.error(err)
  //       assert(err instanceof Object)
  //       done()
  //     })
  // }).timeout(10000)
})
