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
  // }).timeout(25000)

  it('should return result from buffer file', (done) => {
    gulp.src('images/fashion-clothes.jpg')
      .pipe(abraia())
      .once('data', (data) => {
        assert(data.isBuffer())
        done()
      })
  }).timeout(25000)
})
