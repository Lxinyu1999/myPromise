/**同步任务：根据代码顺序从上到下依次执行，不会插队 */
// console.log(1);
// console.log(2);
// console.log(3);

/**如果某一件事花费时间很长，后面所有事件都要等着它 */
// 漫长的等待
// for (let i = 0;i<10;i++){
//     console.log("等着吧您")
// }

// console.log("我什么时候能执行？")

/**为了解决异步操作导致后面先做，前面后做而引发的逻辑问题
 * 我们要让一部分需要等待异步操作之后才能完成的函数作为参数放到宏任务函数里面
 * 这叫做回调函数
 */

// 同步事件，又叫主线程事件，放在主线程里面依次执行，也就是无法脱身的事件
function doNow(thing){
    console.log(thing) // 买鸡，玩手机，唱歌
}

// 异步事件，需要长时间的等待之后才能开始执行的事件，即可以暂时脱身的事件（去完成后面的主线程）
function doAfter(thing, callback){ // 同时配备一个回调函数，用于等待结束→当前宏任务→执行微任务用
    setTimeout(()=>{
        // 模拟炖鸡，注意实际顺序应该是：计时结束→执行炖鸡→执行回调函数吃鸡；
        // 炖鸡这个词会有歧义，实际上是计时结束才开始执行炖鸡（），但是这里表现的好像是一直在炖呢。然而并没有，只是一个示例，别在意。
        console.log(thing); 
        callback("吃鸡") // 吃鸡，注意这里必须放在括号里面，否则会先执行不等待炖鸡了。
    },1000)
} 