const fs = require('fs');

/**无promise版本： */
// fs.readFile('./res/content.txt',(err,data)=>{
//     // 如果出错，则抛出错误
//     if(err) throw err;
//     // 否则输出文件内容
//     console.log(data) // <Buffer e9 98 bf e6 96 af e9 a1 bf e5 be ae e8 be a3>
//     console.log(data.toString()) // 阿斯顿微辣
// })

/**promise形式 */
let p = new Promise((resolve,reject)=>{
    fs.readFile('./resd/content.txt',(err,data)=>{
        // 如果出错，就调用reject，并传递失败结果
        if(err) reject(err);
        // 如果成功，调用resolve，并传递成功结果
        resolve(data);
    })
})

/**调用then */
// 由于两个箭头函数都只有一个参数，就省略括号了
// 这里其实用data和err是和上面保持一致的，但是依然推荐用value和reason
// 因为这样代码你无论上面写了什么，下面的写法都是一致的。
p.then(data=>{
    console.log(data.toString()) // 阿斯顿微辣
}, err=>{
    console.log(err) // [Error: ENOENT: no such file or directory, ope...
})