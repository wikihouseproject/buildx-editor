import chai from 'chai';
import jsjob from 'jsjob';

import fs from 'fs'; 

describe('Nesting', () => {
  const pluginUrl = 'http://localhost:8080/assets/svgnest.bundle.js';

  describe('on svgnest example', () => {
    const svgData = fs.readFileSync('./public/test.svg', 'utf-8');

    it('should output areas', function (done) { 
      this.timeout(60*1000);

      var options = {};
      var runner = new jsjob.Runner(options);
      runner.start(function(err) {
        if (err) return done(err)

        var inputData = { svg: svgData, bin: 'rect5794'};
        var jobOptions = {};
        runner.runJob(pluginUrl, inputData, jobOptions, function(err, result, details) {
          if (err) return done(err)

          chai.expect(result).to.be.an('array');
          chai.expect(result).to.have.length(1);
          const r = result[0];
          chai.expect(r).to.be.a('string');
          chai.expect(r).to.include('</svg>');

          runner.stop(function(err) { });
        });
      });
    });
  });
});
