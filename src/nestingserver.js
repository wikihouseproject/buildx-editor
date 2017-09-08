const http = require("http");
const fs = require("fs");

const express = require("express");
const multiparty = require("multiparty");
const jsjob = require("jsjob");

function readStream(stream, callback) {
  var buffers = [];
  stream.on("data", buffer => {
    buffers.push(buffer);
  });
  stream.on("end", () => {
    const buffer = Buffer.concat(buffers);
    return callback(null, buffer);
  });
}

function readMultiPart(req, callback) {
  const form = new multiparty.Form();
  var filesData = {}; // filename -> Buffer
  var fields = {}; // name -> value

  form.on("error", err => {
    return callback(err);
  });
  form.on("part", part => {
    if (part.filename) {
      readStream(part, (err, buf) => {
        filesData[part.filename] = buf;
      });
    } else {
      readStream(part, (err, buf) => {
        fields[part.name] = buf.toString("utf-8");
      });
    }
  });
  form.on("close", () => {
    return callback(null, fields, filesData);
  });
  form.parse(req);
}

// Proof-of-concept API for nesting parts into cutsheets
//
// Inputs:
// an SVG of all parts, plus a "bin" path for nest into
// Outputs:
// JSON object with array of SVG cutsheets
//
// XXX: Blocking HTTP.
// For production should crete a job in DB, put on a message queue return, and async update/notify when done
// Also a server-side API might not be just for nesting, but also handle other aspects of making production files
function doNestingSync(req, res) {
  readMultiPart(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send("Unable to parse multi-part request");
    }
    if (!fields.bin) {
      return res.status(422).send("Missing bin identifier");
    }
    if (!files.svg) {
      return res.status(422).send("Missing svg file");
    }

    const svgData = files.svg.toString("utf-8");
    const binId = fields.bin;

    // XXX: ugly API that the cutsheet must exist as a SVG path already
    const inputData = { svg: svgData, bin: binId };
    const jobOptions = { maxTime: req.config.jobTime };

    req.runner.runJob(
      req.config.pluginUrl,
      inputData,
      jobOptions,
      (err, results, details) => {
        if (err) {
          // QUESTION: stop jsjob and return res.end() here?
          return res.status(500).send(`Unable to nest file: ${err.message}`);
        }
        return res.json({ files: results });
      }
    );
  });
}

function serveJsJobScript(req, res) {
  fs.readFile(req.config.pluginPath, (err, content) => {
    if (err) {
      return res.status(500).send(`Failed to open svgnest.js: ${err.message}`);
    }

    res.set("Content-Type", "application/javascript");
    return res.send(content);
  });
}

function setupJsJob(options, callback) {
  const runner = new jsjob.Runner(options);
  runner.start(err => {
    callback(err, runner);
  });
}

function setupApp(runner, config) {
  const app = express();
  app.runner = runner;

  // Inject the JsJob Runner instance request handlers using a middleware
  app.use((req, res, next) => {
    req.runner = runner;
    req.config = config;
    next();
  });

  app.get("/svgnest.jsjob", serveJsJobScript);

  app.post("/nest", doNestingSync);
  return app;
}

function closeServer(app, done) {
  app.server.close(() => {
    return app.runner.stop(done);
  });
}

function setupServer(options, callback) {
  const port = options.port || 3000;
  const jsjobOptions = {};
  const config = {
    jobTime: 15 * 60, // seconds
    pluginUrl: `http://localhost:${port}/svgnest.jsjob`,
    pluginPath: "dist/js/svgnest.bundle.js",
    jsjob: {
      timeout: 30 * 60 * 1000 // hard cutoff
    }
  };
  for (var k in options) {
    config[k] = options[k];
  }

  setupJsJob(config.jsjob, (err, runner) => {
    if (err) return callback(err);

    const app = setupApp(runner, config);
    const server = app.listen(port, err => {
      app.server = server;
      return callback(err, app, port);
    });
    // Support super-long HTTP requests
    server.setTimeout(config.jsjob.timeout * 1.1);
  });
}

function main() {
  const callback = (err, app, port) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    console.log(`Nesting server ready on port ${port}!`);
  };
  setupServer({ port: process.env.PORT }, callback);
}

if (!module.parent) {
  main();
}

module.exports = {
  main,
  setupServer,
  closeServer
};
