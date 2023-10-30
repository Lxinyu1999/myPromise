/** 1. 只设置resolved状态或者rejected状态是ok的 */
// executor = function(resolve,reject){
//     resolve('ok');
// }
// // 我们之前是通过匿名的箭头函数设置的，其实完全可以把executor定义在外面
// let p = new Promise(executor); 

// p.then((value)=>{
//     console.log(value); // ok
// })


/** 
 * 2. executor的实现和外部是同步调用的
 *  也就是说，在Promise类定义的时候，里面传入的executor就先执行了
 *  随后再把executor送到Promise类的实例化对象p里面
 */
// let p = new Promise((resolve,reject)=>{
//     console.log(111) // 你先执行
// })
// console.log(222) // 你后执行


/** 3. catch是一种仅限于rejected状态用的回调函数 */
let p = new Promise((resolve,reject) =>{
    reject('error');
})

// 执行 catch 方法
p.catch(reason=>{
    console.warn(reason);
})