// generated on 2016-04-11 using generator-webapp 2.0.0
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

//a list of all JS source to pull into header
var headerSrc = [
  //Modernizr enables HTML5 elements & feature detects for optimal performance.
  //Include html5shiv 3.6. Our version is a custom build.
  //Create your own custom Modernizr build: www.modernizr.com/download/
  'app/scripts/libs/Modernizr/modernizr-2.6.2.custom.js',
  'app/scripts/libs/jQuery/jquery-1.11.0.js',
  'app/scripts/libs/jQuery/jquery-migrate-1.2.1.min'
];
var footerSrc = [
  'app/scripts/custom/main.js'
];

//compile sass into final css
gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss', {base:'app/styles'})
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      //includePaths: ['.','./app/styles','./app/styles/variables','./app/styles/components','./app/styles/components/bootstrap-styles']
      includePaths: ["app/styles","app/src/bootstrap-4.0.0.alpha.2/scss","bower_components/bootstrap-sass/assets/stylesheets"]
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write()) //comment this line if sourcemaps not needed
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

//bring together all script files
gulp.task('scripts', function() {
  gulp.src(headerSrc)
    .pipe($.concat('header.js'))
    .pipe($.uglify({
      "mangle": false,
      "compress": false,
      "preserveComments": "all"
    }))
    .pipe(gulp.dest('.tmp/scripts'));

  gulp.src(footerSrc)
    .pipe($.concat('footer.js'))
    .pipe($.uglify({
      "mangle": false,
      "compress": false,
      "preserveComments": "all"
    }))
    .pipe(gulp.dest('.tmp/scripts'));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint('app/scripts/custom/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

//gulp.task('serve', ['lint','scripts', 'styles', 'fonts'], () => {
gulp.task('serve', ['scripts', 'styles', 'fonts'], () => {
  browserSync({
    notify: false,
    ui: false,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    },
    https: true
  });

  gulp.watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['lint','scripts']);
  gulp.watch('app/fonts/**/*', ['fonts']);
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
