'use strict';

const fs = require("fs");

/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
let path = {
  build: {
    html: 'main/build/',
    js: 'main/build/user/js/',
    css: 'main/build/user/css/',
    img: 'main/build/user/img/',
    svg: 'main/build/user/svg/',
    fonts: 'main/build/user/fonts/',
  },
  src: {
    html: 'main/src/*.html',
    vue: 'main/src/vue/vueTemplate.html',
    js: 'main/src/main.js',
    style: 'main/src/main.scss',
    img: 'main/src/assets/img/**/*.*',
    svg: 'main/src/assets/svg/*.svg',
    fonts: 'main/src/assets/fonts/**/*.ttf'
  },
  watch: {
    html: 'main/src/**/*.html',
    js: 'main/src/**/**/*.js',
    css: 'main/src/**/*.scss',
    img: 'main/src/assets/img/*.*',
    svg: 'main/src/assets/svg/*.svg',
    fonts: 'main/src/assets/fonts/*.ttf'
  },
  folders: [
    'EL_FM_Profproba_Gornorabochiy',
    'EL_FM_Profproba_Apparatchik_v_him_prom',
    'EL_FM_Profproba_Svarshik',
    'EL_FM_Profproba_Mashinist_GVM',
    'EL_FM_Profproba_Mashinist_obogaschenia',
    'EL_FM_Profproba_Slesar_po_obslyzhivaniy_teplovyh_setey',
    'EL_FM_Profproba_Ekolog',
    'EL_FM_Profproba_Mashinist_Parovyh_turbin',
    'EL_FM_Profproba_Slesar_KIPiA',
    'EL_FM_Profproba_Apparatchik_himvodoochistki',
    'EL_FM_Profproba_Apparatchik_ugleobogascheniya',
    'EL_FM_Profproba_Mashinist_Energobloka',
    'EL_FM_Profproba_Tehnolog_v_gornodobyvaushey_promyshlennosti',
    'EL_FM_Profproba_Mashinist-obhodchik',
    'EL_FM_Profproba_Inzhener_teplotehnik',
    'EL_FM_Profproba_Electroslesar_po_obsluzhivaniu_i_remontu_oborudovania',
    'EL_FM_Profproba_Slesar_po_obsluzhivaniu_i_remontu_oborudovania',
    'EL_FM_Profproba_Electromonter_po_remontu_i_obsluzhivaniu_electrooborudovania',
    'EL_FM_Profproba_Mashinist_avtogreydera',
  ],
  clean: './main/build/*'
};

/* настройки сервера */
let config = {
  server: {
    baseDir: './main/build'
  },
  notify: false
};

/* подключаем gulp и плагины */
let gulp = require('gulp'), // подключаем Gulp
  webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
  plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
  rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
  sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
  sass = require('gulp-sass')(require('sass')), // модуль для компиляции SASS (SCSS) в CSS
  autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
  cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
  uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
  cache = require('gulp-cache'), // модуль для кэширования
  imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
  jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg
  pngquant = require('imagemin-pngquant'), // плагин для сжатия png
  rimraf = require('gulp-rimraf'), // плагин для удаления файлов и каталогов
  rename = require('gulp-rename'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  ttf2eot = require('gulp-ttf2eot'),
  svgSprite = require('gulp-svg-sprite');//svg sprite


/* задачи */

// запуск сервера
gulp.task('webserver', () => {
  webserver(config);
});

// сбор html
gulp.task('html:build', () => {
  return gulp.src(path.src.html) // выбор всех html файлов по указанному пути
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) // импорт вложений
    .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
    .pipe(webserver.reload({
      stream: true
    })); // перезагрузка сервера
});
// сбор vue
gulp.task('vue:build', (f) => {
  f();

  path.folders.map((element) => {
    return gulp.src(path.src.vue)
      .pipe(plumber()) // отслеживание ошибок
      .pipe(rigger()) // импорт вложений
      .pipe(gulp.dest('course/' + element + '/1/user/vue/')) // выкладывание готовых файлов
  });
});

// сбор стилей
gulp.task('css:build', (f) => {
  f();

  path.folders.map((element) => {
    return gulp.src(path.src.style)
      .pipe(plumber()) // для отслеживания ошибок
      .pipe(sourcemaps.init()) // инициализируем sourcemap
      .pipe(sass()) // scss -> css
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 8 versions'],
        browsers: [
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24',
          'Explorer >= 11',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6',
        ],
      })) // добавим префиксы
      .pipe(gulp.dest(path.build.css))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(cleanCSS()) // минимизируем CSS
      .pipe(sourcemaps.write('./')) // записываем sourcemap
      .pipe(gulp.dest(path.build.css)) // выгружаем в build
      .pipe(gulp.dest('course/' + element + '/1/user/css/')) // выгружаем в build
      .pipe(webserver.reload({
        stream: true
      })); // перезагрузим сервер
  });
});

