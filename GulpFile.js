const gulp = require("gulp");
const { src, dest, watch, series } = require("gulp");
const imgOp = require('gulp-imagemin');
const HtmlOp = require('gulp-htmlmin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync');

let globs = {
    html: 'project/*.html',
    css: "project/css/**/*.css",
    js: 'project/js/**/*.js',
    images: 'project/pics/*'

}



//HTML:
function htmlOptimization() {
    return src(globs.html).pipe(HtmlOp({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'))
}

exports.html = htmlOptimization;

//CSS
function cssOptimization() {
    return src(globs.css).pipe(concat('style.min.css')).pipe(cleanCSS())
        .pipe(dest('dist/assets/CSS'))
}
exports.css = cssOptimization

//JavaScript
function jsOptimization() {
    return src(globs.js, { sourcemaps: true }).pipe(concat('all.min.js')).pipe(terser())
        .pipe(dest('dist/Assets/JavaScript', { sourcemaps: '.' }))
}

exports.javascript = jsOptimization;

//Images
function imgOptimization() {
    return gulp.src(globs.images).pipe(imgOp()).pipe(gulp.dest('dist/assets/Images'));
}

exports.img = imgOptimization;





function serve(x) {
    browserSync({
        server: {
            baseDir: 'dist/'
        }
    });
    x()
}

function realoding(y) {
    browserSync.reload()
    y()
}


function watchTask() {
    watch(globs.html, series(minifyHTML, realoding));
    watch(globs.css, series(cssMinify, realoding));
    watch(globs.js, series(jsMinify, realoding));

}
exports.default = series((imgOptimization, jsOptimization, htmlOptimization), serve, watchTask)

