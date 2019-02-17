L.WMTSCapabilities = L.Class.extend({
	//a little extension to harvest wmts capabilities (make sure to allow CORS for getCapabilities) and add a layer sorter
	
    harvestWMTS : function(url,wmtsBaseUrl,dateString,callback){

        var that = this;
        //console.log('this is',this)
        var ajaxreq = this.getWMTSCapabilitiesRequest(url);
        ajaxreq.success(function(data){
        	that.data = data;
            that.targetDate = dateString;
        	that.baseUrl = wmtsBaseUrl;
            that.parseData(data,wmtsBaseUrl,callback);
        })
        ajaxreq.error(function(data){
            throw new Error(data);
        })
    },

    getWMTSCapabilitiesRequest : function(url){
        var ajax = $.ajax({
            url:url,
            dataType:'xml'
        });
        
        return ajax;
    },
	getWMTSMatrixData : function(callback){
		if(typeof callback == "undefined")
        	return this.harvestWMTSMatrixDimensions();
        else{
        	callback( this.harvestWMTSMatrixDimensions() );
        }
    },
    harvestWMTSMatrixDimensions : function(){
    	var data = this.data;
    	var wmtsUrl = this.baseUrl;
        var matrixDimensions = {url:wmtsUrl,ids:[],data:[]};
        var minZoom = 0, maxZoom = 0;
        $.each($('Contents > TileMatrixSet',data),function(i,tms){

            var id = $('Identifier',this).eq(0).text();
            //console.log('testing id',$(this).find('Identifier'));
            if($.browser.mozilla || $.browser.firefox){

                var id = $(this).find('ows\\:Identifier').eq(0).html()
            }
            if($.browser.msie){
                var id = $(this).find('ows\\:Identifier').eq(0).text();
                //console.log('testing id',id,$(this).find('Identifier').eq(0).html(),$(this).find('Identifier').eq(0).text());
            }
            matrixDimensions.ids.push(id);
            var dims = {id:id,levels:[]};
            //console.log('testing',id,matrixSet,id==matrixSet)
            //if(id == matrixSet){
                //console.log('and a match')
                //this is it, we have a match, now we see our max zoom levels
                $('TileMatrix',this).each(function(ii,tm){

                    var zoomLev = parseInt($('Identifier',this).eq(0).text());
                    var mW = parseInt($('MatrixWidth',this).eq(0).text());
                    var mH = parseInt($('MatrixHeight',this).eq(0).text());
                    var scale = parseFloat($('ScaleDenominator',this).eq(0).text());
                    var topLeft = $('TopLeftCorner',this).eq(0).text();
                    if($.browser.mozilla || $.browser.firefox){
                        zoomLev = parseInt($(this).find('ows\\:Identifier').eq(0).html());   
                        mW = parseInt($(this).find('ows\\:MatrixWidth').eq(0).html());
                        mH = parseInt($(this).find('ows\\:MatrixHeight').eq(0).html());
                        scale = parseFloat($(this).find('ows\\:ScaleDenominator').eq(0).html());
                        topLeft = $(this).find('ows\\:TopLeftCorner').eq(0).html()
                    }
                    if($.browser.msie){
                        zoomLev = parseInt($(this).find('ows\\:Identifier').eq(0).text());
                        mW = parseInt($(this).find('ows\\:MatrixWidth').eq(0).text());
                        mH = parseInt($(this).find('ows\\:MatrixHeight').eq(0).text());
                        scale = parseFloat($(this).find('ows\\:ScaleDenominator').eq(0).text());
                        topLeft = $(this).find('ows\\:TopLeftCorner').eq(0).text();
                    }
                    dims.levels.push({zoom:zoomLev,matrixWidth:mW,matrixHeight:mH,scaleDenominator:scale,minZoom:minZoom, maxZoom:maxZoom, topLeft:topLeft})
                    if(typeof minZoom == "undefined") minZoom = zoomLev;
                    if(typeof maxZoom == "undefined") maxZoom = zoomLev;
                    if(zoomLev > maxZoom) maxZoom = zoomLev;
                    if(zoomLev < minZoom) minZoom = zoomLev;

                });
                dims.minZoom = minZoom;
                dims.maxZoom = maxZoom;
                matrixDimensions.data.push(dims);
                //$(document).trigger('setZoomLevels',{min:minZoom,max:maxZoom,matrixId:id,url:wmtsUrl});//triggers an event in js/mixins/layerSorter.js
            //}
        })
        //console.log('mdims',matrixDimensions);
        return matrixDimensions;
    },
    parseData : function(data,wmtsUrl,callback){
        //console.log('wmts caps',data);
        /*if($.browser.msie){
            data = $.parseXML(data);
        }*/
        var matrixDimensions = this.harvestWMTSMatrixDimensions();
        
        this._matrixSetDimensions = matrixDimensions;
        

        var that = this;
        var list = {};
        var format = 'image/png';//temporary
        var caps = $('Layer',data)//.find('Title');//.find('Name');
        //console.log('caps filtered',caps);
        var names = [];
        $(caps).each(function(i,l){
        	
            //console.log('title? ',$(this).find('Title').text())
            var name = $(this).find('ows\\:Title').eq(0).text();
            name = typeof name == "undefined" || name == '' ? $(this).find('Title').eq(0).text() : name;
            var format = $(this).find('Format').text();
            var matrixSet = $(this).find('TileMatrixSet').text();
            names.push({name:name,id:matrixSet})
            //$(this).find('ows\\:Title').eq(0).text()
            var maxZoom,minZoom;
            //console.log('tddata',$('TileMatrixSet',data))
            $.each($('TileMatrixSet',data),function(i,tms){

                var id = $('Identifier',this).eq(0).text();
                //console.log('testing id',$(this).find('Identifier'));
                if($.browser.mozilla || $.browser.firefox){

                    var id = $(this).find('ows\\:Identifier').eq(0).html()
                }
                if($.browser.msie){
                    var id = $(this).find('ows\\:Identifier').eq(0).text();
                    //console.log('testing id',id,$(this).find('Identifier').eq(0).html(),$(this).find('Identifier').eq(0).text());
                }
                //console.log('testing',id,matrixSet,id==matrixSet)
                if(id == matrixSet){
                    //console.log('and a match')
                    //this is it, we have a match, now we see our max zoom levels
                    $('TileMatrix',this).each(function(ii,tm){
                        var zoomLev = parseInt($('Identifier',this).eq(0).text());
                        if($.browser.mozilla || $.browser.firefox){
                            zoomLev = parseInt($(this).find('ows\\:Identifier').eq(0).html());   
                        }
                        if($.browser.msie){
                            zoomLev = parseInt($(this).find('ows\\:Identifier').eq(0).text());
                        }
                        if(typeof minZoom == "undefined") minZoom = zoomLev;
                        if(typeof maxZoom == "undefined") maxZoom = zoomLev;
                        if(zoomLev > maxZoom) maxZoom = zoomLev;
                        if(zoomLev < minZoom) minZoom = zoomLev;
                    });
                    //$(document).trigger('setZoomLevels',{min:minZoom,max:maxZoom,matrixId:id,url:wmtsUrl});//triggers an event in js/mixins/layerSorter.js
                }
            })
            var layer = that.makeWmtsLayer(wmtsUrl,name,that.targetDate/*moment(new Date()).subtract('days',1).format('YYYY-MM-DD')*/,format,matrixSet,true,maxZoom);
            list[name] = layer;
            if(i == caps.length-1){
            	if(typeof callback == "undefined")
                	that.renderWMTSLayerControls(list);
            	else
            		callback({matrices: that._matrixSetDimensions,layerMeta:names,layerControl:new L.control.layers(list), layerList:list})
            }
        });

        //$(this).trigger('initWMSLayerControls',{layers:list,format:format})
    },
    renderWMTSLayerControls : function(list){
        //console.log('list of layers is ',list)
        //$(document).trigger('createMainMenu',{layers:list});
        var layerControl = new L.control.layers(list);
    },
    makeWmtsLayer : function(url,instrument,dateString,format,matrixSetId,useTime,maxZoom){
        var useTime = typeof useTime == "undefined" ? false : useTime;
        //var l = L.tileLayer('http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?TIME='+dateString+'&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER='+instrument+'&STYLE=&TILEMATRIXSET='+matrixSetId+'&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT='+encodeURIComponent(format),
        
        //and mids are 
        /*console.log('and mids are ',mids)*/
        var configObj = {
            tileMatrixSet:matrixSetId,
            format:format,
            layer:instrument,
            tileSize:512,
            date:dateString,
            useTime:useTime,
            isBaseMap:true
        }
        if(typeof maxZoom != "undefined"){
            configObj.maxNativeZoom = maxZoom;
        }
        var l = new L.tileLayer.wmts(/*"http://map1b.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi",//*/
            url,//'http://calypso:8888/WMTS/wmts.cgi',/*?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER='+instrument+'&STYLE=&TILEMATRIXSET='+matrixSetId+'&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT='+encodeURIComponent(format),*/
            configObj
          );
        return l;
    }
})
L.TileLayer.WMTS = L.TileLayer.extend({

        defaultWmtsParams: {
                service: 'WMTS',
                request: 'GetTile',
                version: '1.0.0',
                layer: '',
                style: '',
                tilematrixSet: '',
                tileSize:512,
                format: 'image/jpeg',
                useTime:true,
                
        },
        _endZoomAnim: function () {
			var front = this._tileContainer,
			    bg = this._bgBuffer;

			front.style.visibility = '';
			try{
				front.parentNode.appendChild(front); // Bring to fore
			}
			catch(e){
				console.log('error',e)
			}

			// force reflow
			L.Util.falseFn(bg.offsetWidth);

			this._animating = false;
		},
        initialize: function (url, options) { // (String, Object)
        	/*L.CRS.EPSG4326 = L.extend({}, L.CRS, {
				code: 'EPSG:4326',

				projection: L.Projection.LonLat,
				transformation: new L.Transformation(1 / 360, 0.5, -1 / 360, 0.5),
				scale: function (zoom) {
			     return 512 * Math.pow(2, zoom);
			   }
			});*/
            this._url = url;
            options.continuousWorld = true;
            /*if(typeof options.maxNativeZoom != "undefined"){
                options.maxNativeZoom = options.maxNativeZoom;
            }*/

            /*options.maxNativeZoom = 4;*/
           /* options.maxNativeZoom = 1;*/
            /*options.maxZoom = 20;*/
            var wmtsParams = L.extend({}, this.defaultWmtsParams),
                tileSize = options.tileSize || this.options.tileSize;
            if (options.detectRetina && L.Browser.retina) {
                    wmtsParams.width = wmtsParams.height = tileSize * 2;
            } else {
                    wmtsParams.width = wmtsParams.height = tileSize;
            }
            for (var i in options) {
                    // all keys that are not TileLayer options go to WMTS params
                    if (!this.options.hasOwnProperty(i) && i!="matrixIds") {
                            wmtsParams[i] = options[i];
                    }
            }
            this.wmtsParams = wmtsParams;
            if(typeof options.matrixIds == "undefined"){
            	var mids = [];
            	for(i=0;i<26;i++){
            		//these are usually always the same, but we can override later if/when we harvest caps OR by passing in matrixIds in the obj
		            mids.push({identifier:options.tileMatrixSet,topLeftCorner : new L.LatLng(-180,90)})
		        }
		        options.matrixIds = mids;
            }
            this.matrixIds = options.matrixIds;
            //console.log('options',options,this.matrixIds)
            L.setOptions(this, options);

        },

        /*onAdd: function (map) {
                L.TileLayer.prototype.onAdd.call(this, map);
        },*/
        /*redraw: function () {
			if (this._map) {
				//this._map._panes.tilePane.empty = false;
				//this._reset(true);
				//this._update();
			}
			return this;
		},*/

		_getZoomForUrl: function () {

			var options = this.options,
			    zoom = this._map.getZoom();

			if (options.zoomReverse) {
				zoom = options.maxZoom - zoom;
			}

			zoom += options.zoomOffset;

			return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
		},
		_getTileSize: function () {
			var map = this._map,
			    zoom = map.getZoom() + this.options.zoomOffset,
			    zoomN = this.options.maxNativeZoom,
			    tileSize = this.options.tileSize;

			if (zoomN && zoom > zoomN) {

				tileSize = Math.round(map.getZoomScale(zoom) / map.getZoomScale(zoomN) * tileSize);
			    
            }

			return tileSize;
		},

        getTileUrl: function (tilePoint, zoom) { // (Point, Number) -> String
        	//continuousworldriffraff
        		
                //console.log('tile z',tilePoint)
                var map = this._map;
                crs = map.options.crs;
                tileSize = this.options.tileSize;
                nwPoint = tilePoint.multiplyBy(tileSize);
                
                //+/-1 pour Ãªtre dans la tuile
                //nwPoint.x+=1;
                //nwPoint.y-=1; 
                sePoint = nwPoint.add(new L.Point(tileSize, tileSize)); 
                nw = map.unproject(nwPoint, zoom)//crs.project(map.unproject(nwPoint, zoom));
                //console.log('nw',nw,crs.project(map.unproject(nwPoint, zoom)))
                se = map.unproject(sePoint, zoom)//crs.project(map.unproject(sePoint, zoom));  
                tilewidth = se.lng-nw.lng;
                zoom=tilePoint.z//map.getZoom();
                ident = this.matrixIds[zoom].identifier;
                X0 = this.matrixIds[zoom].topLeftCorner.lng;
                Y0 = this.matrixIds[zoom].topLeftCorner.lat;
                tilecol=tilePoint.x;//Math.floor((nw.lng-X0)/tilewidth);
                tilerow=tilePoint.y;//Math.floor((nw.lat-Y0)/tilewidth);

                tilerow = tilerow >= this.options.zoomMatrix[zoom].height ? tilerow - this.options.zoomMatrix[zoom].height : ( tilerow < 0 ? this.options.zoomMatrix[zoom].height + tilerow : tilerow );
                /*tilePoint.x = 0;
                tilePoint.y = 0;*/
                var isColShifted = tilecol >= this.options.zoomMatrix[zoom].width ? 1 : ( tilecol < 0 ? -1 : 0 );
                tilecol = tilecol >= this.options.zoomMatrix[zoom].width ? tilecol - this.options.zoomMatrix[zoom].width : ( tilecol < 0 ? Math.abs(this.options.zoomMatrix[zoom].width + tilecol) : tilecol );
                
                console.log('matrixsets',this._matrixSetDimensions);
                console.log('add from center out',this.options)
                //console.log('nwpoit',nwPoint,tilePoint,'row '+tilerow,'col '+tilecol)
                //console.log('options',this.options,this.wmtsParams)
                url = L.Util.template(this._url, {s: this._getSubdomain(tilePoint)});
                url = this._url+'?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER='+this.options.layer+'&STYLE=&TILEMATRIXSET='+this.options.tileMatrixSet+'&TILEMATRIX='+zoom+'&TILEROW='+tilerow+'&TILECOL='+tilecol+'&FORMAT='+encodeURIComponent(this.options.format);
                if(typeof this.options.date != "undefined" && this.options.useTime){
                	console.log('iscolshifted',isColShifted);
                	if(typeof moment != "undefined"){
                		//use moment.js to format the day after or before today
                		if(isColShifted > 0){
                			var d = moment(this.options.date).subtract('days',isColShifted).format('YYYY-MM-DD');
                		}
                		if(isColShifted < 0){
                			var d = moment(this.options.date).add('days',Math.abs(isColShifted)).format('YYYY-MM-DD');
                		}
                		if(isColShifted == 0){
                			var d = this.options.date;
                		}
                		
                	}
                	else var d = this.options.date;
                	//console.log('iscolshifted',this.options.date,d,moment(this.options.date).add('days',1).format('YYYY-MM-DD'));
                	url += '&TIME='+d;

                }
                //console.log('this ',this)
                //tilePoint.x -= 360;
                //console.log('url',url)
                return url// + L.Util.getParamString(this.wmtsParams, url) + "&tilematrix=" + zoom + "&tilerow=" + tilerow +"&tilecol=" + tilecol ;
        },
        _reset: function (clearOldContainer) {
			var tiles = this._tiles;
			var z = this._map.getZoom();
			var maxZoom = 0;
			//if(this.options.continuousWorld){
    			zoomMatrix = {};
    			zoomMatrix[0] = {width:2,height:1};
    			zoomMatrix[1] = {width:3,height:2};
    			zoomMatrix[2] = {width:5,height:3};
    			zoomMatrix[3] = {width:10,height:5};
    			zoomMatrix[4] = {width:20,height:10};
    			zoomMatrix[5] = {width:40,height:20};
    			zoomMatrix[6] = {width:80,height:40};
    			zoomMatrix[7] = {width:160,height:80};
    			zoomMatrix[8] = {width:320,height:160};
    		//}
			$.each(zoomMatrix,function(k,m){
				if(k > maxZoom) maxZoom = k;
			});
			if(z >= 7/*maxZoom*/){
				//alert('no')
				//return false;
				
			} 
			for (var key in tiles) {
				if (tiles.hasOwnProperty(key)) {
					this.fire('tileunload', {tile: tiles[key]});
				}
			}

			this._tiles = {};
			this._tilesToLoad = 0;

			if (this.options.reuseTiles) {
				this._unusedTiles = [];
			}

			if (clearOldContainer && this._container) {
				this._container.innerHTML = "";
			}

			this._initContainer();
            this._update();
		},
		/*_removeTile: function (key) {
			var tile = this._tiles[key];
			alert('tile unload')
			//this.fire("tileunload", {tile: tile, url: tile.src});
			return false;
			if (this.options.reuseTiles) {
				L.DomUtil.removeClass(tile, 'leaflet-tile-loaded');
				this._unusedTiles.push(tile);

			} else if (tile.parentNode === this._container) {
				this._container.removeChild(tile);
			}

			// for https://github.com/CloudMade/Leaflet/issues/137
			if (!L.Browser.android) {
				tile.src = L.Util.emptyImageUrl;
			}

			delete this._tiles[key];
		},*/
		_addTilesFromCenterOut: function (bounds) {
			if(this.options.continuousWorld){
    			this.options.zoomMatrix = {};
    			this.options.zoomMatrix[0] = {width:2,height:1};
    			this.options.zoomMatrix[1] = {width:3,height:2};
    			this.options.zoomMatrix[2] = {width:5,height:3};
    			this.options.zoomMatrix[3] = {width:10,height:5};
    			this.options.zoomMatrix[4] = {width:20,height:10};
    			this.options.zoomMatrix[5] = {width:40,height:20};
    			this.options.zoomMatrix[6] = {width:80,height:40};
    			this.options.zoomMatrix[7] = {width:160,height:80};
    			this.options.zoomMatrix[8] = {width:320,height:160};
    		}
			var z = this._map.getZoom();
			var maxZoom = 0;
			$.each(this.options.zoomMatrix,function(k,m){
				if(k > maxZoom) maxZoom = k;
			});

			console.log('matrix zoom',this.matrixIds[z]);
			var queue = [],
			    center = bounds.getCenter();
			    //console.log('bounds',bounds)
			var j, i, point;
			/*console.log('bounds of new tile are ',bounds)*/
			for (j = bounds.min.y; j <= bounds.max.y; j++) {
				for (i = bounds.min.x; i <= bounds.max.x; i++) {
					point = new L.Point(i, j);

					if (this._tileShouldBeLoaded(point)) {
						queue.push(point);
					}
				}
			}

			var tilesToLoad = queue.length;

			if (tilesToLoad === 0) { return; }

			// load tiles in order of their distance to center
			queue.sort(function (a, b) {
				return a.distanceTo(center) - b.distanceTo(center);
			});

			var fragment = document.createDocumentFragment();

			// if its the first batch of tiles to load
			if (!this._tilesToLoad) {
				this.fire('loading');
			}

			this._tilesToLoad += tilesToLoad;

			for (i = 0; i < tilesToLoad; i++) {
				this._addTile(queue[i], fragment);
			}

			this._container.appendChild(fragment);
		},
		/*_update: function () {

			if (!this._map) { return; }

			var bounds = this._map.getPixelBounds(),
			    zoom = this._map.getZoom(),
			    tileSize = this.options.tileSize;

			if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
				return;
			}

			var nwTilePoint = new L.Point(
			        Math.floor(bounds.min.x / tileSize),
			        Math.floor(bounds.min.y / tileSize)),

			    seTilePoint = new L.Point(
			        Math.floor(bounds.max.x / tileSize),
			        Math.floor(bounds.max.y / tileSize)),

			    tileBounds = new L.Bounds(nwTilePoint, seTilePoint);

			this._addTilesFromCenterOut(tileBounds);

			if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
				//this._removeOtherTiles(tileBounds);
			}
		},*/
        modifyDate : function(dateString){
            this.options.date = dateString;
            console.log('newopts',this.options)
            this._reset();
        },
		_update: function () {

			if (!this._map) { return; }

			var map = this._map,
			    bounds = map.getPixelBounds(),
			    zoom = map.getZoom(),
			    tileSize = this._getTileSize();

			if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
				return;
			}

			var tileBounds = L.bounds(
			        bounds.min.divideBy(tileSize)._floor(),
			        bounds.max.divideBy(tileSize)._floor());

			this._addTilesFromCenterOut(tileBounds);

			if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
				this._removeOtherTiles(tileBounds);
			}
		},
		_addTile: function (tilePoint, container) {
			var z = this._map.getZoom();
			var tempTp = tilePoint;
			
			var tilePos = this._getTilePos(tempTp);
			//account for the kind of 2x1 tile root near the low zooms...
			if(z == 0){
				console.log('tilepoint',tilePoint)
				if(tilePoint.x >= 2){
					tilePos.x -= (512*0.751953125);
				}
				if(tilePoint.x < 0){
					var factor = Math.floor(Math.abs(tilePoint.x) / 3);
					tilePos.x += (512*0.751953125);// + (factor*(512*0.751953125));
					/*if(factor > )
					tilePoint.fakeX = tilePoint.x % 3 == 0 ? 0 */

				}
				/*if(tilePoint.x == 1){
					tilePos.x += (512*0.751953125);
				}*/
			}
			//console.log('tpoint',tilePoint.x)
			if(z == 1){
				if(tilePoint.x >= 3){
					tilePos.x -= (512*0.50390625);

				}
				if(tilePoint.x < 0){
					tilePos.x += (512*0.50390625);
				}
			}
			if(z == 2){
				if(tilePoint.x >= 5){
					//tilePos.x -= 512 * 0.0637071800511133;
				}
				if(tilePoint.x < 0){
					//tilePos.x += 512 * 0.0637071800511133;
				}
			}
			// get unused tile - or create a new tile
			var tile = this._getTile();

			/*
			Chrome 20 layouts much faster with top/left (verify with timeline, frames)
			Android 4 browser has display issues with top/left and requires transform instead
			Android 3 browser not tested
			Android 2 browser requires top/left or tiles disappear on load or first drag
			(reappear after zoom) https://github.com/CloudMade/Leaflet/issues/866
			(other browsers don't currently care) - see debug/hacks/jitter.html for an example
			*/
			console.log('tilepos',tilePos,tilePoint);
			L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome || L.Browser.android23);
			
			this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
			
			
			
			this._loadTile(tile, tilePoint);
			var imgsrc = this.getTileUrl(tilePoint);
			var kv = {};
			var src = imgsrc.split('?')[1].split('&');
					
			$.each(src,function(i,x){
				var s = x.split('=');
				kv[s[0]] = s[1];
			});
			if(typeof this._alltileMatrix == "undefined") this._alltileMatrix = {};
			this._alltileMatrix[tilePoint.x + ':' + tilePoint.y] = {};
			this._alltileMatrix[tilePoint.x + ':' + tilePoint.y]['meta'] = {};
			//console.log(kv);
			this._alltileMatrix[tilePoint.x + ':' + tilePoint.y]['meta']['TILEROW'] = kv['TILEROW'];
			this._alltileMatrix[tilePoint.x + ':' + tilePoint.y]['meta']['TILECOL'] = kv['TILECOL'];
			this._alltileMatrix[tilePoint.x + ':' + tilePoint.y]['meta']['TILEMATRIX'] = kv['TILEMATRIX'];
			if (tile.parentNode !== this._container) {
				container.appendChild(tile);
			}
		},
        _getTilePos: function (tilePoint) {
            var origin = this._map.getPixelOrigin(),
                tileSize = this._getTileSize();
            console.log('px origin',tilePoint,origin,tilePoint.multiplyBy(tileSize).subtract(origin))
            zoom = this._map.getZoom() + this.options.zoomOffset,
            zoomN = this.options.maxNativeZoom;
            if(zoomN && zoom > zoomN)
                return tilePoint.multiplyBy(tileSize).subtract(origin);
            else    
                return tilePoint.multiplyBy(tileSize).subtract(origin);
        },
		_tileShouldBeLoaded: function (tilePoint) {
			if ((tilePoint.x + ':' + tilePoint.y) in this._tiles) {
				return false; // already loaded
			}
			//console.log("TILE",this.options.continuousWorld)
			if (!this.options.continuousWorld) {

				var limit = this._getWrapTileNum(tilePoint);

				if (this.options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit) ||
					                        tilePoint.y < 0 || tilePoint.y >= limit) {
					return false; // exceeds world bounds
				}
			}

			return true;
		},
		_loadTile: function (tile, tilePoint) {
			tile._layer  = this;
			tile.onload  = this._tileOnLoad;
			tile.onerror = this._tileOnError;

			this._adjustTilePoint(tilePoint);
			tile.src = this.getTileUrl(tilePoint);

			this.fire('tileloadstart', {
				tile: tile,
				url: tile.src
			});
			tile.setAttribute('data-tilerow',tilePoint.y);
			tile.setAttribute('data-tilecol',tilePoint.x);

			//tile.setAttribute('data-tilematrix',kv['TILEMATRIX'])
		},
		// + Math.pow(2, zoom -2)
        setParams: function (params, noRedraw) {
                L.extend(this.wmtsParams, params);
                if (!noRedraw) {
                        this.redraw();
                }
                return this;
        },

        
});
/*L.map.WMTSCapabilities = function(){
	return new L.Map.WMTSCaps();
}*/
L.tileLayer.wmts = function (url, options) {
        return new L.TileLayer.WMTS(url, options);
};