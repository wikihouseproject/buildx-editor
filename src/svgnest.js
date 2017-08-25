
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


function runSvgNest(svgData, binId, options, callback) {

  options.efficiencyTarget = options.efficiencyTarget || 1.0; // 1=unreachable=run until maxTime
  options.maxTime = options.maxTime || 60.0; // seconds
  options.SvgNest = options.SvgNest || {};

  // All dimensions in millimeters
  var config = {
    spacing: 12, // give space for milling bit
    curveTolerance: 5,
    rotations: 4,
    populationSize: 10,
    mutationRate: 10,
    useHoles: false,
    exploreConcave: true, // most of the shapes are concave, L/V-like shapes
  };
  for (key in options.SvgNest) {
    config[key] = options.SvgNest[key];
  }

  window.SvgNest.config(config);

  var svg = null;
	try {
		svg = window.SvgNest.parsesvg(svgData);
	} catch(e){
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
  var lastProgress = null;
  var startTime = new Date();

  function done(err) {
    SvgNest.stop();

    if (!lastResult) {
      return callback(new Error("Timeout without a single placement"), null, {});
    }

    // Extra info that can be useful for debugging and/or performance monitoring
    var details = {
      efficiency: lastResult.efficiency,
      placedParts: lastResult.placedParts,
      totalParts: lastResult.totalParts,
      placementProgress: lastProgress.placementPercent,
      iterations: iterations,
    };

    // Check the various error cases
    if (err) {
      return callback(err, null, details);
    }
    if (details.totalParts != details.placedParts) {
      const placed = `${details.placedParts}/${details.totalParts}`;
      return callback(new Error(`Not all parts were placed: ${placed}`), null, details); 
    }

    console.log('la', lastResult, lastProgress);
    const results = lastResult.svglist.map(function(e) { return exportSvg(e) } );
    if (!(results.length >= 1)) {
      return callback(new Error("No sheets where returned from nesting"), null, details);
    }

    return callback(err, results, details);
  }

  function onIteration(svglist, efficiency, placed, total) {
    console.log('iteration', iterations, svglist, efficiency, placed, total);
    iterations += 1;

    if (!svglist) {
      return; // iteration did not yield new result
    }

    lastResult = {
      svglist: svglist,
      placedParts: placed,
      totalParts: total,
      efficiency: efficiency,
    };

    const goodEnough = efficiency >= options.efficiencyTarget;
    if (goodEnough) {
      return done(null);
    }
  }

  var lastReport = new Date();
  function onProgress(percent) {
    lastProgress = {
      placementPercent: percent,
    }

    const elapsedMs = (new Date()).getTime()-startTime.getTime();
    const sinceReport = (new Date()).getTime()-lastReport.getTime();
    if (sinceReport > 2*1000) {
      console.log("Running: ", percent, (elapsedMs/1000).toFixed(2));      
      lastReport = new Date();
    }

    const timedOut = elapsedMs > (options.maxTime*1000);
    if (timedOut) {
      return done(null);
    }
  }

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
    return runSvgNest(inputdata.svg, inputdata.bin, options, callback);
  } catch (e) {
    return callback(e);
  }
};
