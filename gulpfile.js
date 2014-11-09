var source = require('vinyl-source-stream');
var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var path = require('path');
var less = require('gulp-less');

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

gulp.task('js', function() {
  return buildScript('main.js', false);
});

gulp.task('watch-js', ['js'], function() {
  return buildScript('main.js', true);
});

/** ------- // Javascript ----------- **/

/** ------- LESS ----------- **/

gulp.task('less', function () {
  return gulp.src(baseDir + '/style/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'style') ]
    }))
    .pipe(gulp.dest('./public/style'))
    .pipe(notify('Build Less'));
});

gulp.task('watch-less', function () {
  return gulp.watch(baseDir + '/style/**/*.less', ['less']);
});

/** ------- // LESS ----------- **/


/** ------- Convenience ----------- **/

gulp.task('watch', ['watch-js', 'watch-less']);

gulp.task('default', ['less', 'js']);

/** ------- // Convenience ----------- **/
