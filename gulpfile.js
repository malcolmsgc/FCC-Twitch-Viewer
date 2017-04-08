/* REQUIRED MODULES AND PLUGINS */
const   gulp = require('gulp'),
        htmlclean = require('gulp-htmlclean'), //html whitespace remover
        sass = require('gulp-sass'),//sass compiler
        cssnano = require('gulp-cssnano'), //minify css
        stripdebug = require('gulp-strip-debug'), //removes console and debug statements from js
        uglify = require('gulp-uglify'),// js minifier
        useref = require('gulp-useref'), //concatenates js & css files and changes references in html to dest
        //concat = require('gulp-concat'), //concatenates js 
        gulpIf = require('gulp-if'),
        autoprefixer = require('gulp-autoprefixer'),
        newer = require('gulp-newer');
        gulpSequence = require('gulp-sequence') //task sequencer
        folder = {
            src: 'app/',
            build: 'dist/'
        }

gulp.task('html', function () {
    const   source = `${folder.src} + 'html/**/*.+(html|htm)`,
            dest = `${folder.build} + 'html/`;
    return
    gulp.src(source)
    .pipe(newer(dest))
    .pipe(gulp.dest(dest))
});

gulp.task('css', ['sass'], function () {
    const   source = `${folder.src} + 'css/**/*.css`;
            dest = `${folder.build} + 'css/`;
    return gulp.src(source)
    .pipe ( newer(dest) )
    .pipe ( autoprefixer ( {
            browsers: ['last 2 versions'],
            cascade: false
        }) )
    .pipe ( cssnano() )
    .pipe( gulp.dest(dest) )
});

gulp.task('sass', function () {
    const   source = `${folder.src} + 'scss/**/*.scss`;
            dest = `${folder.src} + 'css/`;
  return gulp.src(source)
    .pipe(newer(dest))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dest));
});
 
//gulp.task('sass:watch', function () {
//  gulp.watch('./scss/**/*.scss', ['sass']);
//});
