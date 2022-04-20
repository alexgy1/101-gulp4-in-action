## what is [gulp](https://gulpjs.com/)?

> A toolkit to automate & enhance your workflow

> Leverage gulp and the flexibility of JavaScript to automate slow, repetitive workflows and compose them into efficient build pipelines.

## Compose tasks

> Gulp provides two powerful composition methods, series() and parallel(), allowing individual tasks to be composed into larger operations. Both methods accept any number of task functions or composed operations. series() and parallel() can be nested within themselves or each other to any depth.

- To have your tasks execute in order, use the series() method.

- For tasks to run at maximum concurrency, combine them with the parallel() method.

## Async Completion

> Node libraries handle asynchronicity in a variety of ways. The most common pattern is error-first callbacks, but you might also encounter streams, promises, event emitters, child processes, or observables. Gulp tasks normalize all these types of asynchronicity

## Gulp 核心 api

- gulp.src(globs,[options])
  - globs : 这里的流不是原始的文件流， 而是一个虚拟的文件对象流
  - options: Object
- gulp.dest(path, [options])

  - path : 写入文件的路径, 只能指定路径，不能指定生成文件的文件名，生成的文件名是使用导入到它的文件流自身的文件名， 所以，生成的文件名是由导入到它的文件流决定的
  - options: Object
  - 通过指定 gulp.src 配置参数中的`base`属性， 可以更灵活生成文件路径

  ## glob

  > 文件匹配用的，内部 使用 node-glob 来实现文件匹配的功能

### glob 规则

- `*` :匹配 0 或者多个字符， 但不会匹配路径分隔符`/`
- `**` 匹配路径中的 0 个或者多个目录及其子目录 a/b/c/ddd.js 如何匹配？ 不能这么写 a/\*.js 应该写成 a/\*\*/\*.js \*\* 代表匹配 b/c
- `[...]` : 匹配方括号你诶出现的字符中的任意一个，当方括号重的第一个字符为`^`或者 `!` 时，表示不匹配方括号内的任意一个

- `!(pattern1 )` 匹配任何与括号中的人一个模式 不匹配

- `?(pattern1) ` 匹配 0 次或者 1 次
- `+(pattern1) ` 匹配 1 次   或者多次

- `(pattern1) ` 匹配 0 次   或者多次

- `@(pattern1) ` 有且仅有一个

### glob 例子

- `*` : 能匹配 a。js , x , y , abc, abc/ 但是不能匹配 a/b.js

## install

`npm i @babel/core @babel/preset-env browser-sync gulp-babel gulp-clean gulp-clean-css gulp-ejs gulp-htmlmin gulp-if gulp-less gulp-load-plugins gulp-uglify gulp-useref gulp-watch gulp-stream bootstrap jquery -S`

## 发现并且处理引用

<!-- build:css styles/dist.css -->

<!-- endbuild -->
