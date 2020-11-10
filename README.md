[![npm version](https://img.shields.io/npm/v/gulp-abraia.svg?style=flat-square)](https://www.npmjs.com/package/gulp-abraia)
[![Build Status](https://img.shields.io/travis/abraia/gulp-abraia.svg?style=flat-square)](https://travis-ci.org/abraia/gulp-abraia)
[![Coverage Status](https://img.shields.io/coveralls/github/abraia/gulp-abraia/badge.svg?style=flat-square)](https://coveralls.io/github/abraia/gulp-abraia)
![Analytics](https://ga-beacon.appspot.com/UA-108018608-1/github/gulp?pixel)

# Abraia gulp image

With the Abraia Gulp plugin you can easily configure a local folder (on Windows, Mac, or Linux) to automate all your image transformations for web.

<img src="https://store.abraia.me/demo/public/image-optimization/gulp.gif" alt="watch folder image optimization">

Focus on ecommerce product and marketing images, you can:

- Get [perfectly optimized JPEG, PNG, GIF, WebP, and SVG images](/docs/image-optimization/).
- Create several [optimized variants for your responsive design](/docs/image-optimization/) from just once high quality master image.
- Automate the creation of multichannel images (e.g. for your social media or marketplace) using templates.
- You can also brand and watermark your images and photos for web.

![Optimized fashion clothes pictures](https://github.com/abraia/gulp-abraia/raw/master/images/fashion-mosaic.jpg)

## Installation

First, you nee to have [Node](https://nodejs.org/en/download/) installed in your system. Once installed, we can easily create a new project to configure a watch folder and the transformation rules. Just, create a project folder and open a terminal inside it. Then, start the project and install the gulp plugin:

```sh
npm init -y
npm install gulp gulp-abraia --save-dev
```

Now, get your [Abraia API key](https://abraia.me/console/settings) and set the `ABRAIA_KEY` environment variable, or define it at the start of your `gulpfile.js`.

```js
process.env.ABRAIA_KEY='your_api_key'
```

## Usage

Created the project folder and installed the plugin, you just need to create the `gulpfile.js` file and add your configuration rules. Then, run the `gulp watch` comman to start watching the configured folder.

### Image optimization

Add the code bellow to your `gulpfile.js` to optimize all the images in the `images` subfolder:

```js
process.env.ABRAIA_KEY='your_api_key'

const gulp = require('gulp')
const abraia = require('gulp-abraia')

gulp.task('optimize', () => {
  return gulp.src('images/*')
    .pipe(abraia())
    .pipe(gulp.dest('public'))
})

gulp.task('watch', () => {
  gulp.watch('images/*', gulp.series('optimize'))
})
```

Then, start watching the folder with the command bellow:

```sh
gulp watch
```

Now, add your images to the `images` folder and see how the web optimized result is appearing in the `public` subfolder.

### Responsive images

Get several variants from a unique master image resizing and optimizing the pristine image. Just configure the sizes (usually the width) and the output name policy to get your optimized variants ready to use in a responsive design. Just add the code bellow to your `gulpfile.js`:

```js
process.env.ABRAIA_KEY='your_api_key'

const gulp = require('gulp')
const abraia = require('gulp-abraia')

gulp.task('resize', () => {
  return gulp.src('images/**')
    .pipe(abraia([
      { width: 1920, output: '{name}-1920.{ext}' },
      { width: 1125, output: '{name}-1125.{ext}' },
      { width: 750, output: '{name}-750.{ext}' },
      { width: 375, output: '{name}-375.{ext}' }
    ]))
    .pipe(gulp.dest('public'))
})

gulp.task('watch', () => {
  gulp.watch('images/*', gulp.series('resize'))
})
```

For instance, with the above simple code you get three optimized variants ready to be used in your mobile first responsive design (optimized for iPhones).

## Image editing

Use the [web image editor](https://abraia.me/console/editor) to easily create templates which automate your bulk operations. For instance, create a branding template (e.g. abraia.atn) and watermark and optimize all your web images at once.

![Abraia image editor](https://github.com/abraia/gulp-abraia/raw/master/images/console-editor.jpg)

```js
gulp.task('watermark', () => {
  return gulp.src('images/**')
    .pipe(abraia([
      { width: 750, action: 'abraia.atn', output: '{name}-brand.{ext}' }
    ]))
    .pipe(gulp.dest('public'))
})
```

### Video optimization

Optimize your short videos for web (up to 5 minutes), and get all your videos perfectly optimized.

```js
gulp.task('variants', () => {
  return gulp.src('videos/*')
    .pipe(abraia([
      { height: 720, output: '{name}-720p.mp4' },
      { height: 720, output: '{name}-720p-hevc.mp4', format: 'hevc' },
      { height: 720, output: '{name}-720p.webm' }
    ]))
    .pipe(gulp.dest('output'))
})
```

You can also use the wysiwyg web editor to edit and create templates to automate your cropping, resizing, and overlaying operations (like branding and watermarking) and get all your videos ready for web and social media, using a watch folder.

### Renaming options

Output name policies are defined with a syntax like Javascript ES6 template literals without $ simbols. The input file name and its extensin are defined as `name` and `ext` variables. So, you just need to build your output path using `{name}` as the placeholder for the file name, and `{ext}` for the original file extension.

For instance:

- You can append a suffix to the fie name with `output: '{name}-thumb.{ext}'`.
- You can store the new file in a subfolder just with `output: '750/{name}.{ext}'`.
- You can convert images and videos writing the file extension like `output: '{name}.webp'`.

## License

This software is licensed under the MIT License. [View the license](LICENSE).
