const volumes = () => {
  return {
    insulation: 420960
  }
}

module.exports = volumes

// function calculateVolumes(profile, length, params) {

//   // FIXME: don't use centimeters
//   const endWallArea = points => Clipper.area(points)/(100*100)

//   const endWallThickness = params.frameDepth;

//   const innerArea = endWallArea(profile.inner);
//   const outerArea = endWallArea(profile.outer);
//   const frameSection = outerArea - innerArea;
//   const frameVolume = frameSection * length.outer;
//   const endWallVolume = endWallThickness * innerArea; // endwall sits inside frame

//   const volumes = {
//     'insulationVolume': frameVolume + 2*endWallVolume, // rough est for insulation needed
//     'innerVolume': length.inner * innerArea,
//     'outerVolume': length.outer * outerArea,
//   };
//   return volumes;
// }
