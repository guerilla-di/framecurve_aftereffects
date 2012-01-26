/*
	Apply Framecurve As Kronos
	
	Will import a Framecurve file and apply it to the selected layer using AE's Timewarp plugin.
	
	For more info, see http://framecurve.org/scripts
	
	Framecurve scripts are subject to MIT license
	http://framecurve.org/scripts/#license
	
*/
{
	// setValueAtTime expects floating-point SECONDS
	// and not frames, so we need to grab the comp FPS
	// and divide our framecurve value
	function convertFrameToSeconds(layerWithFootage, frameValue)
	{
		var comp = layerWithFootage.containingComp;
		var rate = 1.0 / comp.frameDuration;
		// Frames in AE are 0-based by default
		return (frameValue - 1) / rate;
	}

	function ApplyFramecurveAsKronos(thisObj)
	{
		var scriptName = "Apply Framecurve As Kronos";
		
		function applyFramecurveToLayer(layer, curveTuples)
		{
			var kronos = layer.Effects.addProperty("Timewarp");
			// Set retiming to "Source Frame" instead of "Speed"
			kronos.property("Adjust Time By").setValue(2);
			// Animate the source frame parameter
			for(var i = 0; i < curveTuples.length; i++) {
				var tuple = curveTuples[i];
				// Frame numbers are 0-based in AE
				kronos.property("Source Frame").setValueAtTime(convertFrameToSeconds(layer, tuple[0]), tuple[1] - 1);
			}
		}
		
		function applyFramecurve(curveTuples)
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
					applyFramecurveToLayer(selectedLayers[i], curveTuples);
				}
				
				// Finish the undo
				app.endUndoGroup();
			}
		}
		
		function onlyFramecurveFiles(file) {
			if(!file.type) return true; // Directory!
			
			if(file.name.match(/\.framecurve\.txt$/i)){ 
				return true;
			}
			return false;
		}
		
		function BuildAndShowUI(thisObj)
		{
			var f = File.openDialog("Select a framecurve file to open.", onlyFramecurveFiles, false);
			f.open("r");
			f.encoding = "UTF8";
			 var records = [];
			while (!f.eof){
				var line = f.readln();
				// Skip comments
				 if(!line.indexOf("#") == 0) {
						var tuple = line.split("\t");
						var dest = parseInt(tuple[0]);
						var source = parseFloat(tuple[1]);
						records.push([dest, source]);
				 }
			}
			
			// Now that we have a list of all the tuples, we can apply our effect.
			applyFramecurve(records);
		}
		
		var my_palette = BuildAndShowUI(thisObj);
	}
	
	
	ApplyFramecurveAsKronos(this);
}