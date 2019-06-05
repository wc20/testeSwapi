var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    path        = require('path'),
    gulpif      = require('gulp-if'),
    jshint      = require('gulp-jshint'),
    jshintStyle = require('jshint-stylish'),
    minifycss   = require('gulp-minify-css'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-compass'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    gutil       = require('gulp-util'),
    fs          = require('fs');

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
 
gulp.task('sync', function () {
    browserSync.reload();
});

function customPlumber(errTitle) { 
  return plumber({
    errorHandler: notify.onError({
          // Customizing error title
          title: errTitle || "Error running Gulp",
          message: "Error: <%= error.message %>",
          sound: "Glass"
        })
    });
}

gulp.task('sass', function(){
    gulp.src(['assets/sass/**/*.scss'])
        .pipe(customPlumber('Erro no SCSS'))
        .pipe(sass({
            project: __dirname,
            css: './build/css',
            sass: './assets/sass',
            sourcemap: true,
            debug : true,
            style: 'compressed'
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function () {
    return gulp.src('assets/js/**/*.js')
      .pipe(plumber({
          errorHandler: function (error) {
              console.log(error.message);
              this.emit('end');
          }
      }))
      .pipe(jshint())
      .pipe(jshint.reporter(jshintStyle))
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest('build/js/'))
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('build/js/'))
      .pipe(browserSync.reload({ stream: true }))
});

gulp.task('libsJS', function () {
    var plugins = JSON.parse(fs.readFileSync('./plugins-js.json'));
    for (var i = 0; plugins.length > i; i++) {
        gulp.src(plugins[i].arquivos)
            .pipe(concat(plugins[i].nome_arquivo + '-lib.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./build/js'))
            .pipe(browserSync.reload({ stream: true }));
    }
});

gulp.task('libsCSS', function () {
    var plugins = JSON.parse(fs.readFileSync('./plugins-css.json'));
    for (var i = 0; plugins.length > i; i++) {
        gulp.src(plugins[i].arquivos)
            .pipe(concat(plugins[i].nome_arquivo + '-lib.min.css'))
            .pipe(minifycss())
            .pipe(gulp.dest('./build/css'))
            .pipe(browserSync.reload({ stream: true }));
    }
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch("assets/sass/**/*.scss", ['sass']);
    gulp.watch("assets/js/**/*.js", ['scripts']);
    gulp.watch("**/*.html", ['sync']);
    gulp.watch("./plugins-js.json", ['libsJS']);
    gulp.watch("./plugins-css.json", ['libsCSS']);
   
});
