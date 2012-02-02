/*
	FramecurveApplier base class
*/
function FramecurveApplier()
{
	function Correlation(atFrame, useFrameOfSource)
	{
		this.atFrame = parseInt(atFrame);
		this.useFrameOfSource = parseFloat(useFrameOfSource);
	}
	
	// setValueAtTime expects floating-point SECONDS
	// and not frames, so we need to grab the comp FPS
	// and divide our framecurve value
	this.convertFrameToSeconds = function(layerWithFootage, frameValue)
	{
		var comp = layerWithFootage.containingComp;
		var rate = 1.0 / comp.frameDuration;
		// Frames in AE are 0-based by default
		return (frameValue - 1) / rate;
	}
	
	var scriptName = "Apply Framecurve As Kronos";
	
	this.applyFramecurveToLayer = function(layer, curveTuples)
	{
		alert("Override applyFramecurveToLayer(layer, curveTuples) in your importer")
		
	}
	
	this.applyFramecurve = function(curveTuples)
	{
		var activeItem = app.project.activeItem;
		if ((activeItem == null) || !(activeItem instanceof CompItem)) {
			alert("Please select or open a composition first.", scriptName);
		} else {
			var selectedLayers = activeItem.selectedLayers;
			// By bracketing the operations with begin/end undo group, we can 
			// undo the whole script with one undo operation.
			app.beginUndoGroup(scriptName);

			for(var i = 0; i < selectedLayers.length; i++) {
				this.applyFramecurveToLayer(selectedLayers[i], curveTuples);
			}
			
			// Finish the undo
			app.endUndoGroup();
		}
	}
	
	this.onlyFramecurveFiles = function(file) {
		if(!file.type) return true; // Directory!
		
		if(file.name.match(/\.framecurve\.txt$/i)){ 
			return true;
		}
		return false;
	}
	
	this.run = function()
	{
		var f = File.openDialog("Select a framecurve file to open.", this.onlyFramecurveFiles, false);
		f.open("r");
		f.encoding = "UTF8";
		
		var records = [];
		
		while (!f.eof){
			var line = f.readln();
			// Skip comments
			if(!line.indexOf("#") == 0) {
					var tuple = line.split("\t");
					records.push(new Correlation(tuple[0], tuple[1]));
			}
		}
		
		// Do not leave dangling file descriptors
		f.close();
		
		// Now that we have a list of all the tuples, we can apply our effect.
		this.applyFramecurve(records);
	}
}

