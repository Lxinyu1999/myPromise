/**首先我们来看一个纯使用回调的情况
 * 假设我们要读取三个txt文件，file1, file2 和 file3
 * 其中第二个文件只有在成功读取第一个文件后才会读取，第三个文件则在成功读取第二个文件后读取。
 * 
 * 我们的fs模块的读取文件函数为：
 * fs.readFile('file1.txt', 'utf8', function(err, data1) {
        // 这里表示读取file1.txt成功之后，执行的回调函数
        ...
    });

 */

const fs = require('fs');
// fs.readFile("../res/file1.txt",function(err,data1){
//     if(err){
//         console.warn(err)
//         return
//     }else{
//         console.log(data1)
//         // 这里继续读取第二个文件的代码可以放到else里面，也可以不放，效果是等价的
//     }

//     fs.readFile("../res/file2.txt",function(err,data2){
//         if(err){
//             console.warn(err)
//         }else{
//             console.log(data2)
//             fs.readFile("../res/file3.txt",function(err,data3){
//                 if(err){
//                     console.warn(err)
//                 }else{
//                     console.log(data3)
//                 }
//             })
//         }
//     })

// })

/* 代码试图在第一个文件读取完成后，再读取第二个文件，然后第三个文件。
这种嵌套的方式是处理异步操作的典型“回调地狱”。这种方式的问题在于它嵌套层次过深，代码难以阅读和维护。 */
// 我们用promise封装readFile，不过因为要三个不同的传入路径，所以外层还得再套一个函数MyReadFile
function MyReadFile(name){
    let p = new Promise((resolve,reject)=>{
        fs.readFile(name,'utf-8',function(err,data){
            if(err){
                reject(err)
            }else{
                resolve(data)
            }
        })
    })
    return p // 简略的写法就是直接return new Promise(xxx)
}
let p = MyReadFile("../res/file1.txt")

// p.then(value=>{ // 成功就输出获得的data
//     console.log(value) // 输出111
//     return MyReadFile("../res/file2.txt") // then方法返回Promise对象，这个对象是被我们封装过且传入第二个地址
// }).then(value=>{
//     console.log(value) // 输出222
//     return MyReadFile("../res/file3.txt") // 读取3
// }).then(value=>{
//     console.log(value) // 输出333
// }).catch(reason=>{
//     console.warn(reason)
// }).finally(()=>{
//     console.log("运行结束")
// })

/** 这样看起来简化很多了，特别是连续调用回调的时候，但是问题是，我们还是觉得有些麻烦，能不能把.then也省略了？
 *  可以，通过async 和 await的组合
 */
async function MyReadFileSequentially(){ // async是一个特殊的代码块，里面的代码是独立于主线程之外的
    // await的特点是，它会强制让async代码块后面所有代码等待（也就是阻塞）
    let data1 = await MyReadFile("../res/file1.txt") // await的返回值是Promise fulfilled状态的返回值value；
    console.log(data1)

    // 连续的调用await就起到了类似于.then().then()...的效果
    let data2 = await MyReadFile("../res/file2.txt")
    console.log(data2)

    let data3 = await MyReadFile("../res/file3.txt")
    console.log(data3)
}
MyReadFileSequentially()