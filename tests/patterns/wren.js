import chai from 'chai';

import wren from '../../src/lib/wren';

describe('wren', () => {

  describe('with simple parameters', () => {
    const params = {
      width: 10.0*100,
      height: 20.0*100,
      wallHeight: 8.0*100,
      frameWidth: 10.0,
    };

    it('should spit out points', () => {
      const out = wren(params);
      chai.expect(out).to.include.keys(['viewBox', 'points', 'bounds', 'close']);
    });
  });
});
