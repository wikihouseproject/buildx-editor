const Angle = require('../../utils/angle');

it('converts degrees to radians', () => {
  expect(Angle.rad2Deg(2)).toEqual(114.59155902616465)
});

it('converts radians to degrees', () => {
  expect(Angle.deg2Rad(90)).toEqual(1.5707963267948966)
});
