define(
[
	'bower_components/flight/lib/component',
	'bower_components/flight/lib/compose'
],
function(defineComponent,compose){
	return defineComponent(facetViewMenu);
	function facetViewMenu(){
		this.after('initialize',function(){
			var _this = this;
			var sI = setInterval(function(){
				if($(_this.attr.config.menuSelector).length >= 1){
					if($(_this.attr.config.menuSelector).parent().width() > 0 && $(_this.attr.config.menuSelector).parent().height() > 0){
						clearInterval(sI);
						setTimeout(function(){
							_this.initFacetViewMenu();
						},1000)
					}
				}
			},10)
			/*setTimeout(function(){
				_this.initFacetViewMenu();
			},100)*/
		})
		this.initFacetViewMenu = function(){
			console.log('and config',this.attr);
			this.facetViewDOMObject = this.attr.config.filterDOMObject;
			var sel = this.attr.config.menuSelector;

			var pos = $('body').find(sel).offset();
			var w = $('body').find(sel).width();
			var h = $(window).height()+50;
			console.log('widthheight',w,h)
			var par = $('body').find(sel).parent();
			$(par).css({width:w+'px',height:h+'px',float:'left'})
			$('body').find(sel).remove();//.css('display','none');
			console.log('obj is',this.facetViewDOMObject)
			//setTimeout(function(){
			$('body').append(this.facetViewDOMObject).css('display','block');
			$(par).find('table').css('display','block')
			//},100);
			
			//$(this.facetViewDOMObject).attr('id','facetview_filters')
			$(par).addClass('sidebar-nav-fixed')
			$(this.facetViewDOMObject).css({left:pos.left,top:pos.top,width:w+'px',height:h+'px',position:'fixed',maxHeight:h+'px',float:'left'});
			$(this.facetViewDOMObject).click(function(){
				
			})
			function sizing() {
			  var windowwidth=$(window).width();
			  var containerwidth=$('.container').width();
			  var diff=windowwidth-containerwidth+40;
			  $('#leftmargin').text("window="+ windowwidth+",container="+containerwidth);
			  if(diff>0) {
			    $('#leftmargin').css('margin-left', (diff/2) +'px');
			  } else {
			    $('#leftmargin').css('margin-left', '20px');
			  }
			}
			$(document).ready(sizing);
			$(window).resize(sizing);
		}
	}
}
);