/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('clone', {
  schema: {
    source: {default: '', type: 'selector'}
  },
  init: function () {
    var el = this.el;
    const { source } = this.data;
    for (let i = 0; i < source.children.length; i++) {
      // let child = data.id.children[i].object3D.clone()
      // el.object3D.add(child)
      let child = source.children[i].object3D.children[0]
      el.object3D.add(new THREE.Mesh(child.geometry, child.material))

      source.children[i].eventEmitter.on('geometryUpdate', (geometry) => {
        el.object3D.children[i].geometry = geometry;
      })
    }
  },
  // update: function () { console.log('update') },
  remove: function () { /* ... */ }
});
