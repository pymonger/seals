define(
	[],
	function(){
		function canvasCropper(){
			this.triggerHoverTip = function(meta,left,top){
				//dataset label dataset name, date sensing start/end, spacecraft name, track number, orbit number
				var label = meta.fields.dataset;
				var name = meta.fields.id;
				var start = typeof meta.fields.metadata.sensingStart == 'string' ? meta.fields.metadata.sensingStart : meta.fields.metadata.sensingStart.join(', ');
				var end = typeof meta.fields.metadata.sensingStop == 'string' ? meta.fields.metadata.sensingStop : meta.fields.metadata.sensingStop.join(', ');
				var spName = typeof meta.fields.metadata.spacecraftName == 'string' ? meta.fields.metadata.spacecraftName : meta.fields.metadata.spacecraftName.join(', ');
				var trNum = meta.fields.metadata.trackNumber;
				console.log(meta.fields.metadata.orbitNumber)
				var orbitNum = typeof meta.fields.metadata.orbitNumber != 'object' ? meta.fields.metadata.orbitNumber : meta.fields.metadata.orbitNumber.join(', ');
				if($('#imageTooltip').length == 0){
					$('body').append('<div id="imageTooltip" />')
				}
				var block = $('<ul class="toolMeta" />');
				block.append('<li>Dataset: '+label+'</li>');
				block.append('<li>Name: '+name+'</li>');
				block.append('<li>Start: '+start+'</li>');
				block.append('<li>Stop: '+end+'</li>');
				block.append('<li>Spacecraft: '+spName+'</li>');
				block.append('<li>Track: '+trNum+', Orbit: '+orbitNum+'</li>');
				$('#imageTooltip').css({left:left,top:top}).html(block).show();
				this._map.on('zoom',function(e){
					$('#imageTooltip').hide();
				})
				this._map.on('drag',function(e){
					$('#imageTooltip').hide();
				})
			}
			this.constructCroppedImage = function(img,hit,hitId,bounds){
				// get the image
				var that = this;
				var myImage = new Image();
				myImage.crossOrigin = "anonymous";

				myImage.src = img.replace('http:','https:');
				myImage.onload = function(e){
					var sI = setInterval(function(){
						if(myImage.width > 0) {
							clearInterval(sI);
							//document.body.appendChild(myImage);
							//var img = document.getElementById("your-image");
							// create and customize the canvas
							/*var canvas = document.createElement("canvas");
							canvas.width = myImage.width;
							canvas.height = myImage.height;
							//document.body.appendChild(canvas);
							// get the context
							var ctx = canvas.getContext("2d");
							// draw the image into the canvas
							ctx.drawImage(myImage, 0, 0);
							// get the image data object
							var image = ctx.getImageData(0, 0, myImage.width,myImage.height);
							// get the image data values 
							var imageData = image.data,
							length = imageData.length;
							// set every fourth value to 50
							for(var i=0; i < length; i+=4){  
							    
							    if(imageData[i] <= 5 && imageData[i+1] <= 5 && imageData[i+2] <= 5 ){
							    	imageData[i+3] = 0;
							    }
							}
							// after the manipulation, reset the data
							image.data = imageData;
							// and put the imagedata back to the canvas
							ctx.putImageData(image, 0, 0);*/
							//that._imageLayers[img] = new L.ImageOverlay(canvas.toDataURL(),bounds);
							that._imageLayers[img] = new L.ImageOverlay(img,bounds);
							that._imageLayers[img].addTo(that._map);
							$(that._imageLayers[img]._image).attr('data-id',hitId)
							L.DomEvent.on(that._imageLayers[img]._image, 'click', function(e) {
							    console.log('clicked image overlay',e)
							    var _id = $(this).attr('data-id');
								var meta = that._imageMeta[_id];
								var imgOverlay = that._imageLayers[img];
								console.log('meta is',meta);
								var coords = meta.fields.metadata.center.coordinates;
								var ll = new L.LatLng(coords[1],coords[0]);
								var tileObj = $($('#map_'+_id).parents('tr')[1]).clone();
								var offs = $(this).offset();
								var fmr = $('#backSide').offset().left+20
								//var fmt = offs.top - 20 - $('#floatingMeta').height();
								//$('#floatingMeta').css('left',fml)
								$('#floatingMeta').css('left',fmr)
								var allImgs = $('<div id="floatingImages" />');

								var imgPanel = $('tr',tileObj).eq(0).find('span.label').each(function(i,x){
									var _img = $('<div class="thumbImageFloater" />');
									
									var myImg = $(this).siblings('a').find('img').eq(0);
									if(myImg.length > 0) _img.append($(this).clone());
									_img.append($(myImg).clone() );
									$(_img).css('width',Math.floor(100/$('tr',tileObj).eq(0).find('span.label').length)+'%')

									if(myImg.length > 0) allImgs.append(_img);
								});
								console.log('all',allImgs);
								$('tr',tileObj).eq(0).replaceWith(allImgs);
								//metadata panel...
								//move to click on hovered image in leaflet
								$('#floatingMeta').html(tileObj).prepend('<div class="closeButton" id="closeFloatingMeta">X</div>').addClass('showing');
								$('#floatingMeta #closeFloatingMeta').off('click').on('click',function(e){
									$('#floatingMeta').removeClass('showing')
								})
							})
							
							L.DomEvent.on(that._imageLayers[img]._image, 'mouseover', function(e) {
							    console.log('mouseover overlay',e)
							    var _id = $(this).attr('data-id');
								var meta = that._imageMeta[_id];
								console.log('imagemeta',meta);
							    that._imageLayers[img].bringToFront();
							    $('img').removeClass('ishovered');
								$(that._imageLayers[img]._image).addClass('ishovered')
								
								setTimeout(function(){
									var offs = $(that._imageLayers[img]._image).offset();
									that.triggerHoverTip(meta,offs.left,offs.top+$(that._imageLayers[img]._image).height()+5);
								},200)
							})
							console.log('layers',that._imageLayers[img],hit)
							$(that._imageLayers[img]._image).attr('data-id',hitId);
							that._imageMeta[hitId] = hit; //cache our hit
							//var imag  = $('<img data-src="'+img+'" src="'+canvas.toDataURL()+'" data-id="'+hitId+'" alt="'+hitId+'" />')
							var imag  = $('<img data-src="'+img+'" src="'+img+'" data-id="'+hitId+'" alt="'+hitId+'" />')
							
							$('#imageGrid').append(imag);
							imag.on('mouseover',function(e){
								var _id = $(this).attr('data-id');
								var meta = that._imageMeta[_id];
								
								setTimeout(function(){
									var offs = $(that._imageLayers[imag.attr('src')]._image).offset();
									that.triggerHoverTip(meta,offs.left,offs.top+$(that._imageLayers[imag.attr('src')]._image).height()+5);

								},400)
							})
							imag.on('click',function(e){
								e.preventDefault();
								console.log('clicked image overlay',e)
							    var _id = $(this).attr('data-id');
								var meta = that._imageMeta[_id];
								var imgOverlay = that._imageLayers[img];
								console.log('meta is',meta);
								var coords = meta.fields.metadata.center.coordinates;
								var ll = new L.LatLng(coords[1],coords[0]);
								var tileObj = $($('#map_'+_id).parents('tr')[1]).clone();
								var offs = $(this).offset();

								var fmr = $('#backSide').offset().left+20
								//var fmt = offs.top - 20 - $('#floatingMeta').height();
								//$('#floatingMeta').css('left',fml)
								$('#floatingMeta').css('left',fmr)
								var allImgs = $('<div id="floatingImages" />');

								var imgPanel = $('tr',tileObj).eq(0).find('span.label').each(function(i,x){
									var _img = $('<div class="thumbImageFloater" />');
									
									var myImg = $(this).siblings('a').find('img').eq(0);
									if(myImg.length > 0) _img.append($(this).clone());
									_img.append($(myImg).clone() );
									$(_img).css('width',Math.floor(100/$('tr',tileObj).eq(0).find('span.label').length)+'%')

									if(myImg.length > 0) allImgs.append(_img);
								});
								console.log('all',allImgs);
								$('tr',tileObj).eq(0).replaceWith(allImgs);
								//metadata panel...
								//move to click on hovered image in leaflet
								$('#floatingMeta').html(tileObj).prepend('<div class="closeButton" id="closeFloatingMeta">X</div>').addClass('showing');
								$('#floatingMeta #closeFloatingMeta').off('click').on('click',function(e){
									$('#floatingMeta').removeClass('showing')
								})
							})
						}
					},10)
				}
				
			}
		}
		return canvasCropper;
	}
)