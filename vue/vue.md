# Vue 源码分析部分

## 追踪整个数据变更的流程
`````javascript
    var app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!'
        }
    })
    
    app.message = 'wjp'
`````
解析整个过程：

1. 打印出整个当前实例
app 
```
 $attrs 
 $children
 $createElement
 $el
 $listeners
 $options
 $parent
 $refs
 $root
 $scopedSlots
 $slots
 $vnode
 message
 _c
 _data
 _directInactive
 _events
 _hasHookEvent
 _inactive
 _isBeingDestroyed
 _isDestoryed
 _isMounted
 _isVue
 _renderProxy
 _self
 _staticTrees
 _uid
 _vnode
 _watcher
 _watchers
 get message
 set message
 ...
```
2. 追踪到页面上的{{name}}
其实是app._data {
        message: ''
        set message // 这里触发
        get message 
     }

3. Chrome devtools 右击 set message => show function definition
看到源码中下面的代码 
```javascript
  
    set: function reactiveSetter (newVal) {
          var value = getter ? getter.call(obj) : val // 获取当前的value
          
          // 进行对比，没有变化就return 
          if (newVal === value || (newVal !== newVal && value !== value)) {
            return
          }
          
          
          if ("development" !== 'production' && customSetter) {
            customSetter()
          }
          if (setter) {
            setter.call(obj, newVal);
          } else {
            val = newVal;
          }
          childOb = !shallow && observe(newVal); // 值的观察者实例，暂时放下，跳过
          dep.notify();
        }
```
4. 追踪到dep.notify() 进行下一个步骤
```javascript

var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
    if (Dep.target) {
        Dep.target.addDep(this);
    }
};

// 定位到这个函数
Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update();  // 定位到这里，将依赖项遍历并且触发update()函数
    }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
```
5. 继续分析 subs[i].update(), 首先看subs的数据:
```javascript
subs = [
  Watcher instance,
  Watcher instance,
  ...
]
```
在我们的例子中：
```javascript
[{
    active: true,
    cb: function noop () {},
    deep: false,
    depIds: Set,
    deps,
    dirty: false,
    expression: "function () { vm._update(vm._render(), hydrating); }"
    getter: f (),
    id: 1,
    lazy: false,
    newDepIds: Set(),
    newDeps: [],
    sync: false,
    user: false,
    value: undefined,
    vm: vue$3 {},
    __proto__: {
        addDep: f addDep(dep),
        cleanupDeps: f cleanupDeps (),
        depend: f depend(),
        evaluate: f evaluate (),
        get : f(),
        run : f run()
        teardown: f teardown(),
        update: f update() // 跟踪到这里
    },
    length
}]
```

5. 继续分析 Dep.prototype.update 这个函数的工作原理，记得熟练打断点，然后step over next function
```javascript
/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
        this.dirty = true;
    } else if (this.sync) {
        this.run();
    } else {
        queueWatcher(this); // 后面执行到这一步
    }
};
```

6. 继续分析 queueWatcher(this)
```javascript
// 将watcher推入到watcher队列中。
function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
        has[id] = true;
        if (!flushing) {
            queue.push(watcher);
        } else {
            // if already flushing, splice the watcher based on its id
            // if already past its id, it will be run next immediately.
            var i = queue.length - 1;
            while (i > index && queue[i].id > watcher.id) {
                i--;
            }
            queue.splice(i + 1, 0, watcher);
        }
        // queue the flush
        if (!waiting) {
            waiting = true;
            nextTick(flushSchedulerQueue); // 断点执行到这里
        }
    }
}
```

7. 继续分析 nextTick(flushSchedulerQueue)

首先我们来看nextTick的定义
```javascript
/**
* 1. 推入到callbacks
* 2. 执行microTimerFunc()
* */
function nextTick (cb, ctx) {
        var _resolve;
        callbacks.push(function () {
            if (cb) {
                try {
                    cb.call(ctx);
                } catch (e) {
                    handleError(e, ctx, 'nextTick');
                }
            } else if (_resolve) {
                _resolve(ctx);
            }
        });
        if (!pending) {
            pending = true;
            if (useMacroTask) {
                macroTimerFunc();
            } else {
                microTimerFunc();
            }
        }
        // $flow-disable-line
        if (!cb && typeof Promise !== 'undefined') {
            return new Promise(function (resolve) {
                _resolve = resolve;
            })
        }
}
```

8. 这个时候进入到 microTimerFunc()
```javascript
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}
```



 


 