import chai from 'chai';

import * as wren from '../../src/lib/wren';

describe('wren.frame', () => {

  describe('with simple parameters', () => {
    const params = {
      width: 10.0*100,
      height: 20.0*100,
      wallHeight: 8.0*100,
      frameWidth: 10.0,
    };

    it('should spit out points', () => {
      const out = wren.frame(params);
      chai.expect(out).to.include.keys(['viewBox', 'points', 'bounds']);
    });
  });
});

describe('wren.SVG.export', () => {

  describe('when passed geometry', () => {
    const params = {
      width: 10.0*100,
      height: 20.0*100,
      wallHeight: 8.0*100,
      frameWidth: 10.0,
    };

    it('should render a SVG string', () => {
      const frame = wren.frame(params);
      const svg  = wren.SVG.export({ frame: frame, boundary: []});
      chai.expect(svg).to.be.a('string');
      chai.expect(svg).to.contain('</svg>');
    });
  });

});
