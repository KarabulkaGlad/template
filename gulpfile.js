const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();

function html() {
  return gulp.src('src/**/*.html')
  .pipe(plumber())
  .pipe(gulp.dest('dist/'));
}

function css() {
  return gulp.src('src/**/*.css')
  .pipe(plumber())
  .pipe(concat('bundle.css'))
  .pipe(gulp.dest('dist/'));
}

function images() {
  return gulp.src('src/img/**/*.{jpg,png,svg,gif,ico,webp,avif}')
  .pipe(gulp.dest('dist/img'));
}

function fonts() {
  return gulp.src('src/fonts/**/*.{css,eot,ttf,woff,woff2}')
  .pipe(gulp.dest('dist/fonts'));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/**/*.css'], css);
  gulp.watch(['src/img/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

const build = gulp.series(clean, gulp.parallel(html, css, images, fonts));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.clean = clean;
exports.images = images;
exports.css = css;
exports.html = html;
exports.fonts = fonts;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
