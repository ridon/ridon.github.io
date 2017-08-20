var config = require('./gulpfile.config.js')
var gulp = require('gulp')
var gulpUtil = require('gulp-util')
var jshint = require('gulp-jshint')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var concatUtil = require('gulp-concat-util')
var plumber = require('gulp-plumber')
var deploy = require('gulp-gh-pages')
var eventStream = require('event-stream')
var htmlMinify = require('gulp-htmlmin')
var removeCssComments = require('gulp-strip-css-comments')
var connect = require('gulp-connect')
var opn = require('opn')

gulp.task('default', ['watch', 'copy-fonts', 'copy-images', 'build-js', 'build-css'], function () {
  connect.server()
  opn('http://localhost:8080')
})

gulp.task('deploy', ['build-deploy'], function () {
  return gulp.src(['dist/**/*'])
    .pipe(deploy({origin: 'origin', branch: 'master'}))
})

gulp.task('jshint', function() {
  return gulp.src('source/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('build-css', function() {
  return gulp.src('source/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(rename({suffix: '.min'}))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename({basename: 'ridon', suffix: '.min'}))
    .pipe(removeCssComments({preserve: false}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('assets/css'))
})

gulp.task('build-js', function() {
  return gulp.src(config.js)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concatUtil('app.js', {sep: ';'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(rename({basename: 'ridon', suffix: '.min'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('assets/js'))
})

gulp.task('copy-fonts', function () {
  return gulp.src('source/fonts/**/*')
    .pipe(gulp.dest('assets/fonts'))
})

gulp.task('copy-images', function () {
  return gulp.src('source/img/*')
    .pipe(gulp.dest('assets/img'))
})

gulp.task('build-deploy', ['build-css', 'build-js', 'copy-fonts', 'copy-images'], function () {
  return eventStream.concat(
    gulp.src('assets/**/*')
      .pipe(gulp.dest('dist/assets')),
    gulp.src('index.html')
      .pipe(htmlMinify({collapseWhitespace: true}))
      .pipe(gulp.dest('dist')),
    gulp.src('CNAME')
      .pipe(gulp.dest('dist'))
  )
})

gulp.task('watch', function() {
  // gulp.watch('source/js/**/*.js', ['jshint'])
  gulp.watch('gulpfile.config.js', ['build-js'])
  gulp.watch('source/js/**/*.js', ['build-js'])
  gulp.watch('source/sass/**/*.scss', ['build-css'])
  gulp.watch('source/fonts/*', ['copy-fonts'])
  gulp.watch('source/img/*', ['copy-images'])
})
