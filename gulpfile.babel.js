import gulp from "gulp";
import del from "del";
import sass from "gulp-sass";
import minify from "gulp-csso";
import autoprefixer from "gulp-autoprefixer";
import imagemin from "gulp-imagemin";
import ghPages from "gulp-gh-pages";

sass.compiler = require("node-sass");

const routes = {
  css: {
    watch: "src/scss/*",
    src: "src/scss/*.scss",
    dest: "dest/css",
  },
  image: {
    watch: "img/*",
    src: "img/Hero.jpg",
    dest: "dest/img",
  },
};

const optImg = () =>
  gulp
    .src(routes.image.src)
    .pipe(imagemin())
    .pipe(gulp.dest(routes.image.dest));

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: "autoplace",
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const ghDeploy = () => gulp.src("dest/**/*").pipe(ghPages());

const watch = () => {
  gulp.watch(routes.css.watch, styles);
  gulp.watch(routes.image.watch, optImg);
};

const clean = () => del(["dest/styles.css", ".publish"]);

const prepare = gulp.series([clean, optImg]);

const assets = gulp.series([styles]);

const live = gulp.parallel([watch]);

export const dev = gulp.series([prepare, assets, live]);
export const deploy = gulp.series([prepare, assets, ghDeploy, clean]);
