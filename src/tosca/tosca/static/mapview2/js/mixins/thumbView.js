define(
	[],
	function(){
		return thumbView;
		function thumbView(){
			this.initThumbView = function(){
				var _this = this;
				//setTimeout(function(){
				//$('#facetview_results').addClass('thumbView');
				//},5000)
				$('#backButton').after('<div class="flipMapButton" id="listViewButton"><img class="optIcon" src="static/mapview2/img/listIcon.png" alt="List" />List</div>');
				$('#backButton').after('<div class="flipMapButton" id="thumbButton"><img class="optIcon" src="static/mapview2/img/thumbIcon.png" alt="Thumbs" />Thumbs</div>');	
				$('#backButton').after('<div class="flipMapButton" id="thumbButton2"><img class="optIcon" src="static/mapview2/img/gridIcon.png" alt="Grid" />Grid</div>')
				$('#listViewButton').on('click',function(){
					_this.addListView();
				})
				$('#thumbButton').on('click',function(){
					_this.addThumbView();
				})
				$('#thumbButton2').on('click',function(){
					_this.addThumbView2();
				})

				$(document).on('mouseover','#facetview_results.thumbView tr tr',function(e){
					var pos = $(this).offset();
					var w = $('.img-rounded').eq(0).width();//$(this).parents('div').width();
					$('.img-rounded').css({'opacity':1,zIndex:1,'box-shadow':'none'});
					$('.img-rounded',this).each(function(){
						var deg = Math.random()< 0.5 ? -1 : 1;
						deg = Math.random() * 6 * deg;
						$(this).css('transform','rotate('+deg+'deg)')
					})
					$('.img-rounded',this).css({'opacity':1,zIndex:100000,'box-shadow':'3px 3px 40px #000','transform':'rotate(0deg)'})
					var len = $('.img-rounded',this).length;
					var gridOffset = 0;
					var gridLength = 0;
					console.log('and a mouse over',len)
					if(len >=3 && len < 9){
						gridOffset = - w+75;
						gridLength = 3;
					}
					else if(len > 9 && len < 25){
						gridOffset = -w * 2+75;
						gridLength = 5;
					}
					var j = -1;
					var this_ = this;
					for(var i=0;i<len;i++){
						if(i % gridLength == 0 && i != 0){
							j++;
						}
						var xPosGrid = i >= gridLength ? i%gridLength : i;

						var yPosGrid = j;
						var posX = gridOffset + (xPosGrid * w);
						var posY = j*w;
						var labelTop = posY+w-$('.img-rounded',this_).eq(i).parents('a').siblings('span').height()
						

						$('.img-rounded',this_).eq(i).css({top:posY,left:posX,zIndex:100000})//.css('transform','translate('+posX+'px,'+posY+'px)')
						$('.img-rounded',this_).eq(i).parents('a').siblings('span').css({'transition':'all 0.1s linear','position':'absolute',top:labelTop,left:posX,opacity:0.8,zIndex:100001})
					}
					var mapX = gridOffset;
					var mapY = ((j+1)*w) + 20;
					if(len < Math.pow(gridLength,2)/2){
						mapX = 85;
						mapY = 10;
					}
					$('.map',this_).css({'transform':'translate('+mapX+'px,'+mapY+'px) rotate(0deg)',zIndex:100000,'box-shadow':'0px 0px 20px #000'})
				});
				$(document).on('mouseleave','#facetview_results.thumbView tr tr',function(e){
					//alert('off')
						$('.img-rounded',this).css({top:0,left:0});
						$('.img-rounded',this).each(function(){
							var deg = Math.random()< 0.5 ? -1 : 1;
							deg = Math.random() * 6 * deg;
							$(this).css({'transform':'rotate('+deg+'deg)',opacity:1,zIndex:1,'box-shadow':'none'});
							$(this).parents('a').siblings('span').css({'position':'static',top:0,left:0,opacity:1,zIndex:0})
						})
						$('.map',this).css({'transform':'translate(0px,0px) rotate(0deg)',zIndex:0,'box-shadow':'none'})
				})
			}
			this.addListView = function(){
				$('#facetview_results').removeClass('thumbView2').removeClass('thumbView');
			
			}
			this.addThumbView = function(){
				$('#facetview_results').removeClass('thumbView2').addClass('thumbView');
				//$('#facetview_results tr td:nth-child(even)')
			}
			this.addThumbView2 = function(){
				var _this = this;
				var sICanRun = false;
				$('#facetview_results').removeClass('thumbView').addClass('thumbView2')
				var grps = []
				var maxW,minW,maxH,minH;
				$('#facetview_results tr table').each(function(i,resGrp){
					var images = $('.img-rounded',this);
					var id = $('td',this).eq(0).find('div').eq(0).attr('id');

					$.each(images,function(ii,xx){
						if(typeof minH == "undefined"){
							minW = xx.width;
							maxW = xx.width;
							minH = xx.height;
							maxH = xx.height;
						}

						if(xx.height < minH) minH = xx.height;
						if(xx.height > maxH) maxH = xx.height;
						if(xx.width < minW) minW = xx.width;
						if(xx.width < maxW) maxW = xx.width;
					})
					var maps = $('.map',this);
					if(images.length >0)
					grps.push({img:images,maps:maps,id:id});
				})
				//console.log('groups',grps)
				var tiles = $('<div id="thumbTiles"></div>');
				tiles.append('<div class="closeButton">X</div>');
				tiles.append('<div class="nextButton">[ Next page ]</div>')
				var pairedColor = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"];
				console.log('grouplen',grps.length,grps)
				
				$.each(grps,function(i,g){
					var id = g.id.replace('img_grid_','');
					$.each(g.img,function(ii,img){
						console.log('image',img)
						var cSrc = $(img).clone();
						var c = cSrc[0];
						var src = cSrc.attr('src');
						//c.src = src;
						var cont = $('<div class="thumbTile" data-id="'+id+'"></div>');
						cont.attr('data-color',pairedColor[i]);

						cont.css({'background':pairedColor[i],width:maxW/2,height:maxH/2});
						var wrapC = $('<a href="'+src+'" target="_blank"></a>');
						wrapC.append(c);
						cont.append(wrapC);
						tiles.append(cont);

						c.onload = function(){
							var sI = setInterval(function(){
								if(c.height > 0){
									clearInterval(sI);
									c = $(c);
									c.attr('data-color',pairedColor[i]);
									var mT = (maxH/2 - c.height/2 ) / 2;
									var mL = (maxW/2 -c.width/2 ) / 2;
									c.css({width:c.width/2,height:c.height/2,marginLeft:mL,marginTop:mT});
									
									
								}
							},10)
						}
						
					})
					var m = $(g.maps[0]).clone();
					m.attr('data-color',pairedColor[i]);
					m.css({width:maxW/2,height:maxH/2});
					var cont = $('<div class="thumbTile" data-id="'+id+'"></div>');
					cont.attr('data-color',pairedColor[i]);

					cont.css({'background':pairedColor[i],width:maxW/2,height:maxH/2});
					cont.append(m);
					tiles.append(cont);
				});
				$('#thumbTiles').remove();
				$('body').append(tiles);
				$('.closeButton',tiles).off('click').on('click',function(e){
					$('#thumbTiles').fadeOut();

				})
				$('.thumbTile',tiles).off('click').on('click',function(e){
					e.preventDefault();

					console.log('clicked',$(this).attr('data-id'),$('.leaflet-image-layer[data-id="'+$(this).attr('data-id')+'"]'))
					$('.leaflet-image-layer[data-id="'+$(this).attr('data-id')+'"]').click();
				})
				$('.nextButton',tiles).off('click').on('click',function(e){
					sICanRun = false;
					$('.pagination .facetview_increment').trigger('click');
					$('.thumbTile',tiles).fadeOut();
					var sI = setInterval(function(){

						if(sICanRun && $('.img-rounded').length > 0){
							console.log('h',$('.img-rounded')[0].height)
							if($('.img-rounded')[0].height > 0)
							setTimeout(function(){
								clearInterval(sI);
								_this.addThumbView2();
							},100)
							
						}		
					},100)
				})
				$(document).on('updatedResultList',function(e,meta){
					console.log('updated results!');
					//$('.img-rounded').remove();
					setTimeout(function(){
						sICanRun = true;
					},1000)
					
				})
			}	
		}
	}
);
