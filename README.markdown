# Framecurve AfterEffects scripts

First of all, you will need our .jsx scripts for AE.

* [Download the "Apply Framecurve To Selected Layer" script](/scripts/Apply Framecurve To Selected Layer.jsx)
* [Download the "Export Time Remap As Framecurve" script](/scripts/Export Time Remap As Framecurve.jsx)

Install these scripts like any others.

## Applying timewarps to layers

To apply a timewarp, select a layer in a comp.

![Countdown clip](/images/AE-countdown.png)

From the "Scripts" menu, pick "Apply Framecurve To Selected Layer"

![Menu](/images/AE-menu.png)

Then you can make your choice whether you want a layer Time Remap or a Kronos/Timewarp effect on top of the layer. 
Pick the one you want..

![Picker](/images/AE-pick-style.png)

...and pick the Framecurve file you want to apply to the layer.

The framecurve file will be loaded and applied to your layer.

![Applied!](/images/AE-applied.png)

## Exporting framecurves from Time Remap

First, select a layer with Time Remap enabled.

Once done, select "Export Time Remap As Framecurve". This will pop up a dialog for you to choose the filename
for the framecurve file and tell you which channel is going to be exported.

**Make sure to give the file a ".framecurve.txt" double extension!**

When the file is selected the channel will be exported to the Framecurve file.

## License

The scripts here are covered with [framecurve license](http://framecurve.org/scripts/#license).
