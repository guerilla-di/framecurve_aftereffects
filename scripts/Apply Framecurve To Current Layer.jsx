/*
	Apply Framecurve To Current Layer
	
	Will import a Framecurve file and apply it to the selected layer
	
	For more info, see http://framecurve.org/scripts
	
	Framecurve scripts are subject to MIT license
	http://framecurve.org/scripts/#license
	
*/
/*
	FramecurveApplier base class
*/
function FramecurveApplier()
{
	function Correlation(atFrame, useFrameOfSource)
	{
		this.atFrame = parseInt(atFrame);
		this.useFrameOfSource = parseFloat(useFrameOfSource);
		this.toString = function() {
			return this.atFrame.toFixed(0) + "\t" + this.useFrameOfSource.toFixed(5);
		}
	}
	
	// setValueAtTime expects floating-point SECONDS
	// and not frames, so we need to grab the comp FPS
	// and divide our framecurve value
	this.convertFrameToSeconds = function(layerWithFootage, frameValue)
	{
		var relativeSeconds = this.convertFrameToLayerSeconds(layerWithFootage, frameValue);
		var startTime = layerWithFootage.startTime;
		return startTime + relativeSeconds;
	}
	
	this.convertFrameToLayerSeconds = function(layerWithFootage, frameValue)
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

var kronosApplier = new FramecurveApplier();
kronosApplier.applyFramecurveToLayer = function(layer, curveTuples)
{
	var kronos = layer.Effects.addProperty("Timewarp");
	// Set retiming to "Source Frame" instead of "Speed"
	kronos.property("Adjust Time By").setValue(2);
	var prop = kronos.property("Source Frame");
	// Animate the source frame parameter
	for(var i = 0; i < curveTuples.length; i++) {
		var tuple = curveTuples[i];
		// Frame numbers are 0-based in AE
		prop.setValueAtTime(this.convertFrameToSeconds(layer, tuple.atFrame), tuple.useFrameOfSource - 1);
	}
}

var timeRemapApplier = new FramecurveApplier();
timeRemapApplier.applyFramecurveToLayer = function(layer, curveTuples)
{
	var prop = layer.property("Time Remap");
	// Toggle time remap to remove all the old keyframes
	layer.timeRemapEnabled = false;
	layer.timeRemapEnabled = true;
	for(var i = 0; i < curveTuples.length; i++) {
		var tuple = curveTuples[i];
		// Frame numbers are 0-based in AE
		prop.setValueAtTime(this.convertFrameToSeconds(layer, tuple.atFrame), this.convertFrameToLayerSeconds(layer, tuple.useFrameOfSource));
	}
}

function applyFromUI(win) {
	win.close();
	if(win.applyAsKronos.value) {
		kronosApplier.run();
	} else {
		timeRemapApplier.run();
	}
}

function buildUI(thisObj) {
	var offset = 14;
	// bounds are [tlx, tly, brx, bry]
	var win =  new Window('window', 'Apply framecurve to layer', [offset, offset, offset * 22, offset * 11]);
	win.applyAsKronos = win.add('radiobutton', [offset, offset, offset * 20, offset * 3], 'Apply as Timewarp effect');
	win.applyAsTimeRemap = win.add('radiobutton', [offset, offset * 3, offset * 20, offset * 6], 'Apply as Time Remap');
	win.applyAsKronos.value = true;
	win.applyButton = win.add('button', [offset, offset * 7, 284, offset * 9], 'Apply', {name:'Apply'});
	win.applyButton.onClick = function() { 
		applyFromUI(win);
	}
	return win;
}

buildUI(this).show();