import chai from 'chai';

import * as wren from '../../src/lib/wren';

describe('wren.chassis', () => {

  describe('with simple parameters', () => {
    const params = wren.parameters.defaults;
    it('should spit out points', () => {
      const out = wren.chassis(params);
      chai.expect(out).to.include.keys(['frames']);
    });
  });
});

describe('wren.SVG.export', () => {

  describe('when passed geometry', () => {
    const params = wren.parameters.defaults;
    it('should render a SVG string', () => {
      const chassis = wren.chassis(params);
      const svg  = wren.SVG.export(chassis, params);
      chai.expect(svg).to.be.a('string');
      chai.expect(svg).to.contain('</svg>');
    });
  });

});
