/** async 函数内部会被阻塞，而外部的任务（包括异步等会继续执行） */
async function asyncFunction (){
    console.log("③ 开始执行async")
    let result = await new Promise((res,rej)=>{
        setTimeout((
            res("⑤ 计时器任务结束")
        ),2000)
    })
    console.log(result)
    console.log("⑥ 结束执行async")
}

console.log("① 程序开始执行")
asyncFunction()
console.log("② 已调用async函数")
console.log("④ 主线程继续执行")

setTimeout(()=>{
    console.log("⑦ 主线程定时器触发")
},1000)