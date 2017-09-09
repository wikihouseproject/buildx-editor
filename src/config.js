module.exports = (function() {
  if (__PRODUCTION__) {
    return {
      buildxURL: "https://beta.buildx.cc"
    };
  } else {
    return {
      buildxURL: "http://localhost:5000"
    };
  }
})();
