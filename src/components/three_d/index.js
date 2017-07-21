import '../../lib/aframe-components/aframe-extrude-svg-component'
import '../../lib/aframe-components/aframe-clone-component'
import '../../lib/aframe-components/aframe-arrow-helper-component'
import 'aframe-orbit-controls-component-2'

import {h, div} from '@cycle/dom'
import xs from 'xstream'
import * as uuid from 'uuid'

import {renderFramePart, renderFrames, renderArrowHelpers} from './extras'
import { intent, model, renderControls } from '../../extras/functions'
import { initialCameraPosition, colors, extrusion } from '../../extras/config'

import * as noflo from '../../lib/noflo';
import * as wren from '../../lib/wren';

var globalHackRuntime = null;

export default function ThreeD(sources) {

  const idKey = 'noflo_runtime_id';
  const storage = window.localStorage; // could also use sessionStorage
  var runtimeId = storage.getItem(idKey);
  if (!runtimeId) {
    runtimeId = uuid.v4();
    // Persistence DISABLED, due to https://github.com/noflo/noflo-ui/issues/748
    //storage.setItem(idKey, runtimeId);
  }

  noflo.setupAndRun({ id: runtimeId }, (err, runtime) => {
    if (err) {
      throw err;
    }
    console.log('NoFlo running');
    globalHackRuntime = runtime;
  });

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map(([width, height, wallHeight, spacing, totalBays]) => {

    var p = wren.parameters.defaults;
    p.width = width;
    p.height = height;
    p.wallHeight = wallHeight;
    p.totalBays = totalBays;
    p.bayLength = spacing;

    const chassis = wren.chassis(p);

    const dimensions = [width, height, wallHeight]
    const bounds = spacing * totalBays + extrusion

    const flowhubLink = (runtime) => {
      var attrs = { target: '_blank' };
      if (runtime) {
        attrs.href = noflo.flowhubURL(runtime.signaller, runtime.id);
      } else {
        attrs.style = { 'display': 'none' };
      }
      return h('a', { attrs }, ['Open in Flowhub']);
    };

    return div([
      flowhubLink(globalHackRuntime),
      h('a-scene', {attrs: {stats: true}}, [

        ...renderArrowHelpers('0 0 0', 5),

        h('a-entity', [
          h('a-entity#cameraTarget',{ attrs: {position: '0 0 0' }}, ),
          h('a-entity#frames', {attrs:{position: `-${width/2} ${height} 0`, rotation: '180 0 0'}}, [
            h('a-entity#frame', {attrs:{position: '0 0 0'}},
              colors.map((c, i) => renderFramePart(chassis.frames[0], i, p.frameDepth, {color: c}))
            ),
            h('a-entity#bounding-frame', {attrs:{position: `0 0 ${-bounds/2}`}},
              colors.map((c, i) => renderFramePart(chassis.frames[0], i, bounds, {opacity: 0}))
            ),
            ...renderFrames(chassis.frames.length, spacing)
          ]),
        ]),

        h('a-entity#ground', {attrs:{
          geometry:{ primitive: 'plane', width: 20, height: 20},
          material: {color: '#CCC', side: 'double'},
          position: '0 -0.1 0', rotation: '-90 0 0'
        }}),

        h('a-entity#camera', {attrs:{
          camera: { fov: 90, zoom: 1 },
          position: initialCameraPosition,
          'orbit-controls': {
            invertZoom: true,
            target: '#cameraTarget',
            autoRotate: false,
            enableDamping: true,
            dampingFactor: 0.125,
            rotateSpeed:0.1,
            minDistance:3,
            maxDistance:100,
            maxPolarAngle: Math.PI/2
          }
        }})

      ]),
      ...renderControls(p)
    ])
  })

  return { DOM: vtree$ }
}
