function A() {

    this.Asay = function () {
        console.log('能访问')
    }
}

A.prototype = {}

var a = new A()
var aa = {}

Object.setPrototypeOf(aa, a)

aa.Asay()


