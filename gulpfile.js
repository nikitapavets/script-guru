var gulp = require('gulp');
var connect = require('gulp-connect-php');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var path = require('path');
var lessautoprefix = require('less-plugin-autoprefix');
var browsersync  = require('browser-sync');

gulp.task('connect:sync', function () {
    connect.server({}, function () {
        browsersync({
            proxy: 'http://script-guru/',
            notify: false
        });
    });
});

gulp.task('scripts', function() {
    return gulp.src('./assets/js/**/*.js')
    .pipe(sourcemaps.init()) 
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write()) 
    .pipe(gulp.dest('./public/scripts/'))
});

gulp.task('styles', function () {
    return gulp.src('./assets/less/**/*.less')
    .pipe(sourcemaps.init()) 
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ],
      plugins: [new lessautoprefix({ browsers: ['last 5 versions'] })]
    }))
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/styles/'))
    .pipe(browsersync.reload({stream: true}));
});

gulp.task('watch', ['connect:sync'], function () {
    gulp.watch('./assets/less/**/*.less', ['styles']);
    gulp.watch('./assets/js/**/*.js', ['scripts'], browsersync.reload);
    gulp.watch('./**/*.html', browsersync.reload);
});

gulp.task('build', ['styles', 'scripts']);

gulp.task('default', ['watch']);