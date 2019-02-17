LEAFLET EPSG:4326 WMTS PLUGIN

Requirements: You should do a bower install to get dependencies pulled in.

To install bower (global is best), you need npm (node package manager, part of node.js <a href="http://nodejs.org/download/">download link</a>). 
Once you have Node/NPM installed: 
```sudo npm install bower -g```

Then cd inside this dir (where bower.json is)

```
bower install
```

TO add a layer (oneoffs):

```
var url = 'http://map1b.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi';
var blueMarble = 'blue_marble';
var matrixId = 'EPSG4326_500m';
var format = 'image/jpeg';
//known bug w moment: check for leading zeros on month/days in != chrome
dateString = moment(new Date()).subtract('days',2).format('YYYY-MM-DD');
useTime = true;

//layer options.
var layerOptions = {
    tileMatrixSet:matrixId,
    format:format,
    layer:blueMarble,
    tileSize:512,
    date:dateString,
    useTime:useTime,
    isBaseMap:true,
    maxNativeZoom: 7
};
//layer
l = new L.tileLayer.wmts(
    url,
  	layerOptions
);
l.addTo(map);
```

To add a layer (programmatic, make sure the server has CORS enabled for this file, else just wget a copy local):

```

dateString = moment(new Date()).subtract('days',2).format('YYYY-MM-DD');

capabilities = new L.WMTSCapabilities();
capabilities.harvestWMTS(
	'http://map1b.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?REQUEST=GetCapabilities',
	'http://map1b.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi',
	dateString,
	function(res){
		console.log('result',res)
		//NOTE: Use the meta from res to either construct layers or add layer controls.
		//returns {matrices:[],layerMeta:[],layerControl;new L.Controls(layerlist),layerList:layerlist}
		//and a layercontrol if you wish.
		res.layerControl.addTo(map);
	}); //caps request URL, and base URL for each layer
```

TO MODIFY/UPDATE AN EXISTING LAYER DATE:

```
var layer = new L.wmts(...);
layer.modifyDate('2014-05-01');
```