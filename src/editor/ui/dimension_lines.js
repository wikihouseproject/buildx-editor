const dimensionLines = (width, depth) => {
  const lines = new THREE.Object3D();
  const l1g = new THREE.Geometry();
  var lineMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
  l1g.vertices.push(
    new THREE.Vector3(width / 2, 0, depth),
    new THREE.Vector3(-width / 2, 0, depth)
  );
  const l1 = new THREE.Line(l1g, lineMaterial);
  lines.add(l1);
  const l2g = new THREE.Geometry();
  l2g.vertices.push(
    new THREE.Vector3(width / 2, 0, depth + 0.2),
    new THREE.Vector3(width / 2, 0, depth - 0.2)
  );
  const l2 = new THREE.Line(l2g, lineMaterial);
  lines.add(l2);
  return lines;
};

module.exports = dimensionLines;
