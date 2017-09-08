const estimates = (inputs, volumes) => {
  // const sheets = ((
  //   (
  //     volumes.plywoodPortalFrame +
  //     volumes.plywoodConnectors +
  //     volumes.plywoodEndWalls
  //   ) * inputs.dimensions.cncwastefactor
  // ) / volumes.materials.singleSheet) + 6

  return {
    sheets: 200
  };
};

module.exports = estimates;
