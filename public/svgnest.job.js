
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


function attachSvgListeners(svg){
	// attach event listeners
	for(var i=0; i<svg.childNodes.length; i++){
		var node = svg.childNodes[i];
		if(node.nodeType == 1){
			node.onclick = function(){
				if(display.className == 'disabled'){
					return;
				}
				var currentbin = document.querySelector('#select .active');
				if(currentbin){
					var className = currentbin.getAttribute('class').replace('active', '').trim();
					if(!className)
						currentbin.removeAttribute('class');
					else
						currentbin.setAttribute('class', className);
				}
				
				window.SvgNest.setbin(this);
				this.setAttribute('class',(this.getAttribute('class') ? this.getAttribute('class')+' ' : '') + 'active');
				
				start.className = 'button start animated bounce';
				message.className = '';
			}
		}
	}
}


function exportSvg() {

				if(download.className == 'button download disabled'){
					return false;
				}
				
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
				
				var blob = new Blob([output], {type: "image/svg+xml;charset=utf-8"});
			}

}


function loadSvg() {

					if(reader.result){
						try{
							var svg = window.SvgNest.parsesvg(reader.result);
							{
								var wholeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
								// Copy relevant scaling info
								wholeSVG.setAttribute('width',svg.getAttribute('width'));
								wholeSVG.setAttribute('height',svg.getAttribute('height'));
								wholeSVG.setAttribute('viewBox',svg.getAttribute('viewBox'));
								var rect = document.createElementNS(wholeSVG.namespaceURI,'rect');
								rect.setAttribute('x', wholeSVG.viewBox.baseVal.x);
								rect.setAttribute('y', wholeSVG.viewBox.baseVal.x);
								rect.setAttribute('width', wholeSVG.viewBox.baseVal.width);
								rect.setAttribute('height', wholeSVG.viewBox.baseVal.height);
								rect.setAttribute('class', 'fullRect');
								wholeSVG.appendChild(rect);
							}
							display.innerHTML = '';
							display.appendChild(wholeSVG); // As a default bin in background
							display.appendChild(svg);
						}
						catch(e){
							message.innerHTML = e;
							message.className = 'error animated bounce';
							return;
						}					
						
						hideSplash();
						message.innerHTML = 'Click on the outline to use as the bin';
						message.className = 'active animated bounce';
						start.className = 'button start disabled';
						
						attachSvgListeners(svg);
						attachSvgListeners(wholeSVG);
					}

}

// TODO: bundle into a single .JS file
		
		<script src="util/pathsegpolyfill.js"></script>
		<script src="util/matrix.js"></script>
		<script src="util/domparser.js"></script>
		<script src="util/clipper.js"></script>
		<script src="util/parallel.js"></script>
		<script src="util/geometryutil.js"></script>
		<script src="util/placementworker.js"></script>
		<script src="svgparser.js"></script>
		<script src="svgnest.js"></script>
		<script src="util/filesaver.js"></script>


function runSvgNest() {
  var config = {
    spacing: 0,
    curveTolerance: 0.3,
    rotations: 4,
    populationSize: 10,
    mutationRate: 10,
    useHoles: false,
    exploreConcave: false,
  };

  window.SvgNest.config(c);


	try{
		var svg = window.SvgNest.parsesvg(display.innerHTML);
		display.innerHTML = '';
		display.appendChild(svg);
	}
	catch(e){
		message.innerHTML = e;
		message.className = 'error animated bounce';
		return;
	}			
	
	attachSvgListeners(svg);


	var iterations = 0;
  var lastResult = null;
  var startTime = new Date();

  function onIteration(svglist, efficiency, numplaced) {
    console.log("Efficiency: ", efficiency);
    console.log("Placed: ", numplaced);
    lastResult = { svglist: svglist, efficiency: efficiency, numplaced: numplaced };
  }

  function onProgress(percent) {
    var elapsedMs = (new Date()).getTime()-startTime.getTime();
    console.log("Running: ", (elapsedMs/1000).toFixed(2));
  }		

	SvgNest.start(onProgress, onIteration);


  SvgNest.stop();
}

window.jsJobRun = function(inputdata, options, callback) {
  var err = null;
  var result = {'hello': 'jsjob'};
  var details = {'meta': 'data'}; // Can be used for information about the execution or results
  return callback(err, result, details);
};
