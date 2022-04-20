const fs = require("fs");
const through = require("through2");
const { series, parallel } = require("gulp");

//define different tasks
//default task  run  gulp 就可以执行
function defaultTask(cb) {
  // place code for your default task here
  cb(); //

  //   cb("err"); //会失败 失败的原因就是传入的参数
}

//callback task
function callbackTask(cb) {
  setTimeout(() => {
    console.log("callbackTask");
    cb(); //调用 callback 表示任务成功了
  }, 1000);
}

//promise task
function promiseTask() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("promiseTask");
      resolve(); //调用 resolve 表示任务成功了
      //   reject("promise task fail"); //Error: promise task fail
    }, 1000);
  });
}

//async await task
async function asyncTask() {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log("asyncTask");
      resolve(); //调用 await 表示任务成功了
    }, 1000);
  });
}

//stream task
function streamTask() {
  //流的操作也是异步的， 这个任务也是需要等待这个异步任务之后才会让任务结束
  let rs = fs.createReadStream("input.txt", { autoClose: true });
  let ws = fs.createWriteStream("out.txt", { autoClose: true });
  ws.on("end", () => console.log("写入完毕"));
  rs.pipe(
    through((chunk, enc, cb) => {
      setTimeout(() => {
        cb(null, chunk.toString() + "4444");
      }, 1000);
    })
  ).pipe(ws);
  ws.end();

  return ws;
}

//串行任务 总耗时是所有任务耗时之和
const seriesTask = series(callbackTask, promiseTask, asyncTask, streamTask);
//并行任务 总耗时是需要时间最长的那个
const parallelTask = parallel(callbackTask, promiseTask, asyncTask, streamTask);
//Any exported functions will be registered into gulp's task system.
exports.default = defaultTask;
exports.callback = callbackTask;
exports.promise = promiseTask;
exports.async = asyncTask;
exports.stream = streamTask;
exports.parallel = parallelTask; //类似 Promise.all //Finished 'parallel' after 1.01 s
exports.series = seriesTask; //Finished 'series' after 3.02 s
//test it
//Run the gulp command in your project directory:
//To run multiple tasks, you can use gulp <task> <othertask>.
