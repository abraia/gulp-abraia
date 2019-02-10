const assert = require('chai').assert
const gulp = require('gulp')

const abraia = require('../index')

describe('gulp-abraia', () => {
  // it('should emit error on null file', (done) => {
  //   gulp.src('images/test.png')
  //     .pipe(abraia())
  //     .once('error', (err) => {
  //       console.error(err)
  //       // err.message.should.eql('gulp-concat: Streaming not supported')
  //       done()
  //     })
  // }).timeout(20000)

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
      .pipe(abraia({ width: 750 }))
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(20000)
})
