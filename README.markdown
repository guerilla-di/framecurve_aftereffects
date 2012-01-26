# Framecurve AfterEffects scripts

First of all, you will need our .jsx scripts for AE.

* [Download the "Apply Framecurve As Kronos" script](scripts/Apply Framecurve As Kronos.jsx)<ul>
* [Download the "Export Selected Property As Framecurve" script](scripts/Export Selected Property As Framecurve.jsx)

Install these scripts like any others.

## Applying timewarps to layers

To apply a timewarp, select a layer in a comp.

![Countdown clip](images/AE-countdown.png)

From the "Scripts" menu, pick "Apply Framecurve As Kronos"

![Kronos](images/AE-apply-as-kronos.png)

...and pick the Framecurve file you want to apply to the layer.
A Timewarp effect will be created automatically with the contents of the framecurve, thus retiming your layer to it.</p>

![Applied!](images/AE-applied.png)

## Exporting framecurves from AfterEffects

First, select an animated property you want to export (like a "Source frame" channel of a Timewarp effect).

![Select channel](images/AE-select-channel.png)

Once done, select "Export Selected Property As Framecurve". This will pop up a dialog for you to choose the filename
for the framecurve file and tell you which channel is going to be exported.

![Channel name confirmation](images/AE-confirmation.png)

**Make sure to give the file a ".framecurve.txt" double extension!**

When the file is selected the channel will be exported to the Framecurve file.
