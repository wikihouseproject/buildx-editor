const fin = require('../../pieces/fin')
const Clipper = require('../../patterns/clipper')

// const center = [
//   [100,60], // TR
//   [50,100], // T
//   [0,60], // TL
//   [0,0], // BL
//   [100,0] // BR
// ]
const inner = [
  [ 98, 59.03875 ], // TR
  [ 50, 97.43875 ], // T
  [ 2, 59.03875 ], // TL
  [ 2, 2 ], // BL
  [ 98, 2 ] // BR
]
const outer = [
  [ 102, 60.96125 ], // TR
  [ 50, 102.56125 ], // T
  [ -2, 60.96125 ], // TL
  [ -2, -2 ], // BL
  [ 102, -2 ] // BR
]

it('generates a fin', () => {
  const params = {
    // center,
    inner,
    outer,
    mapping: {
      rightRoof: [1,0],
      leftRoof: [2,1]
    }
  }
  expect(fin(params)).toEqual([
    [ -2, 60.96125 ],
    [ 50, 102.56125 ],
    [ 102, 60.96125 ],
    [ 98, 59.03875 ],
    [ 50, 97.43875 ],
    [ 2, 59.03875 ],
  ])
})
