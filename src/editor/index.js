import { ground } from "./components";
import { scale } from "./utils";
import * as uuid from "uuid";
import Mouse from "./ui/controls/mouse";
import HUD from "./ui/controls/hud";
import House from "./components/house";
import SiteOutline from "./components/site_outline";
import { merge } from "lodash";
import Wren from "../lib/wren";
import NoFlo from "./utils/fbp"; // not called noflo.js because of webpack ignore
import {
  renderer,
  container,
  scene,
  camera,
  stats,
  rendererStats,
  updateClippingPlane
} from "./ui/scene";
import config from "../config";

// import { currentAction, changeCurrentAction }  from './ui/controls/sidebar'

const { hash } = window.location;
window.projectID = null;
if (hash !== "") {
  const matched = hash.match(/\d+/);
  if (matched) {
    window.projectID = parseInt(matched[0]);
  }
}
fetch(`${config.buildxURL}/projects/${window.projectID}.json`)
  .then(response => response.json())
  .then(json => console.info(json))
  .catch(ex => console.error({ ex }));

// Export so NoFlo build can use it
window.wren = Wren;

import WrenWorker from "worker-loader?inline!../lib/wren/worker";

let house = undefined;

const CONFIG = {
  WEBWORKERS: true
};

const USING_WEBWORKERS = window.Worker && CONFIG.WEBWORKERS;

var wrenWorker = USING_WEBWORKERS ? new WrenWorker() : null;

let dimensions = Wren.inputs({}).dimensions;
const changeDimensions = house => newDimensions => {
  dimensions = merge(dimensions, newDimensions);

  // if (NoFlo.nofloNetworkLive) {
  //   NoFlo.sendToRuntime(NoFlo.nofloRuntime, NoFlo.lastGraphName, 'parameters', { dimensions })
  //   return
  // }

  if (USING_WEBWORKERS) {
    wrenWorker.postMessage({ dimensions });
  } else {
    Wren({ dimensions }).then(({ inputs, outputs }) => {
      house.update({ inputs, outputs });
    });
  }
};

const raycaster = new THREE.Raycaster();
const raycastPlane = new THREE.Plane();

// const groundPlane = new THREE.Plane([0,1,0])
const groundPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, 0, 0)
);
const plane = new THREE.Plane();

let hitTestObjects = [],
  intersects = [],
  intersectFn = undefined;

// function handleOutlineMesh(intersects) {
//   if (intersects.length > 0) {
//     house.outlineMesh.material.visible = true
//   } else {
//     if (!mouse.state.isDown) house.outlineMesh.material.visible = false
//   }
// }

function handleRotate(intersects, intersection) {
  // handleOutlineMesh(intersects)
  if (mouse.state.activeTarget) {
    mouse.orbitControls.enabled = false;
    house.output.rotation.y = mouse.state.position.x * 4;
  }
}

function handleResize(intersects, intersection) {
  if (mouse.state.activeTarget) {
    const ball = mouse.state.activeTarget.object;
    plane.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(plane.normal),
      ball.position
    );
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      // const results = ball.userData.bindFn(intersection[ball.userData.dragAxis], dimensions)//.map(r => r*1000)
      // const keys = ball.userData.boundVariable
      // let d = {}
      // console.log(keys, results)

      const d = {
        [ball.userData.boundVariable]: ball.userData.bindFn(
          intersection[ball.userData.dragAxis],
          dimensions
        )
      };
      changeDimensions(house)(d);
    }
  }
}

function handleMove(intersects, intersection) {
  // handleOutlineMesh(intersects)
  if (mouse.state.activeTarget) {
    if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
      // console.log(intersection)
      house.output.position.x = intersection.x;
      house.output.position.z = intersection.z;
    }
  }
}

[...document.querySelectorAll("#controls li")].forEach(li =>
  li.addEventListener("click", changeCurrentAction)
);

let currentAction = "RESIZE";
const activeClass = "active";

function changeCurrentAction(event) {
  currentAction = event.target.id;

  if (house && house.balls)
    house.balls.forEach(ball => (ball.visible = currentAction === "RESIZE"));

  // change activeState
  document
    .querySelectorAll("#controls li")
    .forEach(li => li.classList.remove(activeClass));
  event.target.classList.add(activeClass);
}

const mouse = Mouse(window, camera, renderer.domElement);
function mouseEvent() {
  if (!house) return;

  raycaster.setFromCamera(mouse.state.position, camera);
  hitTestObjects = [];
  intersectFn = function(x, y) {};

  // mouse.orbitControls.enabled = true

  if (currentAction === "RESIZE") {
    hitTestObjects = house.balls;
    intersectFn = handleResize;
  } else if (currentAction === "MOVE") {
    // hitTestObjects = [house.outlineMesh]
    hitTestObjects = [house.output];
    intersectFn = handleMove;
  } else if (currentAction === "ROTATE") {
    // hitTestObjects = [house.outlineMesh]
    hitTestObjects = [house.output];
    intersectFn = handleRotate;
  }

  intersects = raycaster.intersectObjects(hitTestObjects, true);
  mouse.handleIntersects(intersects);
  intersectFn(intersects, new THREE.Vector3());
}
mouse.events.on("all", mouseEvent);

var loader = new THREE.TextureLoader();
loader.load(
  "img/materials/plywood/birch.jpg",
  function(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    window.plyMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      overdraw: 0.5
    });

    prerender();
  },
  function(xhr) {
    console.log(xhr.loaded / xhr.total * 100 + "% loaded");
  },
  function(xhr) {
    console.error("An error occurred");
  }
);

function prerender() {
  Wren({ dimensions }).then(res => {
    house = House(res);
    const siteOutline = SiteOutline([
      [-8.050569244142638, -5.218374523904092],
      [-1.404946987204948, 8.786493856488088],
      [8.050569244142638, 3.478916349269395],
      [1.9401648870925472, -8.786493856488088]
    ]);

    if (USING_WEBWORKERS) {
      wrenWorker.onmessage = event => {
        house.update(event.data);
      };
    }
    console.info(
      USING_WEBWORKERS ? "using webworkers" : "NOT using webworkers"
    );

    // NoFlo.setupRuntime((updatedGeometry) => {
    //   house.update(updatedGeometry.pieces)
    // })

    const hud = HUD(dimensions, changeDimensions(house));

    // scene.add(ground(10*scale,10*scale))
    scene.add(house.output);
    scene.add(siteOutline);

    requestAnimationFrame(render);
  });
}

function render() {
  stats.begin();
  renderer.render(scene, camera);
  mouse.orbitControls.update(); // needed because of damping
  // // clippingPlane.position.y -= 0.01
  stats.end();
  rendererStats.update(renderer);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
