// const times = (n, iterator) => {
//   var accum = Array(Math.max(0, n));
//   for (var i = 0; i < n; i++) accum[i] = iterator.call();
//   return accum;
// }

/**
 * Appends the first element onto the end of its input array
 * @example
 * // returns [1,2,3,1]
 * loopify([1,2,3])
 * @returns {Array}
 */
const loopify = array => {
  // NOTE: function name was previously 'wrapped'
  return [...array, array[0]];
};

/**
 * Splits an array into groups that loop back to the first value
 * @example
 * // returns [[1,2],[2,3],[3,1]]
 * loopifyInGroups(2)([1,2,3])
 * @example
 * // returns [[1,2,3],[3,1,2]]
 * loopifyInGroups(3,1)([1,2,3])
 * @returns {Array}
 */
const loopifyInGroups = (size, offset = 0) => arr => {
  let loopedArray = [];
  for (let i = 0; i < arr.length; i++) {
    let current = i + offset * i;
    let nextItems = [];
    for (let j = 1; j < size; j++) {
      let index;
      if (current + j < arr.length) {
        index = current + j;
      } else {
        index = current + j - arr.length;
      }
      nextItems.push(arr[index]);
    }
    if (current < arr.length) {
      loopedArray.push([arr[current], ...nextItems]);
    } else {
      break;
    }
  }
  return loopedArray;
};

/**
 * Returns an valid index even when its input value is out of bounds
 * @returns {Number}
 */
const safeIndex = arrayLength => index => {
  if (index < 0) {
    return (arrayLength + index % arrayLength) % arrayLength;
  } else if (index >= arrayLength) {
    return index % arrayLength;
  } else {
    return index;
  }
};

/**
 * Wraps its input into an array
 * @returns {Array}
 */
const wrap = item => [item];

module.exports = {
  safeIndex,
  loopifyInGroups,
  loopifyInPairs: loopifyInGroups(2),
  loopify,
  wrap
};
