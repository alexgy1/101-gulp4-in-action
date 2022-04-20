const { src, dest } = require("gulp");

/**
 * dest 指定的是输出的目录名， 不包括文件路径
 * 文件路径或者文件名是  src 第一个参数 glob里面通配符开始的路径部分
 * @returns
 */
function copyTask() {
  console.log("copy task");
  // glob 语法 src/**/*.js /**/ 会匹配子目录和子目录的子目录
  return src("src/**/*.js").pipe(dest("dist"));
}

exports.copy = copyTask;
