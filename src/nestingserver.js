const http = require('http')

const express = require('express')
const multiparty = require('multiparty')
const jsjob = require('jsjob')


function readStream(stream, callback) {
  var buffers = []
  stream.on('data', (buffer) => {
    buffers.push(buffer)
  })
  stream.on('end', () => {
    const buffer = Buffer.concat(buffers)
    return callback(null, buffer)
  })
}

function readMultiPart(req, callback) {
  const form = new multiparty.Form()
  var filesData = {} // filename -> Buffer
  var fields = {}; // name -> value

  form.on('error', (err) => {
    return callback(err)
  })
  form.on('part', (part) => {
    if (part.filename) {
      readStream(part, (err, buf) => {
        filesData[part.filename] = buf
      })
    } else {
      readStream(part, (err, buf) => {
        fields[part.name] = buf.toString('utf-8')
      })
    }
  })
  form.on('close', () => {
    return callback(null, fields, filesData)
  })
  form.parse(req)
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
      return res.status(500).send("Unable to parse multi-part request")
    }
    if (!fields.bin) {
      return res.status(422).send("Missing bin identifier");
    }
    if (!files.svg) {
      return res.status(422).send("Missing svg file");
    }

    const svgData = files.svg.toString('utf-8')
    const binId =  fields.bin
    console.log('s', svgData.slice(0,10), binId)

    // XXX: ugly API that the cutsheet must exist as a SVG path already
    const inputData = { svg: svgData, bin: binId };
    const jobOptions = { maxTime: req.config.maxJobTime };

    req.runner.runJob(req.config.pluginUrl, inputData, jobOptions, (err, results, details) => {
      if (err) {
        return res.status(500).send(`Unable to nest file: ${err.message}`)
      }
      return res.json({files: results})
    })
  })
}


function setupJsJob(options, callback) {
  const runner = new jsjob.Runner(options);
  runner.start((err) => {
    callback(err, runner)
  })
}

function setupApp(runner, config) {
  const app = express()

  console.log('shehhee')

  // Inject the JsJob Runner instance request handlers using a middleware
  app.use((req, res, next) => {
    req.runner = runner
    req.config = config
    next()
  })

  app.post('/nest', doNestingSync)
  return app
}

function setupServer(options, callback) {

  const port = options.port || 3000
  const jsjobOptions = {}
  const config = {
    maxJobTime: 15, // seconds
    pluginUrl: 'http://localhost:8080/js/svgnest.bundle.js', // TODO: serve ourselves
    jsjob: {},
  }

  setupJsJob(config.jsjob, (err, runner) => {
    if (err) return callback(err)

    const app = setupApp(runner, config);
    app.listen(port, (err) => {
      return callback(err, app, port)
    })
  })
}

function main() {
  const callback = (err, app, port) => {
    if (err) {
      console.error(err)
      process.exit(2)
    }
    console.log(`Nesting server ready on port ${port}!`)
  }
  setupServer({ port: process.env.PORT }, callback)
}

if (!module.parent) {
  main()
}

module.exports = {
  main,
  setupServer,
}
