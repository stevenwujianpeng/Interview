# 分析vue实例化的整个生命周期都做了哪些事情？

## 1. 先进入Vue 构造函数
```javascript
function Vue$3 (options) {
        if ("development" !== 'production' &&
            !(this instanceof Vue$3)
        ) {
            warn('Vue is a constructor and should be called with the `new` keyword');
        }
        
        this._init(options);
}
```

## 下一步进入 this._init(options),先看_init的函数定义

```javascript
Vue.prototype._init = function (options) {
            var vm = this;
            // 省略了很多源码
            // expose real self
            vm._self = vm;
            initLifecycle(vm);
            initEvents(vm);
            initRender(vm);
            callHook(vm, 'beforeCreate');
            initInjections(vm); // resolve injections before data/props
            initState(vm);
            initProvide(vm); // resolve provide after data/props
            callHook(vm, 'created');

            /* istanbul ignore if */
            if ("development" !== 'production' && config.performance && mark) {
                vm._name = formatComponentName(vm, false);
                mark(endTag);
                measure(("vue " + (vm._name) + " init"), startTag, endTag);
            }

            if (vm.$options.el) {
                vm.$mount(vm.$options.el);
            }
};
```

从_init的函数定义中，我们可以看到一共有
```javascript
    initLifecycle(vm); // 初始化实例需要的一些属性
    initEvents(vm); // 初始化实例事件需要的相关参数
    initRender(vm); // 初始化了实例的vnode部分&？
    callHook(vm, 'beforeCreate'); 
    initInjections(vm); // resolve injections before data/props，完成父组件props的注入
    initState(vm); // 
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');
```
initLifecycle() 定义
```javascript
function initLifecycle (vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent;
        }
        parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
}
```

initEvents() 函数定义

```javascript
function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
        updateComponentListeners(vm, listeners);
    }
}
```

initRender () 函数定义， 初始化vnode相互的操作
```javascript
function initRender (vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
        defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
            !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
        }, true);
        defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
            !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
        }, true);
    }
}
```
initInjections () 函数定义
```javascript
function initInjections (vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
        observerState.shouldConvert = false;
        Object.keys(result).forEach(function (key) {
            /* istanbul ignore else */
            {
                defineReactive(vm, key, result[key], function () {
                    warn(
                        "Avoid mutating an injected value directly since the changes will be " +
                        "overwritten whenever the provided component re-renders. " +
                        "injection being mutated: \"" + key + "\"",
                        vm
                    );
                });
            }
        });
        observerState.shouldConvert = true;
    }
}
```

initState() 函数定义
```javascript
function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
        initData(vm);
    } else {
        observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch);
    }
}
```

initProvide 函数定义
```javascript
function initProvide (vm) {
    var provide = vm.$options.provide;
    if (provide) {
        vm._provided = typeof provide === 'function'
            ? provide.call(vm)
            : provide;
    }
}
```

## 2. 然后挂载到页面中 
### 挂载前触发 beforeMount
 
```javascript
vm.$mount(vm.$options.el);
```

### 挂载后触发 mounted

## 3. 数据变更 => 
      触发watcher => 
      nextTick 启动任务时间器 => 
      更新，对比vnode => 
      插入到页面中

### 变更前触发beforeUpdate
参考README有更具体的分析
### 完成更新操作后触发updated

## 4. 销毁Vue实例

### 4-1 触发beforeDestroy
```javascript
/**
* 1. 清空对应的 watchers,
* 2. 卸载子组件
* 3. 清空事件处理函数
* */
Vue.prototype.$destroy = function () {
        var vm = this;
        if (vm._isBeingDestroyed) {
            return
        }
        callHook(vm, 'beforeDestroy');
        vm._isBeingDestroyed = true;
        // remove self from parent
        var parent = vm.$parent;
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
            remove(parent.$children, vm);
        }
        // teardown watchers
        if (vm._watcher) {
            vm._watcher.teardown();
        }
        var i = vm._watchers.length;
        while (i--) {
            vm._watchers[i].teardown();
        }
        // remove reference from data ob
        // frozen object may not have observer.
        if (vm._data.__ob__) {
            vm._data.__ob__.vmCount--;
        }
        // call the last hook...
        vm._isDestroyed = true;
        // invoke destroy hooks on current rendered tree
        vm.__patch__(vm._vnode, null);
        // fire destroyed hook
        callHook(vm, 'destroyed');
        // turn off all instance listeners.
        vm.$off();
        // remove __vue__ reference
        if (vm.$el) {
            vm.$el.__vue__ = null;
        }
        // release circular reference (#6759)
        if (vm.$vnode) {
            vm.$vnode.parent = null;
        }
    };
```
### 4-2 触发destroyed


    
