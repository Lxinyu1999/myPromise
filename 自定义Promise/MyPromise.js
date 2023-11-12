function Promise(executor){ // 先执行构造函数，再执行executor

    /** 设置当前Promise对象为this，之前的this默认是window对象 */
    // 因为在 JavaScript 中，this 的值在不同的上下文中可能会发生变化，为了确保在闭包中能够访问到正确的 this 值，常常使用这种方式来保存 this。
    // 在 Promise 构造函数内部，this 最初指向新创建的 Promise 对象，但后续比如在某个function内，this就指向window了
    // console.log(this) // Promise {} 类型为object
    const self = this; // 通过这种方法把当前Promise对象保存为self

    // Promise状态属性
    self.promiseState = "pending";
    // Promise数值属性（传递个then的那个）
    self.promiseResult = undefined; // 默认值

    // 用于存储后面then方法里面的两个函数
    self.callbacks = []

    /** resolve()函数的两个作用 ① 修改Promise对象的状态 ② 将结果值传递给then方法 */
    // resolve()函数
    function resolve(data){
        if(self.promiseState=='pending'){
            self.promiseState = "fulfilled"
            self.promiseResult = data
        }

        // 执行then方法里面的回调函数时要异步，且微队列
        queueMicrotask(()=>{ 
            // 改写：把单一调用callback改为调用callbacks数组里面的每个item
            self.callbacks.forEach(item =>{
                item.resolveHander(data) // 每个item是一个{resHander, rejHander}。取出来传入data
            })
        })


    }
    // reject()函数
    function reject(data){
        if(self.promiseState=='pending'){
            self.promiseState = "rejected"
            self.promiseResult = data
        }

        queueMicrotask(()=>{
            self.callbacks.forEach(item=>{
                item.rejectHander(data)
            })
        })
    }

    // 设置throw状况时要调用reject的操作
    try{
        // executor()的调用要放在构造函数的最后面
        executor(resolve,reject) // 传递实参，这两个函数由于构造函数先调用所以已经创建好了。
    }catch(e){
        reject(e) // e表示你抛出的异常信息
    }

}

// 通过原型链写then方法
// then接收两个函数，之后会进行判定，根据当前状态选择使用哪个函数
Promise.prototype.then = function(resolveHander, rejectHander){ // 这是两个回调函数

    // p.then(value=>P{}) 没有reason=>{}的情况
    if(typeof rejectHander !== 'function'){
        rejectHander = reason=>{
            throw reason
        }
    }
    // p.then() 什么都不传的情况
    if(typeof resolveHander !== 'function'){
        resolveHander = value=>value
    }


    // p.then方法返回的是一个Promise对象，且该Promise对象的状态由你当前选择调用的分支决定
    return new Promise((resolve,reject)=>{ // 这里的res，rej是当前要返回的Promise对象的
        const self = this;
        // 封装下面的大量重复代码
        function callback(type){ // type 表示 resolveHander or rejectHander
            // 应对：在then的回调函数里面抛错
            try{
                // 获取回调函数的结果，（同时执行回调函数）
                let result = type(self.promiseResult); // 这里在function里面，所以要用self，不能用this 
                if (result instanceof Promise){ // 如果result是Promise对象
                    // 既然是Promise对象，那它一定有then方法，且根据result的状态，选择其中的一个分支
                    // 且必然会有value或result其中一个
                    result.then(v=>{ // 如果result是fulfilled状态,它会有上一个resolve方法传递的值value
                        resolve(v) // 将当前返回的Promise对象状态设置为resolved
                    },r=>{ 
                        reject(r) 
                    })

                }else{// 如果result是非Promise对象
                    // 这里的resolve就是上面new Promise(resolve,reject)。
                    // 因为Promise类已经被我们在上面定义好了，executor(res,rej)是在后执行的！
                    resolve(result) // 直接调用resolve并把返回值传进去用于设置then方法结果的promiseState
                }
            }catch(e){
                reject(e)
            }
        }

        // 如果前面异步操作设置为resolved，则调用第一个函数
        if(self.promiseState==='fulfilled'){ 
            queueMicrotask(()=>{ // 加入微任务队列
                callback(resolveHander);    
            })
        
        }
        // 反之调用第二个
        if(self.promiseState==='rejected'){
            queueMicrotask(()=>{
                callback(rejectHander)
            })

        }
        // 如果执行异步任务，执行到p.then()时还处于pending状态
        if(self.promiseState==='pending'){
            // 保存用户写的回调函数
            this.callbacks.push({
                // 把两个要送回给原始Promise异步任务的回调函数进行一下包装
                // 注意，这两个回调本身是由用户定义的
                resolveHander: ()=>{
                    callback(resolveHander)
                },

                rejectHander: ()=>{
                    callback(rejectHander)
                }
            })
        }
    })

}

// 定义catch方法
Promise.prototype.catch = function(rejectHander){
    return this.then(undefined,rejectHander)
}

// 添加静态resolve方法：
Promise.resolve = function(value){ // 静态方法无需原型链
    // 返回promise对象
    return new Promise((resolve,reject)=>{
        if(value instanceof Promise){
            value.then(v=>{
                resolve(v)
            },r=>{
                reject(r)
            })
        }else{
            resolve(value)
        }
    })
}

// 静态reject方法
Promise.reject = function(reason){
    return new Promise((resolve,reject)=>{
        reject(reason)
    })
}

// 静态all方法
Promise.all = function(promises){

    // 声明计数变量
    let count = 0;
    // 声明存储结果的数组
    let arr = [];

    // 返回结果为Promise对象
    return new Promise((resolve,reject)=>{
        // 遍历promises数组
        for(let i=0;i<promises.length;i++){
            // 每个元素是Promise对象，因此可以用then方法来选择分支
            promises[i].then(v=>{
                // 得知对象的状态是成功,则计数
                count++
                // 将当前成功的结果存入数组
                arr[i]=v;
                //判断：如果总数和长度一致，即所有对象均成功
                if(count === promises.length){
                    //修改状态
                    resolve(arr)
                }
            
            },r=>{
                reject(r)
            })
        }
    })
}

// race方法
Promise.race = function(promises){
    return new Promise((resolve,reject)=>{
        for(let i=0;i<promises.length;i++){
            // 如果处于异步，则无法调用then，因此谁先调用then谁就是最快的
            promises[i].then(v=>{
                resolve(v);
            },r=>{
                reject(r);
            })
        }
    })
}

//