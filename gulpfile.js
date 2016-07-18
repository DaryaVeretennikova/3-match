'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var buble = require('gulp-buble');
var notify = require('gulp-notify');
var connect = require('gulp-connect');

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

//run a webserver
gulp.task('connect', function(){
  connect.server({
      root: ['dist'],
      port: 8080,
      base: 'http://localhost',
      livereload: true
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
        .pipe(connect.reload());
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
gulp.task('watch', function () {
  gulp.watch(paths.src.scripts, ['js']);
});

// Run
gulp.task('default', ['connect', 'watch']);
