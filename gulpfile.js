const {
  series,
  parallel,
  watch,
  dest,
  src
} = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const {
  rollup
} = require('rollup');
const {
  terser
} = require('rollup-plugin-terser');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve').default;
const babel = require('@rollup/plugin-babel').default;
const connect = require('gulp-connect');

// babel配置
const babelConfig = {
  babelHelpers: 'bundled',
  ignore: ['node_modules'],
};

// 清除dist目录
function distClean() {
  return src('dist', {
    allowEmpty: true
  }).pipe(clean());
}

// 移动html模板
function html() {
  return src('src/*.html').pipe(dest('dist'));
}

function compileEjs() {
  return src('src/pages/*.ejs')
    .pipe(ejs())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(dest('dist'));
}

function publicFile() {
  return src('public/**').pipe(dest('dist'));
}

// 编译scss文件
function compileSass() {
  return src('src/style/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(minify({
      compatibility: 'ie11'
    }))
    .pipe(dest('dist/css'));
}

function server(cb) {
  connect.server({
    root: 'dist',
    port: '8081',
    livereload: true,
  });
  cb();
}

function srcWatch() {
  watch(['src/pages/**/*.ejs'], series(compileEjs, reload));
  watch(['public/**'], series(publicFile, reload));
  watch(['src/style/**/*.scss'], series(compileSass, reload));
}

function reload() {
  return src('dist/*.html').pipe(connect.reload());
}

exports.build = series(distClean, parallel(compileEjs, compileSass, publicFile));

exports.dev = series(distClean, parallel(compileEjs, compileSass, publicFile), server, srcWatch);