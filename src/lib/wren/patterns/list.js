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

function remapArray(input, mapping) {
  const sources = Object.keys(mapping);
  var out = new Array(sources.length);
  sources.map( (source) => {
    const targetIndex = mapping[source];
    return out[targetIndex] = input[source];
  });
  return out;
}

// console.log(wrapped([1,2,3]))

module.exports = {
  reverse,
  wrapped,
  flatten,
  remapArray
}
