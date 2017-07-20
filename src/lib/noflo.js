
const r = window['require'];
const noflo = r('noflo');
const nofloWebRTC = r('noflo-runtime-webrtc');

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var queryProtocol = getParameterByName('fbp_protocol');
var queryAddress = getParameterByName('fbp_address');
var queryNoLoad = getParameterByName('fbp_noload');

export function flowhubURL(signalServer, runtimeId, options) {
  options.ide = options.ide || 'http://app.flowhub.io';
  const protocol = 'webrtc';
  const address = `${signalServer}+'#'+${runtimeId}`;
  const params = `protocol=${protocol}&address=${address}'+`;
  var debugUrl = options.ide+'#runtime/endpoint?'+encodeURIComponent(params);
  return debugUrl;
}

function createRuntime(libraryPrefix, options) {

  options = options || {};
  options.protocol = options.protocol || 'webrtc';
  options.signalServer = options.signalServer || 'https://api.flowhub.io';

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
      runtime.network.on('addnetwork', function () {
        return callback(null, runtime);
      });
      runtime.start();
    });
  });
}

