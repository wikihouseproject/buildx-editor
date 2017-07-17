/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

// const shapeFromPathString = require('./lib/shape_from_path_string');
const transformSVGPath = require('./lib/transform_svg_path');
// const EventEmitter = require('events');
const EventEmitter = require('eventemitter3');

const extrudeShape = function(shape, data) {
  const extrusion = new THREE.ExtrudeGeometry(
    shape,
    {
      amount: data.amount,
      steps: data.steps,
      bevelEnabled: data.bevelEnabled
    }
  );
  return new THREE.BufferGeometry().fromGeometry(extrusion)
}

/**
 * Extrude SVG component for A-Frame.
 */
AFRAME.registerComponent('extrude-svg', {
  schema: {
    path: {type: 'string', default: 'm 1 1 l -2 0 l 0 -2 l 2 0 l 0 2'},
    amount: {type: 'number', default: 1}, // Depth to extrude the shape
    bevelEnabled: {type: 'boolean', default: false}, // Apply beveling to the shape
    bevelThickness: {type: 'number', default: 0.06}, // How deep into the original shape the bevel goes
    bevelSize: {type: 'number', default: 0.04 }, // Distance from the shape outline that the bevel extends. Default is bevelThickness - 0.02
    bevelSegments: {type: 'number', default: 3 }, // Number of bevel layers
    curveSegments: { type: 'number', default: 12 }, // Number of points on the curves
    steps: { type: 'number', default: 1 }, // Number of points used for subdividing segments along the depth of the extruded spline
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    const data = this.data;
    const el = this.el;

    this.el.eventEmitter = new EventEmitter();
    console.log(this.el.eventEmitter)
    this.shape = transformSVGPath(data.path);
    this.geometry = extrudeShape(this.shape, data);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    el.setObject3D('mesh', this.mesh);
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    // If `oldData` is empty, then this means we're in the initialization process.
    // No need to update.
    if (Object.keys(oldData).length === 0) { return; }
    const data = this.data;
    const el = this.el;

    var rebuild = false;
    // Geometry-related properties changed. Update the geometry.
    if (data.path !== oldData.path) {
      this.shape = transformSVGPath(data.path);
      rebuild = true;
    }
    if (
      data.amount !== oldData.amount ||
      data.steps !== oldData.steps ||
      data.bevelEnabled !== oldData.bevelEnabled
    ) {
      rebuild = true;
    }
    if (rebuild) {
      // remove previous geometry, then replace with newly calculated geometry
      el.getObject3D('mesh').geometry.dispose()
      el.getObject3D('mesh').geometry = this.geometry = extrudeShape(this.shape, data);
      // notify subscibers (clones) that they must update their geometry
      this.el.eventEmitter.emit('geometryUpdate', this.geometry);
    }
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
    this.el.removeObject3D('mesh');
  },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});
