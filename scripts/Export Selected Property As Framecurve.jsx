/*
	Export Selected Property As Framecurve
	
	Will export the selected AE animation channel as a Framecurve file for use in other programs.
	
	For more info, see http://framecurve.org/scripts
	
	Framecurve scripts are subject to MIT license
	http://framecurve.org/scripts/#license
	
*/
{
	function propertyToRecords(comp, prop, compInSeconds, compOutSeconds)
	{
		if(prop.propertyValueType != PropertyValueType.OneD) {
			throw("This is a multidimensional property or channel - will not export that, sorry.");
		}
		var frameDuration = comp.frameDuration;
		var records = [];
		
		// And sssample!
		var preExpr = false;
		var atFrame = compInSeconds / frameDuration;
		for(var at = compInSeconds; at <= compOutSeconds; at += frameDuration) {
			records.push([atFrame + 1, prop.valueAtTime(at, preExpr) + 1]);
			atFrame += 1;
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
	function exportPropertyOf(layer)
	{
		// Frames in AE are 0-based by default
		var from = layer.inPoint;
		var to = layer.outPoint;
		var props = layer.selectedProperties;
		for(var i = 0; i < props.length; i++ ) {
			var prop = props[i];
			// We have to see to it that our selected item is NOT a group but a single channel
			// PropertyType.PROPERTY, PropertyType.INDEXED_GROUP, PropertyType.NAMED_GROUP
			if(prop.propertyType == PropertyType.PROPERTY) {
				alert("Exporting the property " + prop.name);
				var records = propertyToRecords(layer.containingComp, prop, from, to);
				writeRecords(records);
				return; // Only one prop
			}
		}
	}
	
	function ExportPropertyInit(thisObj)
	{
		var scriptName = "Export Selected Property As Framecurve";
		
		var activeItem = app.project.activeItem;
		if ((activeItem == null) || !(activeItem instanceof CompItem)) {
			alert("Please select or open a composition first and select a property of an effect or a layer.", scriptName);
			return;
		}
		
		var selectedLayer = activeItem.selectedLayers[0];
		// Do the job
		exportPropertyOf(selectedLayer);
	}
	
	
	ExportPropertyInit(this);
}