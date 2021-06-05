let a = "-p -play kshajsnkn jshajks"

let res = a.split(" ")
let c = res.filter(arg=>arg[0]==='-')
let d = res.filter(arg=>arg[0]!=='-')

console.log(res)
console.log(c)
console.log(d)
