define(
[
	'bower_components/flight/lib/component',
	'bower_components/flight/lib/compose',
	'js/components/facetViewMenuComponent',
	'js/mixins/backMap',
	'js/mixins/thumbView',
	'jquery',
	'jqFacetView',
	'leaflet',
	'leafletDraw'
],
function(defineComponent,compose,FacetViewMenu,backMap,thumbView){
	return defineComponent(mainAppView);
    function mainAppView(){
    	this.after('initialize',function(){
    		var that = this;
    		this.overrideFacetViewDefaults();
    		//alright, after the main view component is init, lets start doing stuff.
            this.injectCSS();//inject our own CSS into the <head>
            this.initFacetView();//and kick off facetView, then fork the browse options to it's own component...
            console.log('init');
            //testing
            $('.flipMapButton').on('click',function(){
              $('#imageTooltip').hide();
            	$('#backSide').css('width',$('#frontSide').width()+30)
            	$('#flipCard').toggleClass('flipped');
            	if($('#flipCard').hasClass('flipped')){
            		$('#facetview_filters').addClass('isBack');
            	}
            	else{
            		$('#facetview_filters').removeClass('isBack')
            	}
            	if(typeof that._map != "undefined")
            		that._map.invalidateSize();
            	//setTimeout(function(){alert('d');that._map.panTo(new L.LatLng(0,0));},3500);
            })

            compose.mixin(this,[backMap]);
            //ok init our new map we mixed in
            this.initMap('backMap'); //and we pass in the dom ID string that leaflet will attach to...
        	//and now mixin our gridview
        	compose.mixin(this,[thumbView]);
        	this.initThumbView();
        })
        this.overrideFacetViewDefaults = function(){
        	var that = this;
        	//anything to override jquery.facetview.js native behaviors, thus not to ever modify their source code
        	jQuery.extend({
    			//rewrote the native jquery.facetview geturlvars method because it's crap....
			    getUrlVars: function() {
			        var params = new Object;
			        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			        for ( var i = 0; i < hashes.length; i++ ) {
			            hash = hashes[i].split('=');
			            if ( hash.length > 1 ) {
			                if ( hash[1].replace(/%22/gi,"")[0] == "[" || hash[1].replace(/%22/gi,"")[0] == "{" ) {
			                    
			                    hash[1] = hash[1].replace(/\%22/g,'"');
			                    hash[1] = hash[1].replace(/\%20/g,' ');
			                    hash[1] = hash[1].substring(hash[1].length-1) == '/' ? hash[1].substring(0,hash[1].length-1) : hash[1];
			                    console.log('hash is',hash)
			                    var newval = JSON.parse(hash[1]);
			                } else {
			                    var newval = unescape(hash[1].replace(/%22/gi,'"'));
			                }
			                params[hash[0]] = newval;
			            }
			        }
			        return params;
			    },
			    getUrlVar: function(name){
			        return jQuery.getUrlVars()[name];
			    }
			});
			$.ajaxSetup({
                global:true
            });
            //intercept AJAX requests::
            $(document).ajaxComplete(function(e, xhr, settings){
                console.log('request success',xhr.responseJSON,e,settings)
                var json = xhr.responseJSON;
                if(typeof json != "undefined"){
                	//ok it's json, now what!?
                	if(typeof json.hits != "undefined"){
                		//ok it's the response we were looking for. Now handle some data...
                		that.handleInterceptedJSON(json);
                    $(document).trigger('updatedResultList')
                	}
                }
            })
			
        }
        this.handleInterceptedJSON = function(data){
        	//takes a JSON search response, makes sure it's a search from jquery.facetview, then gives us the resp to do etc with
        	if(typeof this._map != 'undefined'){
        		//ok, we have some kind of map! Let's poop out some results there.
        		this.plotMapResult(data.hits);
        	}
        	console.log('this res',data)
        }
    	this.initFacetView = function(){
    		var _this = this;
    		//ok attach this crufty badboy...
    		  //Tags.bootstrapVersion = "2";
    		  function add_user_tag(id, tag) {
				  ////console.log("Adding tag '" + tag + "' to " + id);
				  $.ajax({
				    type: 'POST',
				    url: _this.attr.config.tagBaseURL+'services/user_tags.add_user_tag',
				    data: { id: id, tag: tag }
				  }); 
				}

				function remove_user_tag(id, tag) {
				  //console.log("Removing tag '" + tag + "' to " + id);
				  $.ajax({
				    type: 'POST',
				    url: _this.attr.config.tagBaseURL+'services/user_tags.remove_user_tag',//"{{ url_for('services/user_tags.remove_user_tag') }}",
				    data: { id: id, tag: tag }
				  }); 
				}

  // global backdrop
  var backdrop = null;

  $('.facet-view-simple').facetview({
    search_url: _this.attr.config.facetviewBaseURL,
    search_index: 'elasticsearch',
    facets: [
        {'field':'metadata.user_tags.untouched', 'display': 'user tags'},
        {'field':'system_version', 'display': 'system version'}, 
        {'field':'dataset', 'display': 'dataset'}, 
        {'field':'metadata.platform', 'display': 'platform'},
        {'field':'metadata.corrections.untouched', 'display': 'corrections'},
        {'field':'metadata.spacecraftName', 'display': 'spacecraft'},
        {'field':'metadata.direction', 'display': 'orbit direction'},
        {'field':'metadata.lookDirection', 'display': 'look direction'},
        //{'field':'metadata.orbitNumber', 'display': 'orbit number', 'type': 'number'},
        {'field':'metadata.orbitRepeat', 'display': 'orbit repeat'},
        {'field':'metadata.trackNumber', 'display': 'track number'},
        {'field':'metadata.beamID', 'display': 'beam ID'},
        //{'field':'metadata.beamNumber', 'display': 'beam number', 'type': 'number'},
        {'field':'metadata.sensingStart', 'display': 'sensing date', 'type': 'date'},
        {'field':'metadata.latitudeIndexMin', 'display': 'lat index min'},
        {'field':'metadata.latitudeIndexMax', 'display': 'lat index max'},
        {'field':'metadata.dfas.RequestorUserId.untouched', 'display': 'requestor'},
        {'field':'metadata.dfdn.ProductType.untouched', 'display': 'product type'},
        {'field':'metadata.dfdn.AcquistionMode', 'display': 'acquisition mode'},
        {'field':'metadata.dfdn.LookSide', 'display': 'look side'},
        {'field':'metadata.dfdn.DeliveryMode', 'display': 'delivery mode'},
        {'field':'metadata.tags.untouched', 'display': 'tags'},
        {'field':'metadata.version', 'display': 'version'}, 
        {'field':'continent.untouched', 'display': 'continent'},
        {'field':'city.country_name.untouched', 'display': 'country'},
        {'field':'city.admin1_name.untouched', 'display': 'region'},
        {'field':'city.admin2_name.untouched', 'display': 'subregion'},
        {'field':'city.name.untouched', 'display': 'city'}
    ],
    time_fields: [
        'metadata.sensingStart',
    ],
    location_field: 'location',
    json_fields: [
        'metadata.user_tags',
        'images'
    ],
    filterchoice_result_fields: {
        'metadata.version': 'metadata.version',
        'metadata.tags': 'metadata.tags.untouched',
        'metadata.corrections': 'metadata.corrections.untouched',
        'continent': 'continent.untouched',
        'city.admin2_name': 'city.admin2_name.untouched',
        'city.admin1_name': 'city.admin1_name.untouched',
        'city.country_name': 'city.country_name.untouched',
        'city.name': 'city.name.untouched',
        'metadata.spacecraftName': 'metadata.spacecraftName',
        'metadata.direction': 'metadata.direction',
        'metadata.lookDirection': 'metadata.lookDirection',
        'metadata.orbitNumber': 'metadata.orbitNumber',
        'metadata.orbitRepeat': 'metadata.orbitRepeat',
        'metadata.trackNumber': 'metadata.trackNumber',
        'metadata.beamNumber': 'metadata.beamNumber',
        'metadata.latitudeIndexMin': 'metadata.latitudeIndexMin',
        'metadata.latitudeIndexMax': 'metadata.latitudeIndexMax',
        'metadata.dfdn.ProductType': 'metadata.dfdn.ProductType.untouched',
        'metadata.dfas.RequestorUserId': 'metadata.dfas.RequestorUserId.untouched'
    },
    enable_rangeselect: true,
    enable_locationselect: true,
    paging: {
      from: 0,
      size: 10
    },
    pager_on_top: true,
    sort: [{ '_timestamp': { "order": "desc"} }],
    fields: [ '_timestamp', '_source'],
    display_images: false,
    pre_search_callback: function() {
      if (backdrop === null) {
        // fade the backdrop in
        var animate = 'fade';
        var doAnimate = $.support.transition && animate;
        backdrop = $('<div class="loading-backdrop ' + animate + '" />').appendTo(document.body);
        if (doAnimate) backdrop[0].offsetWidth;
        backdrop.addClass('in');
        if (doAnimate) backdrop.one($.support.transition.end, function() {});
      }
    },
    post_search_callback: function() {
      // remove the backdrop
      $(".loading-backdrop").remove();
      backdrop = null;
    },
    grq_results_limit: 50000,
    word_cloud: false,
    result_display: [
      [
        {
          "pre": " <strong>",
          "field": "id",
          "post": "</strong>"
        },
        {
          "pre": " (",
          "field": "dataset",
          "post": ")"
        }
      ],
      [
        {
          "pre": "<table><tr><td><div id='img_grid_",
          "field": "id",
          "post": "'></div><script>$(function() {\n" +
                  "  var imgData = [];\n" +
                  "  var browseUrl = null;\n" +
                  "  var prodUrl = null;\n"
        },
        {
          "pre": "  prodUrl = '",
          "field": "urls",
          "post": "';\n"
        },
        {
          "pre": "  var browseUrl = '",
          "field": "browse_urls",
          "post": "';\n"
        },
        {
          "pre": "  imgData = ",
          "field": "images",
          "post": ";\n"
        },
        {
          "pre": "  var id='",
          "field": "id",
          "post": "';\n" +
                  "  if (imgData.length == 0 && prodUrl != null && browseUrl != null)\n" +
                  "    imgData.push({\n" +
                  "      img: 'browse.png',\n" +
                  "      small_img: 'browse_small.png',\n" +
                  "      tooltip: ''\n" +
                  "    });\n" +
                  "  var grid =  $('div[id=\"img_grid_' + id + '\"]');\n" +
                  "  grid.append('<table><tr>');\n" +
                  "  for (var i=0; i<imgData.length; i++) {\n" +
                  "    var img_url = prodUrl + '/' + imgData[i].img;\n" +
                  "    var small_img_url = browseUrl + '/' + imgData[i].small_img;\n" +
                  "    var tooltip = '';\n" +
                  "    if (typeof imgData[i].tooltip == 'string' || imgData[i].tooltip instanceof String) {\n" +
                  "      if (imgData[i].tooltip.length > 0) \n" +
                  "        tooltip = '<span class=\"label label-info\">' + imgData[i].tooltip + '</span>';\n" +
                  "    }\n" +
                  "    grid.append('<td>' + tooltip + '<a target=\"_blank\" href=\"' + img_url + '\">" +
                  "<img src=\"' + small_img_url + '\" class=\"img-rounded\" width=\"250px\" " +
                  "height=\"250px\" /></a></td>');\n" +
                  "    if (i % 3 == 2) grid.append('</tr><tr>');\n" +
                  "  }\n" +
                  "  grid.append('<td><span class=\"label label-info\">region</span><div id=\"map_' + id + '\" class=\"map\"></div></td></tr></table>');\n" +
                  "});<\/script>"
        }
      ],
      [
        {
          "pre": "</td></tr><tr><td><div class='hidden'>",
          "field": "id",
          "post": "</div>"
        },
        {
          "pre": "tags: <font color='blue'>", 
          "field": "metadata.tags", 
          "post": "</font>" 
        }
      ],
      [
        {
          "pre": "corrections: <font color='blue'>", 
          "field": "metadata.corrections", 
          "post": "</font>" 
        }
      ],
      [
        {
          "pre": "version: <font color='blue'>", 
          "field": "metadata.version", 
          "post": "</font>" 
        },
      ],
      [
        {
          "pre": "system version: <font color='blue'>", 
          "field": "system_version", 
          "post": "</font>" 
        },
      ],
      [
        {
          "pre": "continent: <font color='blue'>",
          "field": "continent",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "location: <div class='hidden'>",
          "field": "id",
          "post": "</div><font color='blue'>"
        },
        {
          "pre": "",
          "field": "city.admin2_name",
          "post": ", "
        },
        {
          "pre": "",
          "field": "city.admin1_name",
          "post": ", "
        },
        {
          "pre": "",
          "field": "city.country_name",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "cities: <font color='blue'>",
          "field": "city.name",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "<script>$(function() { var map = L.map('map_",
          "field": "id",
          "post": "', {worldCopyJump: true, center: [0,0], zoom: 0, zoomControl: false});\n" +
                  "L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {\n" +
                  "  maxZoom: 18\n" +
                  "}).addTo(map);\n"
        },
        {
          "pre": "var coords = [",
          "field": "location.coordinates",
          "post": "];\n" +
                  "var coords_geojson = [];\n" +
                  "for (var i=0; i<coords.length; i++) {\n" +
                  "  if (i%2 == 0) {\n" +
                  "    var point = [ coords[i], coords[i+1] ];\n" +
                  "    coords_geojson.push(point);\n" +
                  "  }\n" +
                  "}\n"
        },
        {
          "pre": "var location_type = '",
          "field": "location.type",
          "post": "';\n" +
                  "if (location_type == 'linestring') {\n" +
                  "  var geojson_type = 'LineString';\n" +
                  "}else {\n" +
                  "  var geojson_type = 'Polygon';\n" +
                  "  coords_geojson = [ coords_geojson ];\n" +
                  "}\n" +
                  "var geojson = {\n" +
                  "  'type': 'Feature',\n" +
                  "  'properties': {\n" +
                  "    'name': 'test name',\n" +
                  "    'amenity': 'test amenity',\n" +
                  "    'popupContent': 'This is the popup content'\n" +
                  "  },\n" +
                  "  'geometry': {\n" +
                  "    'type': geojson_type,\n" +
                  "    'coordinates': coords_geojson\n" +
                  "  }\n" +
                  "};\n" +
                  "L.geoJson(geojson).addTo(map);\n"
        },
        {
          "pre": "var center = [",
          "field": "metadata.center.coordinates",
          "post": "];\n" +
                 "map.setView([center[1], center[0]], 7);\n" +
                  "});\n" +
                  "<\/script>"
        },
        {
          "pre": "bbox: <font color='blue'>",
          "field": "metadata.bbox",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "sensing start: <font color='blue'>",
          "field": "metadata.sensingStart",
          "post": "</font> | "
        },
        {
          "pre": "sensing stop: <font color='blue'>",
          "field": "metadata.sensingStop",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "spacecraft name: <font color='blue'>",
          "field": "metadata.spacecraftName",
          "post": "</font> | "
        },
        {
          "pre": "track number: <font color='blue'>",
          "field": "metadata.trackNumber",
          "post": "</font> | "
        },
        {
          "pre": "beam number: <font color='blue'>",
          "field": "metadata.beamNumber",
          "post": "</font> | "
        },
        {
          "pre": "lat index min: <font color='blue'>",
          "field": "metadata.latitudeIndexMin",
          "post": "</font> | "
        },
        {
          "pre": "lat index max: <font color='blue'>",
          "field": "metadata.latitudeIndexMax",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "orbit direction: <font color='blue'>",
          "field": "metadata.direction",
          "post": "</font> | "
        },
        {
          "pre": "look direction: <font color='blue'>",
          "field": "metadata.lookDirection",
          "post": "</font> | "
        },
        {
          "pre": "orbit number: <font color='blue'>",
          "field": "metadata.orbitNumber",
          "post": "</font> | "
        },
        {
          "pre": "orbit repeat: <font color='blue'>",
          "field": "metadata.orbitRepeat",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "vertical baseline: <font color='blue'>",
          "field": "metadata.verticalBaseline",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "horizontal baseline: <font color='blue'>",
          "field": "metadata.horizontalBaseline",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "perpendicular baseline: <font color='blue'>",
          "field": "metadata.totalBaseline",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "reference: <font color='blue'>",
          "field": "metadata.reference",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "product type: <font color='blue'>",
          "field": "metadata.dfdn.ProductType",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "requestor: <font color='blue'>",
          "field": "metadata.dfas.RequestorUserId",
          "post": "</font>"
        }
      ],
      [
        {
          "pre": "user tags:<div id='user_tags_",
          "field": "id",
          "post": "'></div><script>$(function() {\n" +
                  "  var tagData = null;\n"
        },
        {
          "pre": "  tagData = ",
          "field": "metadata.user_tags",
          "post": ";\n"
        },
        {
          "pre": "  var id='",
          "field": "id",
          "post": "';\n" +
                  "  var tags =  $('div[id=\"user_tags_' + id + '\"]').tags({\n" +
                  "    tagSize: 'sm',\n" +
                  "    tagData: tagData,\n" +
                  "    afterAddingTag: function(t) { add_user_tag(id, t); },\n" +
                  "    afterDeletingTag: function(t) { remove_user_tag(id, t); }\n" +
                  "  });\n" +
                  "});<\/script>"
        }
      ],
      [
        {
          "pre": ' <a class="btn btn-success" target="_blank" href="',
          "field": "urls",
          "post": '">Browse</a></td></tr></table>'
        }
      ],
    ]
  });

  // init range_slider_start
  /*
  $( "#range_slider_starttime" ).dateRangeSlider({
    bounds: {
      min: new Date(2000, 0, 1),
      max: new Date()
    },
    defaultValues: {
      min: new Date(2000, 0, 1),
      max: new Date()
    } 
  }); 
  */

  // set tablecloth
  /*var rules_table = $('#rules_table').tablecloth({
    theme: "stats",
    striped: true,
    condensed: true
  });*/

  // validate form
  /*var validator = $( '#rule_form' ).validate({
    rules: {
      rule_name: {
        required: true
      },
      query_string: {
        required: true
      },
      workflow: {
        minlength: 1,
        required: true
      }
    },
    messages: {
      rule_name: "Please specify a name for this rule.",
      workflow: "Please select an action."
    }
  });*/

  // show rules modal
  $('#my_rules').on('click', function() {
    $.ajax({
      url: "user_rules/list",
      success: function(data, sts, xhr) {
        //console.log(data);
        $('#general_error').html("");

        // clear table
        var tbody = $('#rules_table > tbody'); 
        tbody.empty();

        // populate table
        for (var i=0; i < data.rules.length; i++) {
          var status_cell = "<td><button class='btn btn-mini btn-danger toggle_rule' type='button' value='" +
                            data.rules[i]['id'] + "'>Off</button></td>";
          if (data.rules[i]['enabled'])
            status_cell = "<td><button class='btn btn-mini btn-success toggle_rule' type='button' value='" +
                          data.rules[i]['id'] + "'>On</button></td>";
          tbody.append("<tr id='rule_" + data.rules[i]['id'] + "'>" +
                       "<td>" + data.rules[i]['rule_name'] + "</td>" +
                       "<td>" + data.rules[i]['query_string'] + "</td>" +
                       "<td>" + data.rules[i]['workflow'] + "</td>" +
                       "<td>" + data.rules[i]['kwargs'] + "</td>" +
        
                       status_cell +
                       "<td><button class='btn btn-mini btn-primary edit_rule' type='button' value='" + 
                       data.rules[i]['id'] + "'>Edit</button></td>" +
                       "<td><button class='btn btn-mini btn-warning remove_rule' type='button' value='" + 
                       data.rules[i]['id'] + "' rule_name='" + data.rules[i]['rule_name'] + 
                       "'>Delete</button></td></tr>");
        }

        // append handlers to status buttons
        $('button.toggle_rule').on('click', function() {
          var button = $(this);
          var rule_id = button.attr('value');
          var cur_status = button.text();
          if (cur_status == "Off") {
            var new_status_text = "On";
            var new_status = "true";
            var remove_class = "btn-danger";
            var add_class = "btn-success";
          }else {
            var new_status_text = "Off";
            var new_status = "false";
            var remove_class = "btn-success";
            var add_class = "btn-danger";
          }
          $.ajax({
            type: "POST",
            url: "user_rules/toggle_status",
            data: {
              id: rule_id,
              enabled: new_status
            },
            success: function(data, sts, xhr) {
              button.toggleClass(remove_class + " " + add_class).text(new_status_text);
            },
            error: function(xhr, sts, err) {
              $('#general_error').html("Error: " + xhr.responseText);
              $('#error_modal').modal('show').css({'left': set_left_margin});
            }
          });
        });

        // append handlers to delete buttons
        $('button.remove_rule').on('click', function() {
          var rule_id = $(this).attr('value');
          var rule_name = $(this).attr('rule_name');
          $('#delete_rule_name').text(rule_name);
          $('#delete_rule_id').val(rule_id);
          $('#confirm_delete_modal').modal('show').css({'left': set_left_margin});
        });

        // append handlers to edit buttons
        $('button.edit_rule').on('click', function() {
          var parent_tr = $(this).closest('tr');
          var rule_id = $(this).attr('value');
          $('#rule_id').val(rule_id);
          $('#rule_name').val(parent_tr.children().eq(0).text());
          $('#query_string').val(parent_tr.children().eq(1).text());
          $('#workflow_val').val(parent_tr.children().eq(2).text());
          $('#kwargs').val(parent_tr.children().eq(3).text());
          $('#rule_modal_label').text("Edit Rule");
          $('#rule_modal').modal('show').css({'left': set_left_margin});
          $('#list_rules_modal').modal('hide');
        });

        // show modal
        $('#list_rules_modal').modal('show').css({'left': set_left_margin});
      },
      error: function(xhr, sts, err) {
        //console.log(xhr);
        $('#general_error').html("Error: " + xhr.responseText);
        $('#error_modal').modal('show').css({'left': set_left_margin});
      }
    });
    return false;
  });

  // handler for confirm_delete_btn
  $('#confirm_delete_btn').on('click', function() {
    var rule_id = $('#delete_rule_id').val();
    $.ajax({
      type: "POST",
      url: "user_rules/remove",
      data: {
        id: rule_id
      },
      success: function(data, sts, xhr) {
        $('#rule_' + rule_id).remove();
        $('#confirm_delete_modal').modal('hide');
        $('#general_error').html("");
      },
      error: function(xhr, sts, err) {
        $('#confirm_delete_modal').modal('hide');
        $('#general_error').html("Error: " + xhr.responseText);
        $('#error_modal').modal('show').css({'left': set_left_margin});
      }
    });
  });

  // handler for rule_modal
  $('#rule_modal').on('show', function() {
    $('#ajax_error').html("");
    var rule_id = $('#rule_id').val();

    // check if we're in add mode
    if (rule_id === "") {
      var edit_mode = false;
      var cur_kwargs = {};

      // reset everything
      $('#dynamic_fields').empty();
      validator.resetForm();

      // populate query_string
      var query_json = JSON.stringify(JSON.parse(QUERY_STRING).query, null, '  ');
      $('#query_string').val(query_json);
      //$('#query_string').val(query_json).attr('disabled', true);
    }else {
      var edit_mode = true;
      var cur_kwargs = JSON.parse($('#kwargs').val());
    }
    //console.log("workflow_val: " + $('#workflow_val').val());
    //console.log("kwargs: " + $('#kwargs').val());

    // get actions config
    $.ajax({
      url: "user_rules/actions_config",
      success: function(data, sts, xhr) {
        //console.log(data);
        // populate workflow/action select options
        var workflow = $('#workflow');
        workflow.empty();
        workflow.append("<option value=''></option");
        var actions_cfg = {};
        for (var i=0; i < data.actions.length; i++) {
          actions_cfg[data.actions[i].type] = data.actions[i];
          var disabled = data.actions[i].public ? ">" : "disabled>";
          workflow.append("<option value='" + data.actions[i].type + "' " +
                          disabled + data.actions[i].label + "</option>");
        }

        // add handler to build dynamic form on selected option
        workflow.change(function() {
          // build dynamic form
          var workflow_type = $(this).val();
          var dyn_fields = $('#dynamic_fields');
          dyn_fields.empty();
          var kwargs = actions_cfg[workflow_type].kwargs;
          for (var i=0; i < kwargs.length; i++) {
            var kwarg = kwargs[i];
            if (kwarg.type == "textbox") {
              dyn_fields.append("<div class='control-group'>" +
                                "<label class='control-label' for='" + 
                                kwarg.name + "'>" + kwarg.name + "</label>" +
                                "<div class='controls'>" +
                                "<input class='field span4' type='text' name='" + kwarg.name +
                                "' placeholder='" + kwarg.placeholder + "'></div></div>");
              $('#rule_form input[name=' + kwarg.name + ']').rules("add", kwarg.validator);
              if (kwarg.name in cur_kwargs)
                $('#dynamic_fields input[name=' + kwarg.name + ']').val(cur_kwargs[kwarg.name]);
            }else if (kwarg.type == "textarea") {
              dyn_fields.append("<div class='control-group'>" +
                                "<label class='control-label' for='" + 
                                kwarg.name + "'>" + kwarg.name + "</label>" +
                                "<div class='controls'>" +
                                "<textarea class='field span4' type='textarea' rows='5' name='" + kwarg.name +
                                "' placeholder='" + kwarg.placeholder + "'></textarea></div></div>");
              $('#rule_form textarea[name=' + kwarg.name + ']').rules("add", kwarg.validator);
              if (kwarg.name in cur_kwargs)
                $('#dynamic_fields textarea[name=' + kwarg.name + ']').val(cur_kwargs[kwarg.name]);
            }else {
            }
          }
        });

        // select the current workflow
        if (edit_mode) $('#workflow').val($('#workflow_val').val()).change();
      },
      error: function(xhr, sts, err) {
        //console.log(xhr.responseData);
        $('#general_error').html("Error: " + xhr.responseText);
        $('#error_modal').modal('show').css({'left': set_left_margin});
      }
    });
  });

  $('#rule_modal').on('hide', function() {
    $('#rule_id').val("");
    $('#workflow_val').val("");
    $('#kwargs').val("");
  });

  // handler for rule button
  $('#rule_btn').on('click', function() {
    var rule_id = $('#rule_id').val();

    // check if we're in add mode
    if (rule_id === "") var edit_mode = false;
    else var edit_mode = true;

    if ($('#rule_form').valid()) {
      //console.log("workflow: " + $('#workflow').val());
      //console.log("rule_name: " + $('#rule_name').val());
      //console.log("query_string: " + $('#query_string').val());
      df_fields = {};
      $.each($('#dynamic_fields').find('.field'), function(idx, value) {
        var dyn_input = $(value);
        df_fields[dyn_input.attr('name')] = dyn_input.val();
      });

      if (edit_mode) {
        var rule_data = {
          id: rule_id,
          rule_name: $('#rule_name').val(),
          workflow: $('#workflow').val(),
          query_string: $('#query_string').val(),
          kwargs: JSON.stringify(df_fields, null, '  ')
        };
        var update_url = "user_rules/edit";
      }else {
        var rule_data = {
          rule_name: $('#rule_name').val(),
          workflow: $('#workflow').val(),
          query_string: $('#query_string').val(),
          kwargs: JSON.stringify(df_fields, null, '  ')
        };
        var update_url = "user_rules/add";
      }
      $.ajax({
        type: "POST",
        url: update_url,
        data: rule_data,
        success: function(data, sts, xhr) {
          //console.log(data);
          $('#ajax_error').html("");
          $('#rule_modal').modal('hide');
        },
        error: function(xhr, sts, err) {
          //console.log(xhr);
          var resp = JSON.parse(xhr.responseText);
          $('#ajax_error').html("Error: " + resp.message);
        }
      });
    }
  });

  // handler for rule_modal
  $('#grq_call_modal').on('show', function() {
    var grq_query = JSON.parse(QUERY_STRING);
    if ('facets' in grq_query) delete grq_query['facets'];
    var grq_qs = JSON.stringify(grq_query, null);
    var grq_url = "http://grq.jpl.nasa.gov:8878/grq_es?dataset=ccmods&source=" + grq_qs;
    $('#grq_call_url').html("<a href='" + grq_url + "' target='_blank'>" + grq_url + "</a>");
  });

  // open up all facets on page load
  $('.facetview_filtershow').each(function(index, value) {
    $(value).click();
  });
			var sI = setInterval(function(){
				//wait for it to be there...
				//arrite lets fork some left browse options...
				//console.log('menu is',$(_this.attr.config.menuSelector).length)
				if($(_this.attr.config.menuSelector).length > 0){
					if($('.facetview_filters').eq(0).find('tr').length > 1){
						//hacky but not sure what's standard
						setTimeout(function(){
							var c = $(_this.attr.config.menuSelector).clone(true);//makes a deep copy with events/data/etc preserved...
							var config = _this.attr.config;
							config.filterDOMObject = c;
							FacetViewMenu.attachTo(document,{config:config});//take our existing global configs, then attach our clone to it.
							
						},100)
					clearInterval(sI);
				}
				}
			},100);
    	}
    	this.injectCSS = function(){
    		//inject our CSS into the app, cleaner than making dev's copy/paste a bunch of XML

        	var cacheFlag = '?cache='+new Date();//set this to an empty string if you dont want the CSS to cahce during dev...
            var css = this.attr.config.css;
            $.each(css,function(i,url){
                var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url+cacheFlag;
            document.getElementsByTagName("head")[0].appendChild(link);
            })
        

    	}
    };
});
