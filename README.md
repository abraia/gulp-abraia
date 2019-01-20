# Abraia gulp plugin

Optimize JPEG, PNG, GIF, SVG and WebP images with [Abraia](https://abraia.me).

## Install

```sh
npm install gulp-abraia --save-dev
```

## Usage

```javascript
const gulp = require('gulp')
const cache = require('gulp-cache')
const abraia = require('gulp-abraia')

gulp.task('optimize', () => {
  return gulp.src('images/*.jpg')
    .pipe(cache(abraia()))
    .pipe(gulp.dest('output'))
})

gulp.task('watch', () => {
  gulp.watch('images/*', gulp.series('optimize'))
})
```

```sh
gulp watch
```

## License

This software is licensed under the MIT License. [View the license](LICENSE).
