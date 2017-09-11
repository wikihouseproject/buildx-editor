import Mouse from "./ui/controls/mouse";
import HUD from "./ui/controls/hud";
import House from "./components/house";
import SiteOutline from "./components/site_outline";
import { merge, debounce } from "lodash";
import Wren from "../lib/wren";
import config from "../config";
import TWEEN from "@tweenjs/tween.js";
import {
  ground,
  plane,
  raycaster,
  raycastPlane,
  groundPlane,
  loader
} from "./components";
import {
  renderer,
  container,
  scene,
  camera,
  stats,
  rendererStats,
  updateClippingPlane
} from "./ui/scene";
// import NoFlo from "./utils/fbp"; // not called noflo.js because of webpack ignore
// import { currentAction, changeCurrentAction }  from './ui/controls/sidebar'
import WrenWorker from "worker-loader?inline!../lib/wren/worker";

const renderObj = obj =>
  Object.keys(obj)
    .map(key => `<tr><td>${key}</td><td>${obj[key].join("")}</td></tr>`)
    .join("\n");

const metricsTable = document.getElementById("metrics");
const costsTable = document.getElementById("costs");
const updateFigures = ({ metrics, costs }) => {
  metricsTable.innerHTML = renderObj(metrics);
  costsTable.innerHTML = renderObj(costs);
};

const USING_WEBWORKERS = window.Worker && config.WEBWORKERS;
var wrenWorker = USING_WEBWORKERS ? new WrenWorker() : null;

let hitTestObjects = [],
  intersects = [],
  intersectFn = undefined,
  house = undefined,
  mouse = undefined,
  currentAction = "RESIZE";

const activeClass = "active";

// Export so NoFlo build can use it
// window.wren = Wren;

let { dimensions } = Wren.inputs();

const changeDimensions = house => newDimensions => {
  // if (NoFlo.nofloNetworkLive) {
  //   NoFlo.sendToRuntime(NoFlo.nofloRuntime, NoFlo.lastGraphName, 'parameters', { dimensions })
  //   return
  // }
  debounce(() => {
    dimensions = merge(dimensions, newDimensions);
    if (USING_WEBWORKERS) {
      wrenWorker.postMessage({ dimensions });
    } else {
      Wren({ dimensions }).then(({ inputs, outputs }) => {
        house.update({ inputs, outputs });
      });
    }
  }, 10)();
};

// function handleOutlineMesh(intersects) {
//   if (intersects.length > 0) {
//     house.outlineMesh.material.visible = true
//   } else {
//     if (!mouse.state.isDown) house.outlineMesh.material.visible = false
//   }
// }

function persist(obj, method) {
  fetch(window.project.buildings[0].endpoint, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
  });
}

function handleRotate(intersects, intersection) {
  // handleOutlineMesh(intersects)
  if (mouse.state.activeTarget) {
    mouse.orbitControls.enabled = false;
    house.output.rotation.y = mouse.state.position.x * 4;

    persist({ rotation: house.output.rotation }, "PATCH");
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

      const inputs = {
        [ball.userData.boundVariable]: ball.userData.bindFn(
          intersection[ball.userData.dragAxis],
          dimensions
        )
      };
      changeDimensions(house)(inputs);

      persist({ dimensions: inputs }, "PATCH");
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

      persist({ position: house.output.position }, "PATCH");
    }
  }
}

[...document.querySelectorAll("#controls li")].forEach(li =>
  li.addEventListener("click", changeCurrentAction)
);

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

var position = { x: 0, y: 80, z: 0 };
var target = { x: 0, y: 30, z: 24 };
camera.position.copy(new THREE.Vector3(position.x, position.y, position.z));
camera.lookAt(new THREE.Vector3(0, 0, 0));
var tween = new TWEEN.Tween(position).to(target, 1500);
tween.easing(TWEEN.Easing.Cubic.InOut);
tween.onUpdate(function() {
  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.position.z = position.z;
});

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

loader.load(
  "img/materials/plywood/birch.jpg",
  function(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    window.plyMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      overdraw: 0.5
    });
    loadData();
  },
  function(xhr) {
    console.log(xhr.loaded / xhr.total * 100 + "% loaded");
  },
  function(xhr) {
    console.error("An error occurred");
  }
);

function loadData() {
  const { hash } = window.location;
  window.project = {};
  if (hash !== "") {
    const matched = hash.match(/\d+/);
    if (matched) {
      window.project.id = parseInt(matched[0]);
      window.project.url = `${config.buildxURL}/projects/${window.project.id}`;
      fetch(window.project.url)
        .then(response => response.json())
        .then(json => {
          window.project = json;
          document.getElementById("add-building").href =
            window.project.newBuildingUrl;
          const siteOutline = SiteOutline(window.project.site.bounds.cartesian);
          scene.add(siteOutline);
          prerender(window.project.buildings);
        })
        .catch(ex => {
          prerender();
          console.error({ ex });
        });
    }
  }
}

function prerender(buildings = []) {
  let newDimensions = {};
  if (window.project.buildings && window.project.buildings.length > 0) {
    newDimensions = window.project.buildings[0].dimensions || {};
  }
  Wren({ dimensions: newDimensions }).then(res => {
    house = House(res);
    updateFigures(res.outputs.figures);

    if (USING_WEBWORKERS) {
      wrenWorker.onmessage = event => {
        house.update(event.data);
        updateFigures(event.data.outputs.figures);
      };
    }
    console.info(
      USING_WEBWORKERS ? "using webworkers" : "NOT using webworkers"
    );

    // NoFlo.setupRuntime((updatedGeometry) => {
    //   house.update(updatedGeometry.pieces)
    // })

    if (buildings.length > 0) {
      const { rotation, position } = window.project.buildings[0];
      if (rotation) {
        house.output.rotation.x = rotation._x || 0;
        house.output.rotation.y = rotation._y || 0;
        house.output.rotation.z = rotation._z || 0;
        house.output.rotation.order = rotation._order || "XYZ";
      }
      if (position) {
        house.output.position.x = position.x || 0;
        house.output.position.y = position.y || 0;
        house.output.position.z = position.z || 0;
      }

      const hud = HUD(dimensions, changeDimensions(house));
      mouse = Mouse(window, camera, renderer.domElement);
      mouse.events.on("all", mouseEvent);
      document.getElementById("figures").style.display = "block";
      scene.add(house.output);
      tween.start();
    } else {
      document.getElementById("add-building").style.display = "block";
    }

    requestAnimationFrame(render);
  });
}

function render() {
  stats.begin();
  TWEEN.update();
  renderer.render(scene, camera);
  if (mouse) {
    mouse.orbitControls.update();
  } // needed because of damping
  stats.end();
  rendererStats.update(renderer);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
