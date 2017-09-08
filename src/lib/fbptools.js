// Some hacking needed to avoid webpack picking up the NoFlo include, as that currently fails
var NOFLO = null;
var nofloPostMessage = null;
if (typeof window !== "undefined") {
  const r = window["require"];
  if (r) {
    nofloPostMessage = r("noflo-runtime-postmessage");
    NOFLO = r("noflo");
  }
} else if (typeof self !== "undefined") {
  const r = self["require"];
  NOFLO = new Error("NoFlo not bundled in WebWorker");
} else {
  const r = global["require"];
  NOFLO = require("noflo");
}

export const noflo = NOFLO;

export function flowhubURL(runtimeId, options) {
  options = options || {};
  options.ide = options.ide || "https://app.flowhub.io";
  const protocol = "opener";
  const address = window.location.href;
  var params = `protocol=${protocol}&address=${address}`;
  if (runtimeId) {
    params = `&id=${runtimeId}`;
  }
  var debugUrl =
    options.ide + "#runtime/endpoint?" + encodeURIComponent(params);
  return debugUrl;
}

function createRuntime(libraryPrefix, options) {
  options = options || {};
  options.protocol = options.protocol || "opener";

  if (options.id) {
    options.address = window.location.href;
  }

  var runtimeOptions = {
    baseDir: libraryPrefix,
    defaultPermissions: [
      "protocol:graph",
      "protocol:component",
      "protocol:network",
      "protocol:runtime",
      "component:getsource",
      "component:setsource"
    ]
  };

  if (options.graph) {
    runtimeOptions.defaultGraph = options.graph;
  }
  if (options.repository) {
    runtimeOptions.repository = options.repository;
  }
  if (options.namespace) {
    runtimeOptions.namespace = options.namespace;
  }

  var runtime = null;
  if (options.protocol == "opener") {
    runtime = nofloPostMessage.opener(runtimeOptions);
  } else if (options.protocol == "iframe") {
    runtime = nofloPostMessage.iframe(runtimeOptions);
  }
  return runtime;
}

export function setupAndRun(options, callback) {
  options = options || {};
  const libraryPrefix = "buildx-editor";
  const mainGraph = "main";

  const loader = new noflo.ComponentLoader(libraryPrefix);

  loader.load(mainGraph, function(err, instance) {
    if (err) {
      return callback(err);
    }

    instance.on("ready", function() {
      const graph = instance.network.graph;
      const o = {
        graph: graph,
        id: options.id,
        namespace: options.namespace,
        repository: options.respository
      };
      const runtime = createRuntime(libraryPrefix, o);
      if (!runtime) {
        return callback(new Error("Unable to create a NoFlo runtime"));
      }
      runtime.start();
      setTimeout(() => {
        return callback(null, runtime);
      }, 100);
    });
  });
}
