define(
	[
		/*'bower_components/LeafletWMTS/leaflet/leaflet-src',*/
		'bower_components/flight/lib/compose',
		'js/mixins/canvasCropper',
		'bower_components/jquery.browser/dist/jquery.browser.min',
		'bower_components/LeafletWMTS/leaflet/leaflet.WMTS',
		'bower_components/moment/moment'
	],
	function(compose,Cropper){
	return backMap;
	function backMap(){
		//all the map methods for the map on the back of the main view
		this.initMap = function(mapID){
			var that = this;
			compose.mixin(this,[Cropper]);
			this._imageMeta = {}; //an object that holds hits that we reference on the back
			//this._map = L.map(mapID,{crs:L.CRS.EPSG4326,reuseTiles:true,center:[0,0],zoom:3});
			
			
			/*new map code for demo*/
			/**/
			var myEPSG3426 = L.extend({}, L.CRS, {
	            projection: L.Projection.LonLat,
			    transformation: new L.Transformation(Math.PI*2/(904.5),1.2502,-Math.PI/449.5,0.6265)
	        });
	        this._map = L.map(mapID,{crs:myEPSG3426,tms: false,reuseTiles:true});
	        
	        this._map.setView([0,0],1);
	        //marker = new L.Marker([34.031,-120.040]).addTo(map);
	        var url = 'http://map1b.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi';
	        var blueMarble = 'MODIS_Aqua_CorrectedReflectance_TrueColor';
	        var matrixId = 'EPSG4326_250m';
	        var format = 'image/jpeg';
	        //known bug w moment: check for leading zeros on month/days in != chrome
	        dateString = moment(new Date()).subtract('days',2).format('YYYY-MM-DD');
	        useTime = true;

	        
	        //this is the one-off way to add a WMTS layer. 
	        //layer options.
	        var layerOptions = {
	            tileMatrixSet:matrixId,
	            format:format,
	            layer:blueMarble,
	            tileSize:512,
	            date:dateString,
	            useTime:useTime,
	            isBaseMap:true,
	            maxNativeZoom: 8
	        };
	        //layer
	        var l = new L.tileLayer.wmts(
	            url,
	          	layerOptions
	        );
	        l.addTo(that._map);
	        //ok let's use some methods to do a get capabilities request to the server and add the layers as a layer chooser
	        capabilities = new L.WMTSCapabilities();
	        capabilities.harvestWMTS('http://map1b.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?REQUEST=GetCapabilities','http://map1b.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi',dateString,function(res){
	        	console.log('result',res)
	        	//NOTE: Use the meta from res to either construct layers or add layer controls.
	        	//returns {matrices:[],layerMeta:[],layerControl;new L.Controls(layerlist),layerList:layerlist}
	        	//and a layercontrol if you wish.
	        	res.layerControl.addTo(that._map);
	        });
			setTimeout(function(){
				that._map.invalidateSize();
				if(typeof that._mapBounds != "undefined"){
					that._map.fitBounds(that._mapBounds);
					
				}
			},500)
			
			//this._map.addLayer(modis721);
			//this._map.addLayer(airs);
			//init imagegrid::
			$('#backSide').append('<div id="imageGrid" />');
			$('body').append('<div id="floatingMeta" />')
			$(document).on('mouseover','#backSide #imageGrid img',function(){
				var imgid = $(this).attr('data-src');
				var _id = $(this).attr('data-id');
				var meta = that._imageMeta[_id];
				var imgOverlay = that._imageLayers[imgid];
				console.log('meta is',meta);
				var coords = meta.fields.metadata.center.coordinates;
				var ll = new L.LatLng(coords[1],coords[0]);
				var tileObj = $($('#map_'+_id).parents('tr')[1]).clone();
				var offs = $(this).offset();
				//var fml = offs.left - 20 - $('#floatingMeta').width();
				var fmr = $('#backSide').offset().left+20
				//var fmt = offs.top - 20 - $('#floatingMeta').height();
				//$('#floatingMeta').css('left',fml)
				$('#floatingMeta').css('left',fmr)
				//metadata panel...
				//move to click on hovered image in leaflet
				//$('#floatingMeta').html(tileObj).addClass('showing');
				
				var metaPanel = $('#facetview_rightcol strong').each(function(i,x){

				})
				that._map.panTo(ll);
				$('img.ishovered').removeClass('ishovered');
				if (typeof imgOverlay != "undefined"){
					imgOverlay.bringToFront();
					$(imgOverlay._image).addClass('ishovered')
				}
			});

			$(document).on('mouseout',$('#backSide #imageGrid'),function(){
				//$('#floatingMeta').removeClass('showing')
			})
			$(document).on('mouseover','.leaflet-control-layers',function(e){
				$('#backMap').css('z-index',1000);
			})
			$(document).on('mouseout','.leaflet-control-layers',function(e){
				$('#backMap').css('z-index',0);
			})
		}
		this.plotMapResult = function(hits){
			if(typeof hits.hits != "undefined"){
				hits = hits.hits; //correct if we just passed in the whole obj
			}
			var that = this;

			if(typeof this._imageLayers == "undefined"){
				this._imageLayers = {}; //an array that holds images we plop onto the map
			}
			else{
				$.each(this._imageLayers,function(i,x){
					that._map.removeLayer(x);
					console.log('removing layer',x);
				});
			}
			//alright now we should quickly update our filters onthe back of the map
			if($('#backFilters').length == 0){
				//$('body').append('<div id="backFilters" />')
			}
			$('#backFilters').html('');
			var c = $('#facetview_rightcol .btn-toolbar').clone();//clone the filters fromthe front
			$(c).addClass('cloned');
			
			$('#backFilters').append(c).show();
			$('#backFilters .btn').on('click',function(e){
				e.preventDefault();

				var i = $('#backFilters .btn').index(this);
				//console.log('i is',i,$(this).index())
				$(this).remove();
				$('#facetview_rightcol .btn-toolbar .btn').eq(i).trigger('click');
			})
			//takes some hits from jquery.facetview AJAX search and plot them on the map
			//console.log('hits',hits)
			var minLat;
			var maxLat;
			var minLon;
			var maxLon;
			$('#imageGrid').html('');
			$.each(hits,function(i,hit){
				//console.log('hit',hit)
				var imgBase = hit.fields.browse_urls[0];
				console.log('hit is',hit.fields)

				var imgUrlPart = typeof hit.fields.images[0] == "undefined" ? hit.fields.browse_urls[0]+'/browse_small.png'  : hit.fields.images[0]['small_img'] ;
				var img = typeof hit.fields.images[0] == "undefined" ? imgUrlPart : imgBase +'/'+ imgUrlPart;
				var polygon = hit.fields.metadata.bbox; //[f,f],[f,f],...

				var imgCoords = hit.fields.metadata.imageCorners; //maxLat,maxLon,minLat,maxLat
				//we'll set these so we can zoom in specifically around out results
				console.log('imgcoords',imgCoords,hit)
				if(typeof imgCoords == "undefined"){
					//alright its no imgcoords, how about bbox??
					imgCoords = {};
					imgCoords.minLon = hit.fields.metadata.bbox[2][1];
					imgCoords.maxLon = hit.fields.metadata.bbox[1][1];
					imgCoords.minLat = hit.fields.metadata.bbox[0][0];
					imgCoords.maxLat = hit.fields.metadata.bbox[3][0];
				}
				if(typeof minLat == "undefined") minLat = imgCoords.minLat;
				else minLat = imgCoords.minLat < minLat ? imgCoords.minLat : minLat;
				if(typeof maxLat == "undefined") maxLat = imgCoords.maxLat;
				else maxLat = imgCoords.maxLat > maxLat ? imgCoords.maxLat : maxLat;
				if(typeof minLon == "undefined") minLon = imgCoords.minLon;
				else minLon = imgCoords.minLon < minLon ? imgCoords.minLon : minLon;
				if(typeof maxLon == "undefined") maxLon = imgCoords.maxLon;
				else maxLon = imgCoords.maxLon < maxLon ? imgCoords.maxLon : maxLon;

				var southWest = new L.LatLng(imgCoords.minLat,imgCoords.maxLon);
				var northEast = new L.LatLng(imgCoords.maxLat,imgCoords.minLon);
				var bounds = new L.latLngBounds(southWest,northEast);
				that.constructCroppedImage(img,hit,hit._id,bounds); //in js/mixins/canvasCropper.js
					/*that._imageLayers[img] = new L.ImageOverlay(img,bounds);
					that._imageLayers[img].addTo(that._map);
					console.log('layers',that._imageLayers[img],hit)
					$(that._imageLayers[img]._image).attr('data-id',hit._id);
					that._imageMeta[hit._id] = hit; //cache our hit
					$('#imageGrid').append('<img src="'+img+'" data-id="'+hit._id+'" alt="'+hit._id+'" />');*/
				//todo insert image layer
			});
			$('#imageGrid').append('<div id="next10Trigger">[next page]</div>');
			$('#next10Trigger').off('click').on('click',function(){
				$('.pagination .facetview_increment').trigger('click');
			})
			//ok focus our map
			var southWest = new L.LatLng(minLat,maxLon);
			var northEast = new L.LatLng(maxLat,minLon);
			var bounds = new L.latLngBounds(southWest,northEast);
			console.log('boundsies',minLat,maxLat,minLon,maxLon,bounds,that._map.getZoom())
			that._mapBounds = bounds;
			that._map.invalidateSize();
			that._map.fitBounds(that._mapBounds);
		}

	}
});