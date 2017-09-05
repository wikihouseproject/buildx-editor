import * as nofloTools from '../../lib/fbptools';

// NoFlo runtime setup
var nofloRuntime = null;
var lastGraphName = 'default/main';
var nofloNetworkLive = false

function setupRuntime(onOutput) {

  setupNoFlo((err, runtime) => {
    if (err) {
      throw err;
    }
    nofloRuntime = runtime;

    // Allow swithi
    const url = nofloTools.flowhubURL(runtime.id);
    const link = flowhubLink(url);
    link.id = 'flowhubLink';
    link.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      connectRuntime(nofloRuntime, onOutput) // switch to using NoFlo network for geometry calc
      runtime.openClient(link.getAttribute('href')); // Open Flowhub
    });
    document.body.appendChild(link);
  })

}

function connectRuntime(runtime, onOutput) {
  nofloNetworkLive = true

  const sendInputs = () => {
    sendToRuntime(runtime, lastGraphName, 'parameters', { dimensions } )
  }

  runtime.runtime.on('ports', (ports) => {
    lastGraphName = ports.graph
    // Assume a different network, and inputs need to be sent anew
    sendInputs()
  })

  // Data sent by NoFlo network
  runtime.runtime.on('packet', (msg) => {
      if (msg.event != 'data') {
          // ignore connect/disconnect
          return
      }
      //console.log('received', msg.port, msg)
      if (msg.port == 'geometry') {
        setTimeout(() =>
          onOutput(msg.payload)
        , 0)
      } else {
        console.log('NoFlo sent data on unknown port:', msg)
      }
  })

  // Send current values
  sendInputs()
}

function sendToRuntime(runtime, graphName, port, data) {
  //console.log('sending', graphName, port, data)
  const packet = {
    event: 'data',
    graph: graphName,
    port,
    payload: data,
  }
  runtime.runtime.sendPacket(packet, (err) => {
    if (err) {
      console.error('send packet failed', err)
    }
  })
}

function setupNoFlo(callback) {

  // Use a persistent runtime id
  const idKey = 'noflo_runtime_id';
  const storage = window.localStorage; // could also use sessionStorage
  var runtimeId = storage.getItem(idKey);
  if (!runtimeId) {
    runtimeId = uuid.v4();
    storage.setItem(idKey, runtimeId);
  }

  const o = {
    id: runtimeId,
    namespace: 'buildx-editor',
    repository: 'wikihouse-project/buildx-editor',
  }

  nofloTools.setupAndRun(o, (err, runtime) => {
    return callback(err, runtime);
  });

}

function flowhubLink(url) {
  var link = document.createElement('a');
  link.innerHTML = "Open in Flowhub";
  link.className = "debug";
  link.href = url;
  link.target = '_blank';
  return link;
}

module.exports = {
  nofloRuntime,
  nofloNetworkLive,
  sendToRuntime,
  lastGraphName,
  setupRuntime
}
