AFRAME.registerComponent('hello', {
  schema: {
    name: {default: 'unknown', type: 'string'}
  },
  init: function () {
    console.log('hello', this.data.name)
  },
  update: function () {
    console.log('my name is now', this.data.name)
  },
  // update: function () { console.log('update') },
  // remove: function () { /* ... */ }
});
