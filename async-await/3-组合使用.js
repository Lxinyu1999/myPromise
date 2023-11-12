// 假设有这样一段连续异步+回调，其中计时是异步任务，结束之后调用的函数（第一个参数）是回调函数，可以理解为小微任务。

const { log } = require("console")

// 每个回调函数内，再执行下一个异步计时+回调，可以看到这是典型的回调地狱。
// setTimeout(()=>{
//     console.log("第一次异步")

//     setTimeout(function(){
//         console.log("第二次异步")

//         setTimeout(()=>{
//             console.log("第三次异步")
//         },0)//可以不加0，默认是0s
//     },0)
// },0)

// Promise的作用是把异步操作进行封装，其中异步任务放到Promise(executor)的构造函数里面，结果的处理放到then方法里面
function mySetTimeOut(n=0){ // 默认n=0
    let p = new Promise((res,rej)=>{
        setTimeout(()=>{
            res(`第${n}次异步`) // value
        },0)
    })
    return p // p当中存储了一个setTimeout异步操作
}

// // 封装并执行第一个异步任务，它的结果由下面的then处理
// let p = mySetTimeOut(1) 
// // then方法用于执行回调函数，其中这里的回调函数操作是console.log(第几次操作)
// p.then(value=>{
//     console.log(value)
//     return mySetTimeOut(2) // 返回下一个Promise对象，也就是上一个异步操作结束，该下一个异步操作了
// }).then(value=>{
//     console.log(value)
//     return mySetTimeOut(3)
// }).then(value=>{
//     console.log(value)
// }).catch(err=>{
//     console.warn(err)
// })

/** 通过async和await的组合进一步优化
 *  可以看到，在这个async修饰的特殊代码块里面，尽管有异步操作，但是也强制从上到下按顺序执行
 *  后面的同步操作（可以理解为then的回调函数）也要等待上面异步操作的执行完毕才可以，相当于阻塞两类
 *  
 */
async function setTimeSequentially(){
    let data1 = await mySetTimeOut(1) // 第一次执行异步+回调
    console.log(data1) // 第1次异步

    let data2 = await mySetTimeOut(2) // 第二次执行异步+回调
    console.log(data2)

    let data3 = await mySetTimeOut(3) // 第三次执行异步+回调
    console.log(data3)
}
setTimeSequentially()