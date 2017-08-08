// CURRENTLY NOT BEING USED

const defaultParameterOrder = ['footprintArea', 'floorArea'];

function orderKeys(keys, order) {
  var sortedKeys = [];
  var unsortedKeys = [];

  const originalKeys = keys;
  originalKeys.map((key) => {
    const index = order.indexOf(key);
    if (index == -1) {
      unsortedKeys.push(key);
    } else {
      sortedKeys[index] = key;
    }
  });
  const allKeys = sortedKeys.concat(unsortedKeys);
  return allKeys;
}

// WARNING: does escape spaces, newlines or delimiters
function dumpKeyValues(object, options) {
  options = options || {};
  options.order = options.order || defaultParameterOrder;
  options.delimiter = options.delimiter || ';';
  options.newline = options.newline || '\n';

  // Ensure that there is a deterministic order when exporting
  // Important so that spreadsheets can expect values to appear in a certain place
  var orderedKeys = orderKeys(Object.keys(object), options.order);

  // Write header
  const header = orderedKeys.join(options.delimiter);
  const values = orderedKeys.map((k) => object[k]).join(options.delimiter);
  const out = header + options.newline + values + options.newline;
  return out;
}

module.exports = {
  dumpKeyValues
}
