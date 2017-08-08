import jsjob from 'jsjob';
import fs from 'fs';

describe('Nesting', () => {
  const pluginUrl = 'http://localhost:8080/js/svgnest.bundle.js';

  describe('on svgnest example', () => {
    const svgData = fs.readFileSync('./public/svgnest/smallsimple.svg', 'utf-8');

    let originalInterval = 0;

    beforeEach(() => {
      originalInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 60*1000;
    });

    it('should output areas', function (done) {
      // this.timeout(60*1000);

      var options = {};
      var runner = new jsjob.Runner(options);
      runner.start(function(err) {
        if (err) return done(err)

        var inputData = { svg: svgData, bin: 'rect5794'};
        var jobOptions = { maxTime: 15 };
        runner.runJob(pluginUrl, inputData, jobOptions, function(err, result, details) {
          if (err) return done(err)

          expect(result).toBeInstanceOf(Array);
          expect(result).toHaveLength(1);
          const r = result[0];
          expect(r).toMatch('</svg>');

          runner.stop(function(err) { return done(err); });
        });
      });
    });

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalInterval;
    });

  });
});
