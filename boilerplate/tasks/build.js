'use strict';

var gulp = require('gulp');
var styl = require('gulp-stylus');
var esperanto = require('esperanto');
var map = require('vinyl-map');
var jetpack = require('fs-jetpack');

var utils = require('./utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

var paths = {
    jsCodeToTranspile: [
        'app/**/*.js',
        '!app/node_modules/**',
        '!app/bower_components/**',
        '!app/vendor/**'
    ],
    toCopy: [
        'app/node_modules/**',
        'app/bower_components/**',
        'app/vendor/**',
        '*.html'
    ],
}

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function(callback) {
    return destDir.dirAsync('.', { empty: true });
});


var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: paths.toCopy
    });
};
gulp.task('copy', ['clean'], copyTask);
gulp.task('copy-watch', copyTask);


var transpileTask = function () {
    return gulp.src(paths.jsCodeToTranspile)
    .pipe(map(function(code, filename) {
        var transpiled = esperanto.toAmd(code.toString(), { strict: true });
        return transpiled.code;
    }))
    .pipe(gulp.dest(destDir.path()));
};
gulp.task('transpile', ['clean'], transpileTask);
gulp.task('transpile-watch', transpileTask);


var stylTask = function () {
    return gulp.src('app/stylesheets/main.styl')
    .pipe(styl())
    .pipe(gulp.dest(destDir.path('stylesheets')));
};
gulp.task('styl', ['clean'], stylTask);
gulp.task('styl-watch', stylTask);


// Add and customize OS-specyfic and target-specyfic stuff.
gulp.task('finalize', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');
    switch (utils.getBuildTarget()) {
        case 'release':
            // Hide dev toolbar if doing a release.
            manifest.window.toolbar = false;
            break;
        case 'test':
            // Add "-test" suffix to name, so NW.js will write all
            // data like cookies and locaStorage into separate place.
            manifest.name += '-test';
            // Change the main entry to spec runner.
            manifest.main = 'spec.html';
            break;
        case 'development':
            // Add "-dev" suffix to name, so NW.js will write all
            // data like cookies and locaStorage into separate place.
            manifest.name += '-dev';
            break;
    }
    destDir.write('package.json', manifest);

    projectDir.copy('resources/icon.png', destDir.path('icon.png'));
});


gulp.task('watch', function () {
    gulp.watch(paths.jsCodeToTranspile, ['transpile-watch']);
    gulp.watch(paths.toCopy, ['copy-watch']);
    gulp.watch('*.styl', ['styl-watch']);
});


gulp.task('build', ['transpile', 'styl', 'copy', 'finalize']);
