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

gulp.task('default', ['watch', 'copy-fonts', 'copy-images', 'build-js'])

gulp.task('deploy', ['build-css', 'build-js', 'copy-fonts', 'copy-images'], function () {
  return gulp.src('assets/**/*')
    .pipe(deploy({remoteUrl: 'git@github.com:ridon/ridon.github.io.git', branch: 'master'}))
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

gulp.task('watch', function() {
  // gulp.watch('source/js/**/*.js', ['jshint'])
  gulp.watch('gulpfile.config.js', ['build-js'])
  gulp.watch('source/js/**/*.js', ['build-js'])
  gulp.watch('source/sass/**/*.scss', ['build-css'])
  gulp.watch('source/fonts/*', ['copy-fonts'])
  gulp.watch('source/img/*', ['copy-images'])
})
