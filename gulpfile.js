/* REQUIRED MODULES AND PLUGINS */
const   gulp = require('gulp'),
        htmlclean = require('gulp-htmlclean'), //html whitespace remover
        sass = require('gulp-sass'),//sass compiler
        uglify = require('gulp-uglify'),// js minifier
        useref = require('gulp-useref'), //concatenates js & css files and changes references in html to dest
        //concat = require('gulp-concat'), //concatenates js files
        stripdebug = require('gulp-strip-debug'), //removes console and debug statements from js

        folder = {
            src: 'app/',
            build: 'dist/'
        }
