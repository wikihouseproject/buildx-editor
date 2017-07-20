// From https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Set
export function isSuperset(self, subset) {
  for (var elem of subset) {
    if (!self.has(elem)) {
        return false;
    }
  }
  return true;
}

export function union(self, setB) {
  var union = new Set(self);
  for (var elem of setB) {
    union.add(elem);
  }
  return union;
}

export function unionAll(self, ...others) {
  var union = new Set(self);
  for (var set of others) {
    for (var elem of set) {
      union.add(elem);
    }
  }

  return union;
}

export function intersection(self, setB) {
  var intersection = new Set();
  for (var elem of setB) {
    if (self.has(elem)) {
      intersection.add(elem);
    }
  }
  return intersection;
}

export function difference(self, setB) {
  var difference = new Set(self);
  for (var elem of setB) {
    difference.delete(elem);
  }
  return difference;
}

export function symmetricDifference(setA, setB) {
  const onlyA = difference(setA, setB);
  const onlyB = difference(setB, setA);
  return union(onlyA, onlyB);
}
