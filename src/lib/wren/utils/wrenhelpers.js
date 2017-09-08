const pieces = (_totalLength, maxPieceLength) => {
  let length = _totalLength;
  let lengths = [];
  while (length > 0) {
    if (length > maxPieceLength) {
      lengths.push(maxPieceLength);
    } else {
      lengths.push(length);
    }
    length -= maxPieceLength;
  }
  return lengths;
};

module.exports = {
  pieces
};
