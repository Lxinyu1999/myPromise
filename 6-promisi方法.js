/**
 * util.promisify 方法
 */
// 引入 util 模块
const util = require('util')
const fs = require('fs')

// 封装readFile()，现在不需要我们去手动封装了
let mineReadFile = util.promisify(fs.readFile) // 返回一个promise对象

// 传入path+设置then方法
// 由于已经改写，我们不需要处理这个readFile（err,data）的问题了，交给then处理
// then里面可以只传resolve的参数value，不要err
// 如果 Promise 被拒绝（例如，如果文件读取失败），则没有提供处理失败情况的回调函数，因此不会有任何东西来处理错误。
mineReadFile('./res/content.txt').then(value=>{
    console.log(value.toString())
})