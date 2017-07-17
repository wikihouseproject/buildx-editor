const reverse = list => list.reverse()

const wrapped = list => {
  let arr = []
  for (let i = 0; i < list.length; i++) {
    arr.push([list[i], list[i+1] || list[0]])
  }
  return arr
}

const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
)

// console.log(wrapped([1,2,3]))

module.exports = {
  reverse,
  wrapped,
  flatten
}
