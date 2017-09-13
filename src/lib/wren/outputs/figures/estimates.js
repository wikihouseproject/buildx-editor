const estimates = (inputs, areas, volumes) => {
  // const sheets = ((
  //   (
  //     volumes.portalFrame +
  //     // volumes.plywoodConnectors +
  //     volumes.endWalls
  //   ) * inputs.dimensions.cncWasteFactor
  // ) / volumes.materials.singleSheet) + 6

  // const sheets = parseInt(areas.external.surface/1000000) - 10

  const sheets = Math.floor(
    (volumes.portalFrame + volumes.endWalls) / 10000000000 * 0.23
  );

  return {
    sheets,
    daysRequiredToCNC: Math.ceil(sheets / 20)
  };
};

module.exports = estimates;
