import fs from 'fs'
import http from 'http'
import superagent from 'superagent'
import { catchErrors } from '../../jest-hotfixes'

import nestingserver from '../../src/nestingserver'

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

      req.end(catchErrors(done, (err, res) => {
        expect(err).not.toBeTruthy()
        expect(res.body.files).toBeInstanceOf(Array)
        expect(res.body.files).toHaveLength(1)
        const r = res.body.files[0]
        expect(r).toMatch('</svg>')
        return done();
      }));
    });
  });
});
