const defaults = {
  WEBWORKERS: true
};

module.exports = (function() {
  if (__PRODUCTION__) {
    return Object.assign({}, defaults, {
      buildxURL: "https://beta.buildx.cc/api/v0"
    });
  } else {
    return Object.assign({}, defaults, {
      buildxURL: "http://localhost:5000/api/v0"
    });
  }
})();
