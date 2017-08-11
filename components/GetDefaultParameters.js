const noflo = require('noflo');
const Wren = window.Wren; // HACK

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Get default Wren model parameters';
  c.icon = 'forward';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Trigger'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  c.process(function (input, output) {
    // Check preconditions on input data
    if (!input.hasData('in')) {
      return;
    }
    // Read packets we need to process
    var ignored = input.getData('in');

    // Process data and send output
    const out = Wren().inputs;
    output.send({
      out: out
    });
    // Deactivate
    output.done();
  });
  return c;
};

