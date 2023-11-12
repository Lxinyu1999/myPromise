/** await的作用是暂停等待右侧的Promise对象，直到它的状态被修改为止
 *  在此期间，async代码块的后面所有代码无论同步或异步任务，都被阻塞
 *  这是因为采用了Generator的结构的原因
 */
// await右侧的表达式一般都是Promise对象的定义（其他值也可以，但是没什么意义）
// await修饰之后，表达式返回的不是Promise对象，而是它返回的成功值（resolve(data)的那个data）
// 如果失败了怎么办？通过try catch处理
test = async ()=>{
    let p = new Promise((res,rej)=>{
        res("输出的是我，而不是promise对象")
    })
    let result = await p
    console.log(result) // 输出的是我，而不是promise对象

    // await后面跟一个非Promise对象，这样没什么意义，一般很少用
    let result2 = await 20
    console.log(result2) // 直接返回20

    // await后面的表达式返回失败的Promise对象
    try{
        // 报错的情况下，左侧也不需要有result3来接收了，因为报错信息rej(e)被传到catch分支里面了
        await new Promise((res,rej)=>{ 
        rej("通过try catch获取我")
    })
    }catch(e){
        console.log(e) // 直接输出是会报错的
    } 
}
test()