[![npm version](https://img.shields.io/npm/v/gulp-abraia.svg)](https://www.npmjs.com/package/gulp-abraia)
[![Build Status](https://travis-ci.org/abraia/gulp-abraia.svg)](https://travis-ci.org/abraia/gulp-abraia)
[![Coverage Status](https://coveralls.io/repos/github/abraia/gulp-abraia/badge.svg)](https://coveralls.io/github/abraia/gulp-abraia)
![npm vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/gulp-abraia.svg)

# Abraia gulp plugin

Optimize JPEG, PNG, GIF, SVG, and WebP images with [Abraia](https://abraia.me).

[Optimized fashion clothes picture](https://github.com/abraia/gulp-abraia/raw/master/images/fashion-clothes.jpg)

## Install

Install gulp and the plugin:

```sh
npm install gulp gulp-abraia gulp-cache --save-dev
```

Get your [free API key](https://abraia.me/docs/getting-started) and define the
`ABRAIA_KEY` environment variable.

```sh
export ABRAIA_KEY=your_api_key
```

## Usage

To optimize all the images in a folder (`images`) and stay watching for new
files, you just need to add the next code to your `gulpfile.js`.

```js
const gulp = require('gulp')
const cache = require('gulp-cache')
const abraia = require('gulp-abraia')

gulp.task('optimize', () => {
  return gulp.src('images/*')
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
