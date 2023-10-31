/**
 * 封装一个函数mineReadFile
 * 参数 path
 * 返回 promise 对象
 */
// 其实就是把刚才我们写的改写fs给封装为函数
function mineReadFile(path){
    return new Promise((resolve,reject) =>{
        // 读取文件
        require('fs').readFile(path,(err,data)=>{
            // 如果读取失败，就给reject传递错误信息
            if(err) reject(err)
            // 成功则把读取的data传给resolve
            resolve(data)
        })
    })

}

/**在定义完之后，我们就可以输入路径，通过then方法接在后面 
 * 也就是说，之前读取了文件，这一过程是异步的，我们把它封装了起来
 * 那个异步操作的结果，我们在写调用时，也不用写在原始函数后面 readFile(path,(err,data)=>{if 错误；if 正确...}) 可以看到后面跟了一大串，
 * 而是可以写在后续的地方，通过调用then((f1,f2))。根据fullfilled和rejected两种情况分别实现。
 * 也就是说，then（）方法是实现回调函数的，promise的构造方法是封装异步操作的。then根据异步操作的结果可以自定义成功/失败的两种回调操作，且这一过程的参数是由promise内部自动调用
*/
// 为什么可以直接跟 . ?因为mineReadFile返回的是一个promise对象！也就是之前的p
mineReadFile('./res/content.txt').then(value=>{
    // 输出文件内容
    console.log(value.toString())
},reason=>{
    // 输出报错原因
    console.log(reason);
})