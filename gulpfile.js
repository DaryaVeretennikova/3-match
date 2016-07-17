'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var buble = require('gulp-buble');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');

/**
 * Error function for plumber
 * @param  {Object} error
 */
var onError = notify.onError('Ошибка в <%= error.plugin %>');

var paths = {};

paths.srcBase = 'src';
paths.src = {};
paths.src.scriptsBase = paths.srcBase + '/scripts';
paths.src.scripts = paths.src.scriptsBase + '/*.js';

paths.buildBase = 'dist';
paths.build = {};
paths.build.scripts = paths.buildBase + '/scripts';

//copy libs from node modules
gulp.task('copy-assets', function() {
    var assets = {
        js: [
            './node_modules/phaser/build/phaser.min.js'
        ]
    };
    _(assets).forEach(function(assets, type) {
        gulp.src(assets).pipe(gulp.dest(paths.build.scripts + '/lib/' + type));
    });
});

//ES6 to ES5
gulp.task('buble', function() {
    return gulp.src(paths.src.scripts)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(buble())
        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.build.scripts))
        .pipe(livereload());
});

//JS task
gulp.task('js', [
    'buble'
]);

//Build task
gulp.task('build', [
    'js'
]);

//Watch task
gulp.task('watch', ['build'], function watch() {
    livereload.listen(function(err) {
        if (err) {
            return console.log('Livereload start failed');
        }
    });

    gulp.watch(paths.src.scripts, ['js']);
});

// Run
gulp.task('default', ['build']);
