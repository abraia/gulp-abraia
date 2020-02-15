[![npm version](https://img.shields.io/npm/v/gulp-abraia.svg?style=flat-square)](https://www.npmjs.com/package/gulp-abraia)
[![Build Status](https://img.shields.io/travis/abraia/gulp-abraia.svg?style=flat-square)](https://travis-ci.org/abraia/gulp-abraia)
[![Coverage Status](https://img.shields.io/coveralls/github/abraia/gulp-abraia/badge.svg?style=flat-square)](https://coveralls.io/github/abraia/gulp-abraia)

# Abraia gulp image optimization

Automate your web image and video optimization workflows for ecommerce and marketing.
Based on [Abraia's content-aware technology](https://abraia.me/docs/image-optimization/),
you can easily optimize and transform JPEG, PNG, GIF, WebP, and SVG images, providing
the best visual quality with the minimal file size. We analyze each image to precisely
resize and compress every image and video.

![Optimized fashion clothes pictures](https://github.com/abraia/gulp-abraia/raw/master/images/fashion-mosaic.jpg)

You can also brand and watermark your images and videos with templates, or get
[perfectly optimized videos for web](https://abraia.me/docs/video-optimization/).

## Abraia plugin installation

Install Gulp 4 and the plugin:

```sh
npm install gulp gulp-abraia gulp-cache --save-dev
```

Get your [Abraia API key](https://abraia.me/console/settings) and set the `ABRAIA_KEY`
environment variable, or define it at the start of your `gulpfile.js`.

## Image optimization

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

## Responsive images

Image compression is the last step on image optimization for a responsive design.
To generate the multiple variants that you need to use in your responsive design,
you just need to specify the size (commonly the width) and the output name policy
for each derivant.

```js
gulp.task('variants', () => {
  return gulp.src('images/**')
    .pipe(abraia([
      { width: 1920, output: '{name}-1920.{ext}' },
      { width: 1125, output: '{name}-1125.{ext}' },
      { width: 750, output: '{name}-750.{ext}' },
      { width: 375, output: '{name}-375.{ext}' }
    ]))
    .pipe(gulp.dest('output'))
})
```

With this simple code you get three optimized variants to use in your mobile first
responsive design (optimized for iPhones).

## Image branding and editing

With the [web image editor](https://abraia.me/console/editor) you can easily use and
create templates to automate your bulk operations for branding and editing. For
instance, you can easily create a branding template (e.g. abraia.atn) and use it to
brand and optimize all your images at once.

![Abraia image editor](https://github.com/abraia/gulp-abraia/raw/master/images/console-editor.jpg)

```js
gulp.task('variants', () => {
  return gulp.src('images/**')
    .pipe(abraia([
      { width: 750, action: 'abraia.atn', output: '{name}-brand.{ext}' }
    ]))
    .pipe(gulp.dest('output'))
})
```

## Video optimization

You can now optimize videos (up to 5 minutes) for web with a maximum file size of 100MB.
Combining cropping, resizing, overlaying options and best practices for [video
optimization](https://abraia.me/docs/video-optimization/) never was so easy get all
your videos ready for web and social media.

```js
gulp.task('variants', () => {
  return gulp.src('videos/*')
    .pipe(abraia([
      { height: 720, output: '{name}-720p.mp4' }
    ]))
    .pipe(gulp.dest('output'))
})
```

## Configuation options

The configuration optimions are [documented with the API](https://abraia.me/docs/api/).
But you do not read any of this, because using the [web console](https://abraia.me/console/),
you can easily download it. Just use the bulk tool to create your configuration.

### Renaming options

Output name policies are now defined with a syntax like Javascript ES6 template
literals without $ simbols. The input file name and extension are defined as
`name` and `ext` variables. So, you just need to build your output path using
`{name}` as the placeholder for the file name, and `{ext}` for the extension.

For instance:

- You can store the new file in a subfolder just with `output: '750/{name}.{ext}'`.
- You can append a suffix to the fie name with `output: '{name}-thumbnail.{ext}'`.
- You can change the file format (image and video conversion) writing the extension
like `output: '{name}.webp'`.

## License

This software is licensed under the MIT License. [View the license](LICENSE).
