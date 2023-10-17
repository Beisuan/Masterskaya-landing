import gulp from 'gulp';
import browserSync from 'browser-sync';
import minifyJs from 'gulp-minify';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourceMaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import autoPrefixer from 'gulp-autoprefixer';
import purgeCss from 'gulp-purgecss';
import plumber from 'gulp-plumber';
import fileinclude from 'gulp-file-include';
import remove from 'del';
import gulpIf from 'gulp-if';
import flatMap from 'gulp-flatmap';
import replace from 'gulp-replace';
import webp from 'gulp-webp';
import rename from 'gulp-rename';

const sass = gulpSass(dartSass);
const { src, dest, task, watch, series } = gulp;

/* Settings */
var outputDir = 'dist';
var isProd = false;

function setProdEnv(done) {
  outputDir = 'prod';
  isProd = true;
  done();
}

var paths = {
  images: {
    src: 'app/**/*.{ico,jpeg,jpg,png,gif,webp}',
  },

  fonts: {
    src: 'app/**/*.{eot,svg,ttf,woff,woff2}',
  },

  html: {
    src: 'app/**/*.html',
    execlud: ['app/html-partials{,/**}'],
  },

  customStyles: {
    src: 'app/**/*.{scss,css}',
    execlud: [
      'app/**/_*',
      'app/assets/styles/sass{,/**}',
      'app/assets/styles/vendors/**/*',
    ],
  },

  vendorStyles: {
    src: 'app/**/*.{scss,css}',
    execlud: [
      'app/assets/styles/sass{,/**}',
      'app/assets/styles/style{.css,.scss}',
    ],
  },

  scripts: {
    src: 'app/**/*.js',
    execlud: [],
  },
};

/* Gulp tasks */
function removeOldFolders() {
  return remove(outputDir, { force: true });
}

function browser_sync() {
  browserSync({
    server: {
      baseDir: `${outputDir}/`,
    },
    options: {
      reloadDelay: 250,
    },
    notify: false,
  });
}

function images() {
  return src(paths.images.src)
    .pipe(plumber())
    .pipe(gulpIf(isProd, webp()))
    .pipe(dest(outputDir))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function fonts() {
  return src(paths.fonts.src)
    .pipe(plumber())
    .pipe(dest(outputDir))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function html() {
  return src([
    paths.html.src,
    ...paths.html.execlud.map(function (item) {
      return '!' + item;
    }),
  ])
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: 'app/html-partials',
        context: {
          isProd: isProd,
        },
      })
    )
    .pipe(
      flatMap(function (stream, file) {
        if (process.platform == 'win32') {
          var route = '../'.repeat(
            (file.path.split('app\\').pop().match(/\\/g) || []).length
          );
          var fileName = file.path
            .slice(file.path.lastIndexOf('\\') + 1)
            .replace('.html', '');
        } else {
          var route = '../'.repeat(
            (file.path.split('app/').pop().match(/\//g) || []).length
          );
          var fileName = file.path
            .slice(file.path.lastIndexOf('/') + 1)
            .replace('.html', '');
        }
        return stream
          .pipe(replace('$$/', route))
          .pipe(replace('<title></title>', `<title>${fileName}</title>`));
      })
    )
    .pipe(gulpIf(isProd, replace('.jpg', '.webp')))
    .pipe(gulpIf(isProd, replace('.jpeg', '.webp')))
    .pipe(gulpIf(isProd, replace('.png', '.webp')))
    .pipe(gulpIf(isProd, replace('.gif', '.webp')))
    .pipe(dest(outputDir))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function styles(parameterPaths) {
  return src([
    parameterPaths.src,
    ...parameterPaths.execlud.map(function (item) {
      return '!' + item;
    }),
  ])
    .pipe(gulpIf(!isProd, sourceMaps.init()))
    .pipe(sass())
    .pipe(
      autoPrefixer({
        cascade: true,
      })
    )
    .pipe(gulpIf(!isProd, sourceMaps.write('/')))
    .pipe(dest(outputDir))
    .pipe(
      gulpIf(
        isProd,
        purgeCss({
          content: [paths.html.src],
        })
      )
    )
    .pipe(gulpIf(isProd, replace('.jpg', '.webp')))
    .pipe(gulpIf(isProd, replace('.jpeg', '.webp')))
    .pipe(gulpIf(isProd, replace('.png', '.webp')))
    .pipe(gulpIf(isProd, replace('.gif', '.webp')))
    .pipe(gulpIf(isProd, cleanCSS()))
    .pipe(gulpIf(isProd, rename({ suffix: '-min' })))
    .pipe(gulpIf(isProd, dest(outputDir)))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function customStyles(done) {
  styles(paths.customStyles);
  done();
}

function vendorStyles(done) {
  styles(paths.vendorStyles);
  done();
}

function scripts() {
  return src([
    paths.scripts.src,
    ...paths.scripts.execlud.map(function (item) {
      return '!' + item;
    }),
  ])
    .pipe(plumber())
    .pipe(dest(outputDir))
    .pipe(
      gulpIf(
        isProd,
        minifyJs({
          ext: {
            src: '.js',
            min: '.js',
          },
          mangle: false,
          noSource: true,
          ignoreFiles: ['.combo.js', '.min.js'],
        })
      )
    )
    .pipe(gulpIf(isProd, dest(outputDir)))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function watch_files() {
  watch(paths.images.src, images);
  watch(paths.fonts.src, fonts);
  watch(paths.html.src, html);
  watch(paths.customStyles.src, customStyles);
  watch(
    [
      paths.vendorStyles.src,
      ...paths.vendorStyles.execlud.map(function (item) {
        return '!' + item;
      }),
    ],
    vendorStyles
  );
  watch(paths.scripts.src, scripts);

  const mainWatcher = watch('app/**/*');
  mainWatcher.on('all', function (event, path) {
    if (event == 'unlink' || event == 'unlinkDir') {
      if (process.platform == 'win32') {
        var distPath = path.replace('app\\', `${outputDir}\\`);
      } else {
        var distPath = path.replace('app/', `${outputDir}/`);
      }
      remove(distPath, { force: true });
      console.log(`${path} was removed`);
      console.log(`${distPath} was removed`);
    }
  });
  browser_sync();
}

task(
  'default',
  series(
    removeOldFolders,
    images,
    fonts,
    html,
    customStyles,
    vendorStyles,
    scripts,
    watch_files
  )
);

task(
  'prod',
  series(
    setProdEnv,
    removeOldFolders,
    images,
    fonts,
    html,
    customStyles,
    vendorStyles,
    scripts,
    function prodFinished(done) {
      console.log('Your final "prod" folder is ready');
      done();
    }
  )
);
