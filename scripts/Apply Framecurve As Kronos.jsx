/*
	Apply Framecurve As Kronos
	
	Will import a Framecurve file and apply it to the selected layer using AE's Timewarp plugin.
	
	For more info, see http://framecurve.org/scripts
	
	Framecurve scripts are subject to MIT license
	http://framecurve.org/scripts/#license
	
*/
$.evalFile("framecurve.jsx");

var applier = new FramecurveApplier();
applier.applyFramecurveToLayer = function(layer, curveTuples)
{
	var kronos = layer.Effects.addProperty("Timewarp");
	// Set retiming to "Source Frame" instead of "Speed"
	kronos.property("Adjust Time By").setValue(2);
	// Animate the source frame parameter
	for(var i = 0; i < curveTuples.length; i++) {
		var tuple = curveTuples[i];
		// Frame numbers are 0-based in AE
		
		kronos.property("Source Frame").setValueAtTime(applier.convertFrameToSeconds(layer, tuple.atFrame), tuple.useFrameOfSource - 1);
	}
}
applier.run();
