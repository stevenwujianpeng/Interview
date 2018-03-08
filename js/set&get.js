let person = {
    _name: '',
    set name(val) {
        if (val) {
            this._name = val
        }
    },
    get name () {
        return this._name
    }
}

person.name = 'wujianpeng'
console.log(person.name)