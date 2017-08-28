import fs from 'fs'
import http from 'http'
import path from 'path'

import superagent from 'superagent'
import { catchErrors } from '../../jest-hotfixes'
import bluebird from 'bluebird'
import rimraf from 'rimraf'

import SVG from '../../src/lib/wren/outputs/formats/svg'
import Wren from '../../src/lib/wren'
import nestingserver from '../../src/nestingserver'

// origin = top-left, positive Y downwards, clockwise points
const rectangle = (width, height, o) => {
  o = o || {};
  o.x = o.x || 0;
  o.y = o.y || 0;
  return [
    [ o.x, o.y ],
    [ o.x+width, o.y ],
    [ o.x+width, o.y+height ],
    [ o.x, o.y+height ],
  ];
}

const writeFile = bluebird.promisify(fs.writeFile)
const mkdirDir = bluebird.promisify(fs.mkdir)
const rmrf = bluebird.promisify(rimraf)

function writeFilesToNewDirectory(files, directory) {
  return rmrf(directory).then(() =>
    mkdirDir(directory)
  ).then(() =>
   bluebird.map(files, (contents, idx) => {
    const filePath = path.join(directory, `sheet-${idx}.svg`)
    return writeFile(filePath, contents)
  }))
}

describe('Nesting', () => {

  const serverOptions = {
    port: 9999,
    jobTime: 30,
  }
  let app = null;

  // Setup HTTP server
  beforeAll((done) => {
    nestingserver.setupServer(serverOptions, (err, a) => {
      app = a
      return done()
    });
  })
  afterAll((done) => {
    nestingserver.closeServer(app, done)
  })

  // Increase timeout for tests
  let originalInterval = 0;
  beforeEach(() => {
    originalInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 2*60*1000;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalInterval;
  });

  describe('sending default Wren outlines', () => {
    it('should return cutsheets', function () {

      return Wren().then((wren) => {
        const wrenSvg = wren.toSVG({onlyN: 15}) 

        const sheetStyle = "fill:none;stroke:#ff0000;stroke-opacity:1;stroke-width:6"
        const binId = 'cutsheet'
        const cutsheet = SVG.path(rectangle(4000, 5000), { id: binId, style: sheetStyle }) // FIXME: make cutsheet 1.2 x 2.4m
        const svgData = new Buffer(wrenSvg.replace('</svg>', cutsheet+'</svg>'))
  
        const req = superagent
          .post(`http://localhost:${serverOptions.port}/nest`)
          .field('bin', binId)
          .timeout(1*60*1000)
          .attach('svg', svgData, 'svg')
        return req
      }).then((res) => {
        expect(res.body.files).toBeInstanceOf(Array)
        expect(res.body.files.length).toBeGreaterThanOrEqual(2)
        expect(res.body.files.length).toBeLessThan(15)
        const r = res.body.files[0]
        expect(r).toMatch('</svg>')
        return writeFilesToNewDirectory(res.body.files, 'public/svgnest/wren-defaults-nested')
      });
    });
  });
});
