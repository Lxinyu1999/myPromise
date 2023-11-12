const fs = require("fs")
const util = require("util")

// 先看一下回调地狱
// fs.readFile('../res/file1.txt','utf-8',(err,data1)=>{
//     if (err) throw err;
//     fs.readFile('../res/file2.txt','utf-8',(err,data2)=>{
//         if (err) throw err;
//         fs.readFile('../res/file3.txt','utf-8',(err,data3)=>{
//             if (err) throw err;
//             console.log(data1+data2+data3) //111112222233333
//         })
//     })
// })

/* 还记得前面说的吗？通过promisify可以把一个先处理err后处理data的异步回调函数改为Promise对象 
   它会把readFile的回调函数(err,data)=>{

   }
   给封装起来，也就是说，readFile的结果会被送到：resolve(data)和reject(err)。因此就不需要我们去写回调函数了
   （当然在获得这个data或err之后的新的回调操作要你自己写）
*/
const myReadFile = util.promisify(fs.readFile) // 帮你自动写好读取成功、失败的两种情况，送到resolve/reject里面



// 使用await，async改进上述代码
async function myReadFileSequentially(){
    
    let data1 = await myReadFile("../res/file1.txt",'utf-8') // 返回读取到的resolve(data)里面的data
    let data2 = await myReadFile("../res/file2.txt",'utf-8')
    let data3 = await myReadFile("../res/file3.txt",'utf-8')

    console.log(data1+data2+data3) // 相当于then()里面成功的那个回调函数分支value=>{}，如果想处理失败，就加上try catch
}