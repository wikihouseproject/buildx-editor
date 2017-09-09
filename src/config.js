module.exports = (function() {
  if (__PRODUCTION__) {
    return {
      buildxURL: "https://beta.buildx.cc/api/v0"
    };
  } else {
    return {
      buildxURL: "http://localhost:5000/api/v0"
    };
  }
})();
