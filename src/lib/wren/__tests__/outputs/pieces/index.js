const Wren = require("../../../index");

const sortedKeys = ob => Object.keys(ob).sort();

describe("pieces", () => {
  var wren = null;

  beforeAll(() => {
    return Wren().then(w => {
      wren = w;
    });
  });

  it("generates frame pieces", () => {
    expect(sortedKeys(wren.outputs.pieces.frames[0])).toEqual([
      "fins",
      "reinforcers",
      "skis",
      "spacers"
    ]);
  });

  describe("bays", () => {
    it("generates bay pieces", () => {
      expect(sortedKeys(wren.outputs.pieces.bays[0])).toEqual([
        "connectors",
        "sides",
        "skis",
        "underboards"
      ]);
    });

    const positions = ["inner", "outer"];
    for (const position of positions) {
      it(`generates side.${position} pieces`, () => {
        expect(
          sortedKeys(wren.outputs.pieces.bays[0].sides[position])
        ).toEqual(["floor", "leftRoof", "leftWall", "rightRoof", "rightWall"]);
      });
    }
  });
});
