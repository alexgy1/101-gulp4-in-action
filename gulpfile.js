const { src, dest, parallel, watch, series } = require("gulp");
const less = require("gulp-less");
const gulpClean = require("gulp-clean");
const babel = require("gulp-babel");
const ejs = require("gulp-ejs");
const browserSync = require("browser-sync"); //本地起服务器用
const browserServer = browserSync.create();
const useRef = require("gulp-useref"); //处理html里面的魔法注释
const htmlmin = require("gulp-htmlmin");
const GulpUglify = require("gulp-uglify");
const GulpCleanCss = require("gulp-clean-css");
const gulpIf = require("gulp-if"); // gulp-useref 处理成三种文件流了 要用这个单独判断

//clean
const clean = () => {
  //删除dist目录 temp目录 以及里面的所有子目录
  return src(["dist/**", "temp/**"], { read: false }).pipe(gulpClean());
};

//build less to css
const lessToCss = () => {
  return src("src/styles/**/*.less", { base: "src" })
    .pipe(less())
    .pipe(dest("temp"));
};

//build js
const scripts = () => {
  return src("src/scripts/**/*.js", { base: "src" })
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(dest("temp"));
};

//build html
const html = () => {
  return src("src/**/*.html", { base: "src" })
    .pipe(
      ejs(
        {
          title: "gulp实战",
        }
        // { cache: false }//不要加这个 gulp dev就可以生效
      )
    )
    .pipe(dest("temp"));
};
//zip images
const images = async () => {
  const imagemin = await import("gulp-imagemin");
  return src("src/assets/images/**/*.@(png|jpg|gif|svg)", { base: "src" })
    .pipe(imagemin.default()) //动态导入
    .pipe(dest("dist"));
};

//copy 任何不需要编译处理的文件 到输出目录
const static = async () => {
  return src("static/**", { base: "static" }).pipe(dest("dist"));
};

// 本地起服务器
const serve = () => {
  //watch  实现监听文件变化 自动重启服务器
  watch("src/styles/**/*.less", lessToCss);
  watch("src/**/*.html", html);
  watch("src/scripts/**/*.js", scripts);
  //dev 环境下 修改static assets目录下的文件 重启服务器
  watch(
    ["src/assets/images/**/*.@(png|jpg|gif|svg)", "static/**"],
    browserServer.reload()
  );
  return browserServer.init({
    notify: false, //关闭ui提示
    server: {
      baseDir: ["dist", "src", "static"],
      //   点进去看server 的配置 解决 node_modules找不到的问题 会通过配置路由 做一个映射 就可以访问到了
      routes: {
        "/node_modules": "node_modules",
      },
      //   middleware: newProxy(),配置代理
      files: ["dist/**"], //监听文件变化 文件变化后 刷新浏览器
    },
  });
};

const concat = () => {
  return src("temp/**/*.html", { base: "temp" })
    .pipe(useRef({ searchPath: ["temp", "."] }))
    .pipe(gulpIf("*.js", GulpUglify()))
    .pipe(gulpIf("*.css", GulpCleanCss()))
    .pipe(
      gulpIf(
        "*.html",
        htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
        })
      )
    )
    .pipe(dest("dist"));
};

//能 并行不要串行 速度快
//把需要编译的任务组合在一起， 成为一个并发执行的组合任务
const compile = parallel(lessToCss, scripts, html);
const build = series(clean, parallel(series(compile, concat), images, static));
//dev 下面没有加images 和 static 可以直接配置 browserSync  baseDir: [ "src", "static"] 添加这两个目录 dev不压缩图片
const dev = series(clean, compile, serve);

//生产环境build
exports.build = build;
//开发环境 预览
exports.dev = dev;
