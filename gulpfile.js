var source = require('vinyl-source-stream');
var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var path = require('path');
var myth = require('gulp-myth');

var baseDir = './app';
var scriptsDir = baseDir + '/scripts';
var buildDir = './public/scripts/';

/** ------- Javascript ----------- **/

function buildScript(file, watch) {
  var args = watchify.args;
  args.entries = [scriptsDir + '/' + file];

  var bundler = browserify(args);
  if (watch) bundler = watchify(bundler);

  bundler.transform(reactify, {
    harmony: true
  });


/** ------- // JS Bundle helper ----------- **/

  function rebundle() {
    var stream = bundler.bundle();

    return stream.on('error', notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
      }))
      .pipe(source(file))
      .pipe(gulp.dest(buildDir));
  }

  bundler.on('update', function() {
    rebundle().pipe(notify('Build javascript'));
  });

  return rebundle();
}


/** ------- // JS ----------- **/

gulp.task('js', function() {
  return buildScript('main.js', false);
});

gulp.task('watch-js', ['js'], function() {
  return buildScript('main.js', true);
});

/** ------- // CSS ----------- **/

gulp.task('css', function() {
  return gulp.src(baseDir + '/style/main.css')
    .pipe(myth())
    .pipe(gulp.dest('./public/style'))
    .pipe(notify("Build css"));
});

gulp.task('watch-css', function() {
    return gulp.watch(baseDir + '/style/**/*.css', ['css']);
});


gulp.task('watch', ['watch-js', 'watch-css']);

gulp.task('default', ['css', 'js']);
