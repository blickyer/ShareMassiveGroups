/*
* Dependencias
*/
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    stylus = require('gulp-stylus'),
    filter = require('gulp-filter'),
    connect = require('gulp-connect');
    //minifyHtml = require('gulp-minify-html');

/*
* Install Bower Dependencies
*/
gulp.task('install-bower', function () {

});

/*
* Install Node Dependencies
*/
gulp.task('install-node', function () {

});

/*
* Min JS
*/
gulp.task('js', function () {
    gulp.src([
            'static/components/angular/angular.js',
            'static/js/*.js'
            ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload());
});

/*
*   MIN CSS
*/
gulp.task('css', function () {
    var filterStyl = filter('static/stylus/*.styl');

    gulp.src([
            'static/components/normalize.css/normalize.css',
            'static/components/fontawesome/css/font-awesome.css',
            'static/stylus/*.styl'
            ])
        .pipe(filterStyl)
        .pipe(stylus())
        .pipe(filterStyl.restore())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        root: 'build',
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src(['public/*.html', 'public/views/**/*.html'])
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});

/*
*   Watch
*/
gulp.task('watch', function () {
    // Watch .styl files
    gulp.watch('public/stylus/*.styl', ['css']);

    // Watch .js files
    gulp.watch('public/js/*.js', ['js']);

    gulp.watch(['public/*.html', 'public/views/**/*.html'], ['html']);

    // // Create LiveReload server
    // livereload.listen({
    //     //port: 1000
    // });

    // // Watch any files in dist/, reload on change
    // gulp.watch(['build/**']).on('change', livereload.changed);

    // gulp.watch(['**/*.html']).on('change', livereload.changed);

});

/*
*   DEFAULT
*/
gulp.task('default', function () {
    gulp.start('connect', 'css', 'js', 'html', 'watch');
});

