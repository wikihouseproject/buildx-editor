
const r = window['require'];
const noflo = r('noflo');
const nofloWebRTC = r('noflo-runtime-webrtc');


export function flowhubURL(signalServer, runtimeId, options) {
  options = options || {};
  options.ide = options.ide || 'http://app.flowhub.io';
  const protocol = 'webrtc';
  const address = `${signalServer}#${runtimeId}`;
  const params = `protocol=${protocol}&address=${address}&id=${runtimeId}`;
  var debugUrl = options.ide+'#runtime/endpoint?'+encodeURIComponent(params);
  return debugUrl;
}

function createRuntime(libraryPrefix, options) {

  options = options || {};
  options.protocol = options.protocol || 'webrtc';
  options.signalServer = options.signalServer || 'https://api.flowhub.io';

  if (options.id) {
    options.address = options.signalServer + "#" + options.id;
  }

  var runtimeOptions = {
    baseDir: libraryPrefix,
    defaultPermissions: [
      'protocol:graph',
      'protocol:component',
      'protocol:network',
      'protocol:runtime',
      'component:getsource',
      'component:setsource'
    ]
  };

  if (options.graph) {
    runtimeOptions.defaultGraph = options.graph;
  }

  var runtime = null;
  if (options.protocol == 'webrtc') {
    if (options.address) {
      // ID to use specified from outside, normally by Flowhub IDE
      runtime = nofloWebRTC(options.address, runtimeOptions, true);
    } else {
      // Generate new ID
      runtime = nofloWebRTC(null, runtimeOptions, true);
      runtime.signaller = options.signalServer;
    }
  } else if (queryProtocol == 'iframe') {
    runtime = iframeRuntime(runtimeOptions);
  }
  return runtime;
}

export function setupAndRun(options, callback) {
  options = options || {};
  const libraryPrefix = 'buildx-sprint';
  const mainGraph = 'main';

  const loader = new noflo.ComponentLoader(libraryPrefix);

  loader.load(mainGraph, function (err, instance) {
    if (err) { return callback(err); }

    instance.on('ready', function () {
      const graph = instance.network.graph;
      const runtime = createRuntime(libraryPrefix, { graph: graph, id: options.id });
      runtime.start();
      setTimeout(() => {
        return callback(null, runtime);
      }, 100);
    });
  });
}

function sendTo(component, portName, data) {
  const socket = noflo.internalSocket.createSocket()
  const port = component.inPorts[portName]
  port.attach(socket);
  socket.send(data);
  port.detach(socket);
}

export function sendToInport(runtime, graphName, portName, data) {
  const graph = runtime.graph.graphs[graphName];
  const network = runtime.network.networks[graphName]
  if (!(graph && network)) {
    throw new Error("Could not find graph named " + graphName);
  }

  const internal = graph.inports[portName];
  if (!(internal && internal.process && internal.port)) {
    throw new Error("No exported port named " + portName);
  }

  const node = network.network.getNode(internal.process);
  if (!(node && node.component)) {
    throw new Error("Could not find node for exported port " + portName);
  }

  return sendTo(node.component, internal.port, data);  
}
