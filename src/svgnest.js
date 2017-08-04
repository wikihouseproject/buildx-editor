
// Import SvgNest
require('script-loader!../SVGnest/util/pathsegpolyfill.js');
require('script-loader!../SVGnest/util/matrix.js');
require('script-loader!../SVGnest/util/clipper.js');
require('script-loader!../SVGnest/util/geometryutil.js');
require('script-loader!../SVGnest/util/placementworker.js');
require('script-loader!../SVGnest/svgparser.js');
require('script-loader!../SVGnest/util/parallel.js');
require('script-loader!../SVGnest/svgnest.js');
//require('script-loader!../SVGnest/util/filesaver.js');

console.log("all deps loaded");

import workerCode from './svgnestworker';
window.SvgNest.workerCode = workerCode;

console.log("worker code loaded");

function checkSupport() {
	if(!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect){
		throw new Error('Your browser does not have SVG support');
	}
	
	if (!window.SvgNest) {
		throw new Error("Couldn't initialize SVGnest");
	}
	
	if(!window.File || !window.FileReader){
		throw new Error('Your browser does not have file upload support');
	}
	
	if(!window.Worker){
    throw new Error('Your browser does not have web worker support');
	}

}

function exportSvg(outputElement, baseSvg) {
	
	if (!baseSvg){
		baseSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	}
	
	var svg = baseSvg.cloneNode(false);
	
	// maintain stroke, fill etc of input
	if (SvgNest.style) {
		svg.appendChild(SvgNest.style);
	}

	for(var j=0; j<outputElement.childNodes.length; j++) {
		svg.appendChild(outputElement.childNodes[j].cloneNode(true));
	}
	
	var output;
	if (typeof XMLSerializer != 'undefined') {
		output = (new XMLSerializer()).serializeToString(svg);
	} else {
		output = svg.outerHTML;
	}
	
  return output;
}


function runSvgNest(svgData, binId, callback) {
  var config = {
    spacing: 0,
    curveTolerance: 0.3,
    rotations: 4,
    populationSize: 10,
    mutationRate: 10,
    useHoles: false,
    exploreConcave: false,
  };

  window.SvgNest.config(config);

  var svg = null;
	try {
		svg = window.SvgNest.parsesvg(svgData);
	}
	catch(e){
		return callback(e);
	}			

  var binElement = null;
  for (var i=0; i<svg.childNodes.length; i++) {
    var child = svg.childNodes[i];
    if (child.id == binId) {
      binElement = child;
    }
  }
  if (!binElement) {
    throw new Error("Could not find bin to fit into: " + binId);
  }
  window.SvgNest.setbin(binElement);

  var iterations = 0;
  var lastResult = null;
  var startTime = new Date();

  function done(err) {
    SvgNest.stop();

    if (!lastResult) {
      return callback(new Error("Timeout without result"), null, {});
    }

    var results = lastResult.svglist.map(function(e) { return exportSvg(e) } );
    // TODO: verify that numplaced == number-of-parts
    var details = {
      efficiency: lastResult.efficiency,
      numplaced: lastResult.numplaced,
    };
    return callback(err, results, details);
  }

  function onIteration(svglist, efficiency, numplaced) {
    console.log("Efficiency: ", efficiency);
    console.log("Placed: ", numplaced);
    lastResult = {
      svglist: svglist,
      efficiency: efficiency,
      numplaced: numplaced
    };

    // TODO: wait until placed with
    var goodResult = true;
    if (goodResult) {
      return done(null);
    }
  }

  var lastReport = new Date();
  function onProgress(percent) {
    var elapsedMs = (new Date()).getTime()-startTime.getTime();
    var sinceReport = (new Date()).getTime()-lastReport.getTime();
    if (sinceReport > 2*1000) {
      console.log("Running: ", percent, (elapsedMs/1000).toFixed(2));      
      lastReport = new Date();
    }

    // TODO: handle timeout
    var timedOut = elapsedMs > 30*1000;
    if (timedOut) {
      return done(null);
    }
  }		

  console.log('starting nesting 22');
  SvgNest.start(onProgress, onIteration);
}

window.jsJobRun = function(inputdata, options, callback) {

  // Verify environment setup
  try {
    checkSupport();
  } catch (e) {
    return callback(e);
  }

  // TODO: validate input data

  try {
    return runSvgNest(inputdata.svg, inputdata.bin, callback);
  } catch (e) {
    return callback(e);
  }
};
