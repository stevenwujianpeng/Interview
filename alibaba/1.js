if (!formater) {
    return []
}

formater.replace(/\w+?/g, function (prop) {
    res[prop] = prop
})

with (res) {
    formaterArray = eval(formater)
}

for (var i = 0; i < formaterArray.length; i++) {
    key = formaterArray[i]

    if (typeof key === 'string') {
        res[key] = targetArray[i]
    }

    if (Object.prototype.toString.apply()) {

    }
}

return function (val) {
    text = val

    if (timer) {
        return
    }

    timer = setTimeout(function() {
        func.call(null, val)
        clearTimeout(timer)
    }, threshold)
}