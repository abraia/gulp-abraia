[![npm version](https://img.shields.io/npm/v/gulp-abraia.svg)](https://www.npmjs.com/package/gulp-abraia)
[![Build Status](https://travis-ci.org/abraia/gulp-abraia.svg)](https://travis-ci.org/abraia/gulp-abraia)
[![Coverage Status](https://coveralls.io/repos/github/abraia/gulp-abraia/badge.svg)](https://coveralls.io/github/abraia/gulp-abraia)
![npm vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/gulp-abraia.svg)

# Abraia gulp plugin

Automate your image optimization workflows and get a best performant ecommerce
based on [Abraia's content-aware technology](https://abraia.me/docs/image-optimization).
We optimize JPEG, PNG, GIF, SVG, and WebP images to provide the best visual
quality - for fashion ecommerce websites - with the minimal file size. We
analyze each image to adjust resize and compression operations to every case.

![Optimized fashion clothes picture](https://github.com/abraia/gulp-abraia/raw/master/images/fashion-clothes.jpg)

## Install

Install gulp and the plugin:

```sh
npm install gulp gulp-abraia gulp-cache --save-dev
```

Get your [free API key](https://abraia.me/docs/getting-started) and define the
`ABRAIA_KEY` environment variable, or define it at the start of your `gulpfile.js`.

## Usage

To optimize all the images in a folder (`images`) and stay watching for new
files, you just need to add the next code to your `gulpfile.js`.

```js
process.env.ABRAIA_KEY = 'YOUR_API_KEY'

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

## Options

To generate multiple variants for each image you just need to specify the size
and renaming policies.

```js
gulp.task('variants', () => {
  return gulp.src('images/*')
    .pipe(cache(abraia([
      { width: 1920, rename: { suffix: '-1920' }},
      { width: 750, rename: { suffix: '-750' }},
      { width: 375, rename: { suffix: '-375' }}
    ])))
    .pipe(gulp.dest('output'))
})
```

With this simple code you get three optimized variants to use in your
responsive design.

Supported renaming options are:

- `prefix` to insert something before the file name. For instance you can store
the new file in a subfolder just with `prefix: '750/'`.

- `suffix` to insert something after the file name. For instance you can append
a suffix to the file name with `suffix: '-thumbnail'`

- `extname` to change the file format or to force the conversion of an image
type. For instance, you can convert all your images to the WebP format with
 `extname: 'webp'`.

## License

This software is licensed under the MIT License. [View the license](LICENSE).
