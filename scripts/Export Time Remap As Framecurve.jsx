/*
	Export Time Remap As Framecurve
	
	Will export the selected AE animation channel as a Framecurve file for use in other programs.
	
	For more info, see http://framecurve.org/scripts
	
	Framecurve scripts are subject to MIT license
	http://framecurve.org/scripts/#license
	
*/
{
	function propertyToRecords(layer)
	{
		// Export to the end of comp
		var fromSeconds = layer.startTime;
		var toSeconds = layer.containingComp.workAreaStart + layer.containingComp.workAreaDuration;
		var remap = layer.property("Time Remap");
		var frameDuration = layer.containingComp.frameDuration;
		var records = [];
		
		var startFrame = fromSeconds / frameDuration;
		var endFrame = toSeconds / frameDuration;

		// And sssample!
		var PRE_EXPR = false;
		
		for(var at = startFrame; at <= endFrame; at += 1) {
			var compTime = at * frameDuration;
			var secondsValue = remap.valueAtTime(compTime, PRE_EXPR);
			var frameValue = secondsValue * (1 / frameDuration);
			records.push([at - startFrame + 1, frameValue + 1]);
		}
		return records;
	}
	
	function writeRecords(recordsArr)
	{
		var outFile = File.saveDialog("Select a Framecurve File To Save (please add the .framecurve.txt extension!)", "FromAE.framecurve.txt", ".framecurve.txt");
		outFile.open("w");
		try {
			outFile.write("# http://framecurve.org/specification-v1\n");
			outFile.write("# at_frame\tuse_frame_of_source\n");
			outFile.write("# Exported from AfterEffects with the official Framecurve script\n");
			for(var i = 0; i < recordsArr.length; i++) {
				var rec = recordsArr[i];

				outFile.write(rec[0])
				outFile.write("\t")
				outFile.write(rec[1].toFixed(5))
				outFile.write("\n")
			}
		} catch(e) {
			alert("Sorry, no can do. Make sure Preferences -> General -> Allow Scripts To Write Files And Access Network is enabled. " +
				"Otherwise we cannot write any files."
			);
			return;
		} finally {
			outFile.close();
		}
		
	}
	function exportTimeRemapOf(layer)
	{
		// Frames in AE are 0-based by default
		var from = layer.startTime;
		// Bake the animation curve to correlations
		var records = propertyToRecords(layer);
		writeRecords(records);
	}
	
	function ExportPropertyInit(thisObj)
	{
		var scriptName = "Export Selected Property As Framecurve";
		
		var activeItem = app.project.activeItem;
		if ((activeItem == null) || !(activeItem instanceof CompItem)) {
			alert("Please select or open a composition first and select a layer with Time Remap enabled.", scriptName);
			return;
		}
		
		var selectedLayer = activeItem.selectedLayers[0];
		// Do the job
		exportTimeRemapOf(selectedLayer);
	}
	
	
	ExportPropertyInit(this);
}