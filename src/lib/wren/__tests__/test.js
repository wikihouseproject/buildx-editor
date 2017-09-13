const Wren = require("../index");

const inputs = {
  dimensions: {
    width: 3900,
    length: 10800,
    leftWallHeight: 2400,
    rightWallHeight: 2400,
    roofApexOffset: 0,
    bays: 9,
    bayLength: 1200
  }
};

const m = x => parseFloat((x / 1000000).toFixed(2));
const m2 = x => parseFloat((x / 1000000).toFixed(2));
const m3 = x => parseFloat((x / 1000000000).toFixed(2));

it("calculates dimensions", () => {
  return Wren(inputs).then(wren => {
    expect(wren.outputs.figures.dimensions.internal.width).toEqual(3553);
    expect(wren.outputs.figures.dimensions.external.width).toEqual(4486);

    expect(wren.outputs.figures.dimensions.internal.length).toEqual(10604); // 10603
    expect(wren.outputs.figures.dimensions.external.length).toEqual(11250);

    expect(wren.outputs.figures.dimensions.internal.leftRoof).toEqual(
      2302.4788861774387
    );
    expect(wren.outputs.figures.dimensions.external.leftRoof).toEqual(
      2617.8869532698677
    );

    expect(wren.outputs.figures.dimensions.internal.rightRoof).toEqual(
      2302.4788861774387
    );
    expect(wren.outputs.figures.dimensions.external.rightRoof).toEqual(
      2617.8869532698677
    );

    // Footprint Area
    expect(m(wren.outputs.figures.areas.external.footprint)).toEqual(50.47);
    // Ext Surface Area
    expect(m(wren.outputs.figures.areas.external.surface)).toEqual(203.39); // 185.44
    // Int Floor Area
    expect(m(wren.outputs.figures.areas.internal.floor)).toEqual(37.68); // 75.34 (doubled)
    // Int Wall Area
    expect(m2(wren.outputs.figures.areas.internal.walls)).toEqual(72.18); // 88.89
    // Int Roof Area
    expect(m2(wren.outputs.figures.areas.internal.roof)).toEqual(48.83); // 49.24
    expect(m2(wren.outputs.figures.areas.external.roof)).toEqual(58.9);
    // Area of Openings
    // End wall area
    expect(m2(wren.outputs.figures.areas.internal.endWall)).toEqual(10.64); // 10.41

    // connectorsSheathing 4.812606
    // expect(wren.outputs.figures.volumes.portalFrame).toEqual(851272864.9562488)//2.638929);
    // expect(wren.outputs.figures.volumes.endWalls).toEqual(532055552.3337502); // 0.557496

    expect(wren.outputs.figures.volumes.insulation).toEqual(9576819730757.799); // 0.557496

    // 10m2 (expect 11) 24.79/unit
    // 9.18m2
    // 42m3 insulation volume

    // expect(wren.outputs.figures.volumes.materials.singleSheet).toEqual(53582400);
    expect(wren.outputs.figures.estimates.sheets).toEqual(220);
  });
});
