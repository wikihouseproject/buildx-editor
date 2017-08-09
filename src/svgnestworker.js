
// Dependencies
import json from 'raw-loader!../SVGnest/util/json.js'
import matrix from 'raw-loader!../SVGnest/util/matrix.js'
import clipper from 'raw-loader!../SVGnest/util/clipper.js'
import geometryutil from 'raw-loader!../SVGnest/util/geometryutil.js'
import placementworker from 'raw-loader!../SVGnest/util/placementworker.js'

const workerCode = json + matrix + clipper + geometryutil + placementworker;
export default workerCode;
