var a  = {
   name: 'wujianpeng',
   skills: ['js', 'css', 'html']
}

var b = JSON.parse(JSON.stringify(a))

console.log(a)
console.log(b)