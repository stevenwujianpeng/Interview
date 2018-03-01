# Interview
## 2018年最新前端面试题目&amp;公司总结

D:
 1. 如何实现垂直居中？
 2. 如何解决1px像素的兼容问题？
 3. var let 声明的区别
 4. vue 跟 react 之间的区别有哪些方面？
 5. 阐述事件点透
 6. vue 的数据绑定在那个阶段？
 7. 阐述前端优化的方面&性能优化
 8. vue 的生命周期的钩子函数有哪些？
 9. vue 的实现原理是？
 10. 控制台中 0.1 + 0.2 = ？
 11. ES6里面有哪些特性和语法？
 12. Vue有哪些钩子函数？

D:

 1. react中有哪些周期函数？
 2. vue 跟 react 之间的区别有哪些方面？
 3. ES6里面有哪些特性和语法？
 4. 在多个Promise调用链中如何在某个then中捕捉到错误，但是不停止then语句的执行？

H:

 1. Vue 的生命周期都做了哪些事情？
 2. 如何解决跨域问题？有哪些方案？ 
 3. Vue1.0 跟 Vue2.0的变化有哪些地方？
 4. ES6里面有哪些特性和语法？
 5. 介绍一下盒模型 box-sizing: content-box / border-box

## 附上部分问题的解答或者相对应的链接：

```基础

1. 介绍一下盒模型 box-sizing: content-box / border-box

答：https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Getting_started/Boxes
---------------------------------------

2. 0.1 + 0.2 = ？ 

答：因为小数在计算机底层都是近似表示，并不是准确的。整数计算是准确的。
具体可以参见深入计算机系统里面的数字二进制表示
---------------------------------------

3. ES6里面有哪些常用的特性？
答：1. let const              2. 解构赋值
    3. class                  4. Module 语法
    5. Arrow function  ...
具体的文档可以参见阮一峰的ES6入门文档：http://es6.ruanyifeng.com/#README
---------------------------------------

4. 事件点透
答：产生原因：移动端click事件300ms延迟导致的
    产生场景：在同一个z轴上存在两个层A,B, 当用户点击B消失的时候，A上的链接就会被触发点击事件
```

```关于Vue    

1. Vue的钩子函数有哪些？
答：中文官方文档：https://cn.vuejs.org/v2/guide/instance.html
    beforeCreate,
    created
    beforeMount
    mounted
    beforeUpdate
    updated
    beforeDestroy
    destroyed
---------------------------------------    
    
2. 在这个生命周期中，Vue都做了哪些事情？
    
```    
    