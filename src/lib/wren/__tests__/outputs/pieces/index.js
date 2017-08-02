describe.skip('pieces', () => {
  const wren = Wren();
  it('generates fin pieces', () => {
    expect(wren.outputs.pieces.fins).toBeInstanceOf(Array)
  })
  it('generates side pieces', () => {
    expect(wren.outputs.pieces.fins).toBeInstanceOf(Array)
  })
  // console.log(SVG.svg([SVG.g(Object.values(wren.outputs.pieces.sides).map(SVG.path))]))
  // console.log(wren.outputs.pieces.fins.map(SVG.path))
  // console.log(SVG.svg([SVG.g(Object.values(wren.outputs.pieces.fins[0]).map(SVG.path))]))
  const finPoints = Object.values(wren.outputs.pieces.fins[0])
  // console.log(SVG.drawSVG(finPoints))
  // console.log(finPoints)
})
