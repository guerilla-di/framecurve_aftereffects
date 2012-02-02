/*
	Apply Framecurve As Time Remap
	
	Will import a Framecurve file and apply it to the selected layer using AE's layer time remap.
	
	For more info, see http://framecurve.org/scripts
	
	Framecurve scripts are subject to MIT license
	http://framecurve.org/scripts/#license
	
*/
$.evalFile("framecurve.jsx");

var applier = new FramecurveApplier();
applier.applyFramecurveToLayer = function(layer, curveTuples)
{
	var prop = layer.property("Time Remap");
	// Remove old keys
	while(prop.numKeys > 0) {
		prop.removeKey(1);
	}
	layer.timeRemapEnabled = true;
	for(var i = 0; i < curveTuples.length; i++) {
		var tuple = curveTuples[i];
		// Frame numbers are 0-based in AE
		prop.setValueAtTime(tuple[0], applier.convertFrameToSeconds(layer, tuple[1]));
	}
}
applier.run();
