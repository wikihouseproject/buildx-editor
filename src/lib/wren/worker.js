const Wren = require("./index");

onmessage = function(e) {
  Wren(e.data).then(({ inputs, outputs }) => {
    postMessage({ inputs, outputs });
  });
};
