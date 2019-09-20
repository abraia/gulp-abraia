[![npm version](https://img.shields.io/npm/v/gulp-abraia.svg?style=flat-square)](https://www.npmjs.com/package/gulp-abraia)
[![Build Status](https://img.shields.io/travis/abraia/gulp-abraia.svg?style=flat-square)](https://travis-ci.org/abraia/gulp-abraia)
[![Coverage Status](https://img.shields.io/coveralls/github/abraia/gulp-abraia/badge.svg?style=flat-square)](https://coveralls.io/github/abraia/gulp-abraia)

# Abraia gulp plugin

Automate your web image optimization workflows and get a best performant ecommerce.
Based on [Abraia's content-aware technology](https://abraia.me/docs/image-optimization),
you can easily optimize and transform JPEG, PNG, GIF, WebP, and SVG images, providing
the best visual quality with the minimal file size. We analyze each image to adjust
resize and compression operations to every case.

![Optimized fashion clothes pictures](https://github.com/abraia/gulp-abraia/raw/master/images/fashion-mosaic.jpg)

## Install

Install Gulp 4 and the plugin:

```sh
npm install gulp gulp-abraia gulp-cache --save-dev
```

Get your [free API key](https://abraia.me/docs/getting-started) and set the
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
  return gulp.src('images/**')
    .pipe(cache(abraia()))
    .pipe(gulp.dest('output'))
})

gulp.task('watch', () => {
  gulp.watch('images/**', gulp.series('optimize'))
})
```

```sh
gulp watch
```

## Options

To generate multiple variants for each image you just need to specify the size
and the output name policy.

```js
gulp.task('variants', () => {
  return gulp.src('images/**')
    .pipe(abraia([
      { width: 1920, output: '{name}-1920.{ext}' },
      { width: 750, output: '{name}-750.{ext}' },
      { width: 375, output: '{name}-375.{ext}' }
    ]))
    .pipe(gulp.dest('output'))
})
```

With this simple code you get three optimized variants to use in your responsive
design.

Output name policies are now defined with a syntax like Javascript ES6 template
literals without $ simbols. The input file name and extension are defined as
`name` and `ext` variables.

This simplifies renaming policies (`rename`), replacing the verbose syntax used
before:

- `prefix` to insert something before the file name. For instance you can store
the new file in a subfolder just with `prefix: '750/'`.

- `suffix` to insert something after the file name. For instance you can append
a suffix to the file name with `suffix: '-thumbnail'`

- `extname` to change the file format or to force the conversion of an image
type. For instance, you can convert all your images to the WebP format with
 `extname: 'webp'`.

## New features

* Now it is very easy to automate branding and editing operations creating actions
with the WYSIWYG editor from the the [web console](https://abraia.me/console).

```js
gulp.task('variants', () => {
  return gulp.src('images/**')
    .pipe(abraia([
      { width: 750, action: 'abraia.atn', output: '{name}-brand.{ext}' }
    ]))
    .pipe(gulp.dest('output'))
})
```

* Initial support for [video optimization](https://abraia.me/docs/video-optimization)
has been added. You can now optimize high quality short videos with a maximum file
size of 100MB.

```js
gulp.task('variants', () => {
  return gulp.src('videos/*.mp4')
    .pipe(abraia([
      { height: 720, output: '{name}-720p.{ext}' }
    ]))
    .pipe(gulp.dest('output'))
})
```

## License

This software is licensed under the MIT License. [View the license](LICENSE).
