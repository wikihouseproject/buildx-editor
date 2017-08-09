import fs from 'fs'
import http from 'http'
import superagent from 'superagent'

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

describe('Nesting', () => {

  const serverOptions = {
    port: 9999,
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
    app.stop()
    return done()
  })

  // Increase timeout for tests
  let originalInterval = 0;
  beforeEach(() => {
    originalInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60*1000;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalInterval;
  });

  describe('sending svgnest example to API', () => {
    const svgData = fs.readFileSync('./public/svgnest/smallsimple.svg');

    it('should return cutsheets', function (done) {
      const req = superagent
        .post(`http://localhost:${serverOptions.port}/nest`)
        .field('bin', 'rect5794')
        .attach('svg', svgData, 'svg')
      req.end((err, res) => {
        expect(err).not.toBeTruthy()
        expect(res.body.files).toBeInstanceOf(Array)
        expect(res.body.files).toHaveLength(1)
        const r = res.body.files[0]
        expect(r).toMatch('</svg>')
        return done();
      });
    });
  });

  describe('sending default Wren outlines', () => {
    const wrenSvg = Wren().toSVG()
    const binId = 'cutsheet'
    
    const cutsheet = SVG.path(rectangle(1.2, 2.4), { id: binId })
    const svgData = new Buffer(wrenSvg.replace('</svg>', cutsheet+'</svg>'))

    it('should return cutsheets', function (done) {
      const req = superagent
        .post(`http://localhost:${serverOptions.port}/nest`)
        .field('bin', binId)
        .attach('svg', svgData, 'svg')
      req.end((err, res) => {
        if (err) err.message += `: ${JSON.stringify(res.text)}`
        expect(err).not.toBeTruthy()
        expect(res.body.files).toBeInstanceOf(Array)
        expect(res.body.files).toHaveLength(1)
        const r = res.body.files[0]
        expect(r).toMatch('</svg>')
        return done();
      });
    });
  });
});
