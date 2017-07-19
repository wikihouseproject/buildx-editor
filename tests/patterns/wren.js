import chai from 'chai';

import * as wren from '../../src/lib/wren';

describe('wren.frame', () => {

  describe('with simple parameters', () => {
    const params = {
      width: 3.0,
      height: 3,
      wallHeight: 2.5,
      frameWidth: 0.300,
    };

    it('should spit out points', () => {
      const out = wren.finPoints(params);
      chai.expect(out).to.include.keys(['viewBox', 'points', 'bounds']);
    });
  });
});

describe('wren.SVG.export', () => {

  describe('when passed geometry', () => {
    const params = {
      width: 5.0,
      height: 3.0,
      wallHeight: 2.8,
      frameWidth: 0.300,
    };

    it('should render a SVG string', () => {
      const frame = wren.finPoints(params);
      const svg  = wren.SVG.export({ frame: frame, boundary: []});
      chai.expect(svg).to.be.a('string');
      chai.expect(svg).to.contain('</svg>');
    });
  });

});
