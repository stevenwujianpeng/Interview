var p = {
    name: "chen",
    work: function () {
        console.log("wording...");
    },
    _age: undefined,
    get age() {
        console.log(this._age)
        return this._age;
    },
    set age(val) {
        if (val < 0 || val > 100) {//如果年龄大于100就抛出错误
            throw new Error("invalid value")
        } else {
            this._age = val;
        }
    }
}

p.age = 20
p.age