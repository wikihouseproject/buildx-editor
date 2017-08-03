
// Import SvgNest
require('script-loader!../SVGnest/util/pathsegpolyfill.js');
require('script-loader!../SVGnest/util/matrix.js');
require('script-loader!../SVGnest/util/clipper.js');
require('script-loader!../SVGnest/util/parallel.js');
require('script-loader!../SVGnest/util/geometryutil.js');
require('script-loader!../SVGnest/util/placementworker.js');
require('script-loader!../SVGnest/svgparser.js');
require('script-loader!../SVGnest/svgnest.js');
require('script-loader!../SVGnest/util/filesaver.js');


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

function exportSvg() {

	if(download.className == 'button download disabled'){
		return false;
	}
	
  // FIXME: take as input to function
	var bins = document.getElementById('bins');
	
	if(bins.children.length == 0){
		message.innerHTML = 'No SVG to export';
		message.className = 'error animated bounce';
		return
	}
	
	var svg;
	svg = display.querySelector('svg');
	
	if(!svg){
		svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	}
	
	svg = svg.cloneNode(false);
	
	// maintain stroke, fill etc of input
	if(SvgNest.style){
		svg.appendChild(SvgNest.style);
	}
	
	var binHeight = parseInt(bins.children[0].getAttribute('height'));
	
	for(var i=0; i<bins.children.length; i++){
		var b = bins.children[i];
		var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		group.setAttribute('transform', 'translate(0 '+binHeight*1.1*i+')');
		for(var j=0; j<b.children.length; j++){
			group.appendChild(b.children[j].cloneNode(true));
		}
		
		svg.appendChild(group);
	}
	
	var output;
	if(typeof XMLSerializer != 'undefined'){
		output = (new XMLSerializer()).serializeToString(svg);
	}
	else{
		output = svg.outerHTML;
	}
	
  return output;
}


function runSvgNest(svgData, callback) {
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

  // FIXME: find/create/set the bin
  // window.SvgNest.setbin(this);

  var iterations = 0;
  var lastResult = null;
  var startTime = new Date();

  function done(err) {
    SvgNest.stop();
    var result = lastResult.svglist;
    // TODO: verify that numplaced == number-of-parts
    var details = {
      efficiency: lastResult.efficiency,
      numplaced: lastResult.numplaced,
    };
    return callback(err, result, details);
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

  function onProgress(percent) {
    var elapsedMs = (new Date()).getTime()-startTime.getTime();
    console.log("Running: ", (elapsedMs/1000).toFixed(2));
    // TODO: handle timeout
    var timedOut = false;
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

  // TODO: read and validate input data

  return runSvgNest(inputdata, callback);
};
