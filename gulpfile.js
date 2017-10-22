// 'use strict';

var gulp = require('gulp'),
  prettyError = require('gulp-prettyerror'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  eslint = require('gulp-eslint'),
  browserSync = require('browser-sync').create();

var supported = [
  'last 2 versions',
]

gulp.task('sass', function () {
  gulp.src('./sass/*.scss')
    .pipe(prettyError())
    .pipe(sass())
    .pipe(gulp.dest('./build/css'))
    .pipe(cssnano({
      autoprefixer: {
        browsers: supported,
        add: true
      }
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./build/css'));

  gulp.src('./sass/style-stretch.scss')
    .pipe(prettyError())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(cssnano())
    .pipe(rename('style-stretch.min.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('scripts', ['lint'], function () {
  gulp.src('./js/*.js')
    // Optional to use here...kinda redundant because eslint reports errors
    // .pipe(prettyError())
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./build/js'))
});

gulp.task('lint', function () {
  return gulp.src(['./js/*.js'])
    // Also need to use it here...
    // .pipe(prettyError())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  console.log('browser-sync is Top Hat! 🎩')
  gulp.watch(['build/css/*.css', 'build/js/*.js', 'index.html']).on('change', browserSync.reload);
});

gulp.task('watch', function () {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/*.js', ['scripts']);
});

gulp.task('default', ['watch', 'browser-sync']);