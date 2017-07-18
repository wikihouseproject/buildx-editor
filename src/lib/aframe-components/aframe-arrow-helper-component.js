AFRAME.registerComponent('arrow-helper', {
  schema: {
    dir: {default: {x: 0, y: 1, z: 0}, type: 'vec3'}, // direction from origin. Must be a unit vector.
    // origin: {type: 'vec3'}, // Point at which the arrow starts. (use position instead)
    length: {default: 1, type: 'number'}, // length of the arrow
    color: {default: '#ffff00', type: 'color'}, // (called HEX in Three.js)
    headLength: {type: 'number'}, // Default is 0.2 * length.
    headWidth: {type: 'number'} // Default is 0.2 * headLength.
  },
  init: function () {
    const {dir, origin, length, color} = this.data;

    const normalizedDir = new THREE.Vector3(...Object.values(dir)).normalize()
    const arrowHelper = new THREE.ArrowHelper(
      normalizedDir,
      this.el.object3D.position,
      length,
      color
    )
    this.el.setObject3D('arrowHelper', arrowHelper)
  },
  // update: function () { console.log('update') },
  remove: function () {
    this.el.removeObject3D('arrowHelper')
  }

});
