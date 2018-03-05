/**
 * 深拷贝
 * @function deepCopy
 * @example:
 * a {
 *   name: 'wjp',
 *   age: 25
 * }
 *
 * 功能分析：
 * null, undefined, number, string, boolean 原始值 不做处理
 * object array 做深拷贝处理
 * */

function isArray(source) {
    return Object.prototype.toString.call(source) === '[object Array]'
}

function isObject(source) {
    return Object.prototype.toString.call(source) === '[object Object]'
}

function deepCopy(source) {
    let cp = null

    if (typeof source !== 'object') {
        return
    }

    if (isArray(source)) {
        cp = []
        source.forEach((item) => {
            if (typeof item === 'object') {
                cp.push(deepCopy(item)) // 递归
            } else {
                cp.push(item)
            }
        })
    }

    if (isObject(source)) {
        cp = {}
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object') {
                    cp[key] = deepCopy(source[key]) // 递归
                } else {
                    cp[key] = source[key]
                }
            }
        }
    }

    return cp
}

var a = [1, 2, 3, 4]
var a1 = {
    name: 'wjp',
    deliveryAddress: {
        home: '家里地址',
        company: '公司地址',

    },
    friends: ['friends-1', 'friends-2']
}

var b = deepCopy(a)
var b1 = deepCopy(a1)

console.log(b1)
