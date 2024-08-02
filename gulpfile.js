const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaQuery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');
const gulpPug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));

function html() {
  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true
  };
  return gulp.src('src/**/*.html')
  .pipe(plumber())
  .on('data', function(file) {
    const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options));
    return file.contents = buferFile;
  })
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.reload({stream: true}));
}

function css() {
  const plugins = [
    autoprefixer(),
    mediaQuery(),
    cssnano()
  ];
  return gulp.src('src/**/*.css')
  .pipe(plumber())
  .pipe(concat('bundle.css'))
  .pipe(postcss(plugins))
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/img/**/*.{jpg,png,svg,gif,ico,webp,avif}')
  .pipe(gulp.dest('dist/img'))
  .pipe(browserSync.reload({stream: true}));
}

function fonts() {
  return gulp.src('src/fonts/**/*.{eot,ttf,woff,woff2}')
  .pipe(gulp.dest('dist/fonts'))
  .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.pug'], pug);
  gulp.watch(['src/**/*.scss'], scss);
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

function pug() {
  return gulp.src('src/pages/**/*.pug')
  .pipe(gulpPug())
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.reload({stream: true}));
}


function scssLayout() {
  const plugins = [
    autoprefixer(),
    mediaQuery(),
    cssnano()
  ];
  return gulp.src('src/layouts/default.scss')
  .pipe(sass())
  .pipe(concat('bundle.css'))
  .pipe(postcss(plugins))
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.reload({stream: true}));
}

function scssPages() {
  const plugins = [
    autoprefixer(),
    mediaQuery(),
    cssnano()
  ];

  return gulp.src('src/pages/*.scss')
  .pipe(sass())
  .pipe(postcss(plugins))
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.reload({stream: true}));
}

const scss = gulp.parallel(scssLayout, scssPages)
const build = gulp.series(clean, gulp.parallel(pug, scss, images, fonts));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.clean = clean;
exports.images = images;
exports.css = css;
exports.html = html;
exports.fonts = fonts;
exports.pug = pug;
exports.scss = scss;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