// сбор js
gulp.task('js:build', (f) => {
  f();

  path.folders.map((element) => {

    return gulp.src(path.src.js)
      .pipe(plumber()) // для отслеживания ошибок
      .pipe(rigger()) // импортируем все указанные файлы в main.js
      .pipe(gulp.dest(path.build.js))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(sourcemaps.init()) //инициализируем sourcemap
      // .pipe(uglify()) // минимизируем js
      /*.pipe(sourcemaps.write('./')) //  записываем sourcemap*/
      .pipe(gulp.dest(path.build.js)) // положим готовый файл
      .pipe(gulp.dest('course/' + element + '/1/user/js/')) // положим готовый файл
      .pipe(webserver.reload({
        stream: true
      })); // перезагрузим сервер
  });

});

// перенос шрифтов
gulp.task('fonts:build', (f) => {
  f();
  let dir = [];

  path.folders.forEach(title => {
    dir.push('course/' + title + '/1/user/fonts/');
  });

  dir.push(path.build.fonts);

  dir.map((element) => {
    gulp.src([path.src.fonts])
      .pipe(gulp.dest(element))
      .pipe(ttf2woff())
      .pipe(gulp.dest(element));
    gulp.src([path.src.fonts])
      .pipe(ttf2woff2())
      .pipe(gulp.dest(element));
    gulp.src([path.src.fonts])
      .pipe(ttf2eot())
      .pipe(gulp.dest(element));
  });
});

// Создание файла с названием шрифтов
gulp.task('creatFonts:build', (cd) => {
  fs.writeFile('main/src/style/_fonts.scss', '', cd);

  return fs.readdir('main/build/user/fonts/', function (err, items) {
    if (items) {
      let c_fontname;
      for (let i = 0; i < items.length; i++) {
        let fontname = items[i].split('.');
        fontname = fontname[0];
        if (c_fontname !== fontname) {
          fs.appendFile('main/src/style/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cd);
        }
        c_fontname = fontname;
      }
    }
  });

  cd();
});


// обработка картинок
gulp.task('image:build', () => {
  return gulp.src(path.src.img) // путь с исходниками картинок
    .pipe(cache(imagemin([ // сжатие изображений
      imagemin.gifsicle({
        interlaced: true
      }),
      jpegrecompress({
        progressive: true,
        max: 90,
        min: 80
      }),
      pngquant(),
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      })
    ])))
    .pipe(gulp.dest(path.build.img)) // выгрузка готовых файлов
});

// обработка svg
gulp.task('svg:build', (f) => {
  f();
  let dir = [];

  path.folders.forEach(title => {
    dir.push('course/' + title + '/1/user/svg/');
  });

  dir.push(path.build.svg);

  dir.map((element) => {
    return gulp.src(path.src.svg) // svg files for sprite
      .pipe(svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg"  //sprite file name
          }
        },
      }
      ))
      .pipe(gulp.dest(element));
  });
});


// удаление каталога build
gulp.task('clean:build', () => {
  let dir = [];

  path.folders.forEach(title => {
    dir.push('./course/' + title + '/1/user/js/*');
    dir.push('./course/' + title + '/1/user/css/*');
    dir.push('./course/' + title + '/1/user/fonts/*');
    dir.push('./course/' + title + '/1/user/vue/*');
    dir.push('./course/' + title + '/1/user/svg/*');
  });

  dir.push(path.clean);

  return gulp.src(dir, {
    read: false
  })
    .pipe(rimraf());
});

// очистка кэша
gulp.task('cache:clear', () => {
  cache.clearAll();
});

// сборка
gulp.task('build',
  gulp.series('clean:build',
    gulp.parallel(
      'html:build',
      'vue:build',
      'css:build',
      'js:build',
      'fonts:build',
      'image:build',
      'svg:build',
    )
  )
);

// запуск задач при изменении файлов
gulp.task('watch', () => {
  gulp.watch(path.watch.html, gulp.series('html:build'));
  gulp.watch(path.watch.html, gulp.series('vue:build'));
  gulp.watch(path.watch.css, gulp.series('css:build'));
  gulp.watch(path.watch.js, gulp.series('js:build'));
  gulp.watch(path.watch.img, gulp.series('image:build'));
  gulp.watch(path.watch.svg, gulp.series('svg:build'));
  gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
  gulp.watch(path.build.fonts, gulp.series('creatFonts:build'));
});

// задача по умолчанию
gulp.task('default',
  gulp.series(
    'build',
    'creatFonts:build',
    gulp.parallel('webserver', 'watch')
  ));
