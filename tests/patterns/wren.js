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

describe('wren.metrics', () => {

  describe('when simple parameters', () => {
    var params = wren.parameters.defaults;
    params.totalBays = 10;
    params.bayLength = 1;
    params.width = 3;
    params.frameWidth = 0.01;
    
    it('should output areas', () => {
      const data = wren.geometrics(params);
      chai.expect(data).to.be.a('object');
      chai.expect(data).to.include.keys(['footprintArea', 'floorArea', 'roofArea', 'ceilingArea']);
      chai.expect(data).to.include.keys(['innerWallArea', 'outerWallArea']);
      chai.expect(Math.round(data.footprintArea)).to.equal(33);
      chai.expect(Math.round(data.floorArea)).to.equal(27);
      chai.expect(Math.round(data.ceilingArea)).to.equal(28);
      chai.expect(Math.round(data.roofArea)).to.equal(35);
      chai.expect(Math.round(data.innerWallArea)).to.equal(61);
      chai.expect(Math.round(data.outerWallArea)).to.equal(72);
    });
    it('should output volumes', () => {
      params.frameWidth = 0.2;
      const data = wren.geometrics(params);
      chai.expect(data).to.be.a('object');
      chai.expect(data).to.include.keys(['innerVolume', 'outerVolume']);
      chai.expect(data).to.include.keys(['insulationVolume']);
      chai.expect(Math.round(data.innerVolume)).to.equal(65);
      chai.expect(Math.round(data.outerVolume)).to.equal(103);
      chai.expect(Math.round(data.insulationVolume)).to.equal(27);
    });
  });

});
