let proto = {};
let obj = { x: 10 };

Object.setPrototypeOf(obj, proto);

proto.y = 20;
proto.z = 40;
proto.sayHello = function () {
    console.log('nihao')
}

console.log(obj.__proto__.__proto__.constructor)